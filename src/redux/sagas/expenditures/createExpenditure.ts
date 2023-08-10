import { ClientType } from '@colony/colony-js';
import { takeEvery, fork, call, put, all } from 'redux-saga/effects';
import { BigNumber } from 'ethers';

import { Action, ActionTypes, AllActions } from '~redux';
import { ColonyManager, ContextModule, getContext } from '~context';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~redux/actionCreators';
import {
  CreateExpenditureMetadataDocument,
  CreateExpenditureMetadataMutation,
  CreateExpenditureMetadataMutationVariables,
} from '~gql';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import { toNumber } from '~utils/numbers';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

import {
  ChannelDefinition,
  createTransaction,
  createTransactionChannels,
} from '../transactions';
import { getColonyManager, putError, takeFrom } from '../utils';
import { groupExpenditureSlotsByTokenAddresses } from '../utils/expenditures';

function* createExpenditure({
  meta: { id: metaId, navigate },
  meta,
  payload: {
    colony: { name: colonyName, colonyAddress },
    slots,
    domainId,
  },
}: Action<ActionTypes.EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const apolloClient = getContext(ContextModule.ApolloClient);

  const batchKey = 'createExpenditure';

  // Group slots by token address, this is useful as we need to call setExpenditurePayouts method separately for each token
  const slotsByTokenAddress = groupExpenditureSlotsByTokenAddresses(slots);

  const {
    makeExpenditure,
    setRecipients,
    ...setPayoutsChannels
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    metaId,
    [
      'makeExpenditure',
      'setRecipients',
      // setExpenditurePayouts transactions will use token address as channel id
      ...slotsByTokenAddress.keys(),
    ],
  );

  try {
    yield fork(createTransaction, makeExpenditure.id, {
      context: ClientType.ColonyClient,
      methodName: 'makeExpenditure',
      identifier: colonyAddress,
      params: [1, BigNumber.from(2).pow(256).sub(1), 1],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
    });

    yield fork(createTransaction, setRecipients.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditureRecipients',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: metaId,
        index: 1,
      },
      ready: false,
    });

    yield all(
      Object.values(setPayoutsChannels).map((channel, index) =>
        fork(createTransaction, channel.id, {
          context: ClientType.ColonyClient,
          methodName: 'setExpenditurePayouts',
          identifier: colonyAddress,
          group: {
            key: batchKey,
            id: metaId,
            index: index + 2,
          },
          ready: false,
        }),
      ),
    );

    yield put(transactionPending(makeExpenditure.id));
    yield put(transactionReady(makeExpenditure.id));
    yield takeFrom(makeExpenditure.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    const expenditureId = yield call(colonyClient.getExpenditureCount);

    yield put(transactionPending(setRecipients.id));
    yield put(
      transactionAddParams(setRecipients.id, [
        expenditureId,
        slots.map((_, index) => index + 1),
        slots.map((slot) => slot.recipientAddress),
      ]),
    );
    yield put(transactionReady(setRecipients.id));

    yield takeFrom(setRecipients.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    // Call setExpenditurePayouts for each token
    yield all(
      [...slotsByTokenAddress.entries()]
        .map(([tokenAddress, tokenSlots]) => [
          put(transactionPending(setPayoutsChannels[tokenAddress].id)),
          put(
            transactionAddParams(setPayoutsChannels[tokenAddress].id, [
              expenditureId,
              tokenSlots.map((slot) => slot.id),
              tokenAddress,
              tokenSlots.map((slot) =>
                BigNumber.from(slot.amount).mul(
                  // @TODO: This should get the token decimals of the selected toke
                  BigNumber.from(10).pow(DEFAULT_TOKEN_DECIMALS),
                ),
              ),
            ]),
          ),
          put(transactionReady(setPayoutsChannels[tokenAddress].id)),
          takeFrom(
            setPayoutsChannels[tokenAddress].channel,
            ActionTypes.TRANSACTION_SUCCEEDED,
          ),
        ])
        .flat(),
    );

    yield apolloClient.mutate<
      CreateExpenditureMetadataMutation,
      CreateExpenditureMetadataMutationVariables
    >({
      mutation: CreateExpenditureMetadataDocument,
      variables: {
        input: {
          id: getExpenditureDatabaseId(colonyAddress, toNumber(expenditureId)),
          nativeDomainId: domainId,
        },
      },
    });

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CREATE_SUCCESS,
      payload: {},
      meta,
    });

    navigate(`/colony/${colonyName}/expenditures/${expenditureId}`);
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CREATE_ERROR, error, meta);
  }

  [
    makeExpenditure,
    setRecipients,
    ...Object.values(setPayoutsChannels),
  ].forEach((channel) => channel.channel.close());

  return null;
}

export default function* createExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CREATE, createExpenditure);
}
