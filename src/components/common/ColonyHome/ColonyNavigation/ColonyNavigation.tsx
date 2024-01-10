import React from 'react';

import { useColonyContext } from '~hooks';

import useGetNavigationItems, { displayName } from './colonyNavigationConfig';
import NavItem from './NavItem';

import styles from './ColonyNavigation.css';

const ColonyNavigation = () => {
  const {
    colony: { name },
  } = useColonyContext();

  const items = useGetNavigationItems(name);
  return (
    <nav role="navigation" className={styles.main}>
      {items.map((itemProps) => (
        <NavItem key={itemProps.linkTo} {...itemProps} />
      ))}
    </nav>
  );
};

ColonyNavigation.displayName = displayName;

export default ColonyNavigation;
