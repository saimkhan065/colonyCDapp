import React from 'react';

import { SpinnerLoader } from '~shared/Preloaders';
import EmptyContent from '~v5/common/EmptyContent';

import StakeItem from './StakeItem';
import { StakesListProps } from '../types';
import styles from './StakesList.css';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakeItem';

const StakesList = ({ stakes, loading, colony }: StakesListProps) => {
  if (loading) {
    return (
      <div className="mx-auto w-fit">
        <SpinnerLoader appearance={{ size: 'small' }} />
      </div>
    );
  }

  if (!stakes.length) {
    return (
      <EmptyContent
        title={{ id: 'empty.content.title.stakes' }}
        description={{ id: 'empty.content.subtitle.stakes' }}
        icon="binoculars"
      />
    );
  }

  return (
    <div className={styles.stakesListContainer}>
      {stakes.map((stake) => (
        <StakeItem
          key={stake.id}
          stake={stake}
          nativeToken={colony.nativeToken}
          colonyAddress={colony.colonyAddress}
        />
      ))}
    </div>
  );
};

StakesList.displayName = displayName;

export default StakesList;
