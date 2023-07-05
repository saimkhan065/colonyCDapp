import React, { useEffect, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { object, string, InferType } from 'yup';

import { IconButton } from '~shared/Button';
import { ActionHookForm as ActionForm } from '~shared/Fields';

import { getMainClasses } from '~utils/css';
import { withId } from '~utils/actions';
import { ActionTypes } from '~redux';
import { TransactionType } from '~redux/immutable';
import { transactionEstimateGas, transactionSend } from '~redux/actionCreators';

import { GasStationContext } from '../GasStationProvider';

import styles from './GasStationControls.css';

interface Props {
  transaction: TransactionType;
}

const validationSchema = object().shape({ id: string() }).defined();

type FormValues = InferType<typeof validationSchema>;

const displayName = 'frame.GasStation.GasStationControls';

const GasStationControls = ({
  transaction: { id, error, metatransaction },
}: Props) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const transform = useCallback(withId(id), [id]);
  const { updateTransactionAlert } = useContext(GasStationContext);

  /*
   * @NOTE Automatically send the transaction
   * Since we're just using Metamask, we won't wait for the user to click the "Confirm"
   * button anymore, we just dispatch the action to send the transaction, and the user
   * will deal with _confirm-ing_ the action using Metamask's interface.
   *
   * The only time we actually show controls, is when the transaction has failed, and
   * we need to retry it.
   */
  useEffect(() => {
    if (!error) {
      if (metatransaction) {
        dispatch(transactionSend(id));
      } else {
        dispatch(transactionEstimateGas(id));
      }
    }
  }, [dispatch, id, error, metatransaction]);

  const handleResetMetaTransactionAlert = useCallback(
    () => updateTransactionAlert(id, { wasSeen: false }),
    [id, updateTransactionAlert],
  );

  const initialFormValues: FormValues = { id };

  return (
    <div className={getMainClasses({}, styles)}>
      <ActionForm<FormValues>
        actionType={ActionTypes.TRANSACTION_RETRY}
        validationSchema={validationSchema}
        defaultValues={initialFormValues}
        transform={transform}
      >
        {error && (
          <div className={styles.controls}>
            <IconButton
              type="submit"
              text={{ id: 'button.retry' }}
              onClick={handleResetMetaTransactionAlert}
            />
          </div>
        )}
      </ActionForm>
    </div>
  );
};

GasStationControls.displayName = displayName;

export default GasStationControls;
