import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import { Status, TransactionStatus } from '~common/ColonyActions/ActionsPage';

import styles from './TransactionHash.css';

const displayName = 'common.ColonyActions.ActionsPage.TransactionNotFound.Hash';

const MSG = defineMessages({
  fallbackTitle: {
    id: `${displayName}.fallbackTitle`,
    defaultMessage: 'Transaction hash',
  },
});

interface Props {
  status?: Status;
  transactionHash?: string;
  title?: MessageDescriptor;
}

const Hash = ({ transactionHash, title = MSG.fallbackTitle, status }: Props) =>
  transactionHash ? (
    <>
      <p className={styles.title}>
        {status && <TransactionStatus status={status} />}
        <FormattedMessage {...title} />
      </p>
      <div className={styles.transactionHash}>{transactionHash}</div>
    </>
  ) : null;

Hash.displayName = displayName;

export default Hash;
