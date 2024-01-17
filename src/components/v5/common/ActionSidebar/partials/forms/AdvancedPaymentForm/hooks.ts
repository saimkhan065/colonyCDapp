import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { DeepPartial } from 'utility-types';
import { array, InferType, number, object, string } from 'yup';

import { getCreatePaymentDialogPayload } from '~common/Dialogs/CreatePaymentDialog/helpers';
import { useColonyContext, useNetworkInverseFee } from '~hooks';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { formatText } from '~utils/intl';
import { toFinite } from '~utils/lodash';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts';
import { MAX_ANNOTATION_NUM } from '~v5/shared/RichText/consts';

import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();
  const { watch } = useFormContext();
  const selectedTeam = watch('from');

  const validationSchema = useMemo(
    () =>
      object()
        .shape({
          from: number().required(),
          decisionMethod: string().defined(),
          createdIn: number().defined(),
          description: string().max(MAX_ANNOTATION_NUM).notRequired(),
          payments: array()
            .of(
              object()
                .shape({
                  recipient: string().required(),
                  amount: object()
                    .shape({
                      amount: number()
                        .required()
                        .transform((value) => toFinite(value))
                        .moreThan(0, () =>
                          formatText({ id: 'errors.amount.greaterThanZero' }),
                        )
                        .test(
                          'enough-tokens',
                          ({ path }) =>
                            formatText(
                              { id: 'errors.amount.notEnoughTokensIn' },
                              {
                                path,
                              },
                            ),
                          (value, context) =>
                            hasEnoughFundsValidation(
                              value,
                              context,
                              selectedTeam,
                              colony,
                            ),
                        ),
                      tokenAddress: string().address().required(),
                    })
                    .required(),
                  delay: number().moreThan(0).required(),
                })
                .required(),
            )
            .required(),
        })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [colony, selectedTeam],
  );

  return validationSchema;
};

export type AdvancedPaymentFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useAdvancedPayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { networkInverseFee } = useNetworkInverseFee();
  const {
    colony: { nativeToken },
    colony,
  } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const validationSchema = useValidationSchema();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<AdvancedPaymentFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
        payments: [
          {
            delay: 0,
            amount: {
              amount: 0,
              tokenAddress: nativeToken.tokenAddress,
            },
          },
        ],
      }),
      [nativeToken.tokenAddress],
    ),
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_EXPENDITURE_PAYMENT
        : ActionTypes.MOTION_EXPENDITURE_PAYMENT,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: AdvancedPaymentFormValues) => {
          return getCreatePaymentDialogPayload(
            colony,
            {
              fromDomainId: payload.from,
              payments: [],
              annotation: payload.description,
              motionDomainId: payload.createdIn,
            },
            networkInverseFee,
          );
        }),
      ),
      [colony, networkInverseFee],
    ),
  });
};
