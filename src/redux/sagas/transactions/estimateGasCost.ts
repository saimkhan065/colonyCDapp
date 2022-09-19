import { call, put } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { BigNumber, Contract } from 'ethers';
import abis from '@colony/colony-js/lib-esm/abis';

import { ActionTypes } from '../../actionTypes';
import { Action } from '../../types/actions';
import { selectAsJS, getGasPrices } from '../utils';
import { ContextModule, getContext } from '~context';
import { TransactionRecordProps } from '../../immutable';
import { ExtendedReduxContext } from '~types';

import { oneTransaction } from '../../selectors';
import {
  transactionUpdateGas,
  transactionEstimateError,
  transactionSend,
} from '../../actionCreators';

/*
 * @area: including a bit of buffer on the gas sent can be a good thing.
 * Your tx might be applied against a different state from when you
 * estimateGas'd it, which might cause it to still work, but use a bit more gas
 */
// Plus 10%
const SAFE_GAS_LIMIT_MULTIPLIER = BigNumber.from(10);

export default function* estimateGasCost({
  meta: { id },
}: Action<ActionTypes.TRANSACTION_ESTIMATE_GAS>) {
  try {
    // Get the given transaction
    const {
      context,
      methodName,
      identifier,
      params,
      gasLimit,
      options,
    }: TransactionRecordProps = yield selectAsJS(oneTransaction, id);
    const colonyManager = getContext(ContextModule.ColonyManager);

    let contextClient: Contract;
    if (context === ClientType.TokenClient) {
      contextClient = yield colonyManager.getTokenClient(identifier as string);
    } else if (
      context === (ExtendedReduxContext.WrappedToken as unknown as ClientType)
    ) {
      // @ts-ignore
      const wrappedTokenAbi = abis.WrappedToken.default.abi;
      contextClient = new Contract(
        identifier || '',
        wrappedTokenAbi,
        colonyManager.signer,
      );
    } else if (
      context === (ExtendedReduxContext.VestingSimple as unknown as ClientType)
    ) {
      // @ts-ignore
      const vestingSimpleAbi = abis.vestingSimple.default.abi;
      contextClient = new Contract(
        identifier || '',
        vestingSimpleAbi,
        colonyManager.signer,
      );
    } else {
      contextClient = yield colonyManager.getClient(context, identifier);
    }

    if (!contextClient) {
      throw new Error('Context client failed to instantiate');
    }

    // Estimate the gas limit with the method.
    const estimatedGas = yield contextClient.estimateGas[methodName](
      ...params,
      options,
    );

    const suggestedGasLimit = estimatedGas
      .div(SAFE_GAS_LIMIT_MULTIPLIER)
      .add(estimatedGas);

    const { network, suggested } = yield call(getGasPrices);

    const gasPrice = suggested || network;

    yield put(
      transactionUpdateGas(id, {
        /*
         * @NOTE Prevent a race condition if we're also manually estimating gas
         *
         * In some cases we might want to manually estimate gas (see: finalize motion).
         * In cases like those we fire the TRANSACTION_ESTIMATE_GAS action twice in quick
         * succession which leads to a race condition (basically which ever finishes
         * last will get set)
         *
         * This prevents that by making sure that we preserve any gas limit values that
         * are already set on the transaction (the ones that were set manually) and
         * if not, only then set the suggested value
         */
        gasLimit: gasLimit || suggestedGasLimit.toString(),
        gasPrice,
      }),
    );

    yield put(transactionSend(id));
  } catch (error) {
    console.error(error);
    return yield put(transactionEstimateError(id, error));
  }
  return null;
}
