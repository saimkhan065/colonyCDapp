import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { ColonyAction, ExtendedColonyActionType } from '~types';
import { ETHEREUM_NETWORK } from '~constants';
import { getExtendedActionType } from '~utils/colonyActions';
import { useColonyContext } from '~hooks';

import SafeTransactionBanner from '../SafeTransactionBanner';

import styles from './ActionDetailsPageLayout.css';

interface ActionsPageLayoutProps {
  children: ReactNode;
  actionData?: ColonyAction | null;
  center?: boolean;
  isMotion?: boolean;
}

const displayName = 'common.ColonyActions.ActionDetailsPageLayout';

const ActionDetailsPageLayout = ({
  children,
  actionData,
  center = false,
  isMotion = false,
}: ActionsPageLayoutProps) => {
  const { colony } = useColonyContext();

  if (!colony || !actionData) {
    return null;
  }

  const hasPendingSafeTransactions = true;

  const extendedActionType = getExtendedActionType(
    actionData,
    colony?.metadata,
  );

  return (
    <div
      className={classNames(styles.layout, {
        [styles.center]: center,
        [styles.noTopPadding]: isMotion,
      })}
    >
      {hasPendingSafeTransactions &&
        extendedActionType === ExtendedColonyActionType.SafeTransaction && (
          <SafeTransactionBanner
            chainId={(
              actionData?.safeTransaction?.safe?.chainId ||
              ETHEREUM_NETWORK.chainId
            ).toString()}
            transactionHash={actionData?.safeTransaction?.id || ''}
          />
        )}
      <div className={styles.main}>{children}</div>
    </div>
  );
};

ActionDetailsPageLayout.displayName = displayName;

export default ActionDetailsPageLayout;
