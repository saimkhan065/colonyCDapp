import React from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext, useMobile } from '~hooks';
import Heading from '~shared/Heading';

import ColonySubscription from '../ColonySubscription';

import ColonyAddress from './ColonyAddress';

import styles from './ColonyTitle.css';

const displayName = 'common.ColonyHome.ColonyTitle';

const MSG = defineMessages({
  fallbackColonyName: {
    id: `${displayName}.fallbackColonyName`,
    defaultMessage: 'Unknown Colony',
  },
});

const ColonyTitle = () => {
  const {
    colony: { metadata, name, colonyAddress },
  } = useColonyContext();
  const isMobile = useMobile();

  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        <div className={styles.colonyTitle}>
          <Heading
            appearance={{
              size: 'medium',
              weight: 'medium',
              margin: 'none',
            }}
            text={metadata?.displayName || name || MSG.fallbackColonyName}
            data-test="colonyTitle"
          />
          {isMobile && <ColonyAddress colonyAddress={colonyAddress} />}
        </div>
        <div>
          <ColonySubscription />
        </div>
      </div>
    </div>
  );
};

ColonyTitle.displayName = displayName;

export default ColonyTitle;
