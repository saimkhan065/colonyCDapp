import React, { FC, PropsWithChildren } from 'react';

import { ActionTypes } from '~redux';
import { ActionForm } from '~shared/Fields';
import Modal from '~v5/shared/Modal';

import { BalanceModalProps } from './types';

const displayName = 'v5.pages.BalancePage.partials.BalanceModal';

const BalanceModal: FC<PropsWithChildren<BalanceModalProps>> = ({
  onClose,
  children,
  ...props
}) => (
  <Modal icon="piggy-bank" {...props} onClose={onClose}>
    <ActionForm
      actionType={ActionTypes.USER_DEPOSIT_TOKEN} // @TODO: add correct action
      onSuccess={(_, { reset }) => {
        reset();
        onClose();
      }}
    >
      {() => (
        <>
          {children}
          {/* @TODO: uncomment this when API to create "add funds action" will be ready */}
          {/* <h4 className="text-1 mb-1.5">
              {formatText({ id: 'balanceModal.modal.addFundsToWallet' })}
            </h4>
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-1">
                {formatText({
                  id: 'balanceModal.modal.addFundsToWallet.label',
                })}
              </p>
            </div>
            <FormFormattedInput
              name="amount"
              placeholder="0"
              options={{
                numeral: true,
                numeralDecimalScale: undefined,
                numeralPositiveOnly: true,
                rawValueTrimPrefix: true,
                tailPrefix: true,
              }}
              buttonProps={{
                label: formatText({ id: 'button.max' }) || '',
                onClick: () => {
                  setValue('amount', {
                    shouldTouch: true,
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                },
              }}
              wrapperClassName="mb-8"
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                mode="primaryOutline"
                onClick={onClose}
                text={formatText({ id: 'button.cancel' })}
                isFullSize
              />
              <Button
                mode="primarySolid"
                type="submit"
                text={formatText({ id: 'button.addFunds' })}
                isFullSize
              />
            </div> */}
        </>
      )}
    </ActionForm>
  </Modal>
);

BalanceModal.displayName = displayName;

export default BalanceModal;
