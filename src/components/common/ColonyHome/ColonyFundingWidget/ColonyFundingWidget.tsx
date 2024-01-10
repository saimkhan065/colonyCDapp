import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyHomeContext } from '~context';
import { useColonyContext } from '~hooks';
import { COLONY_INCOMING_ROUTE } from '~routes';
import Heading from '~shared/Heading';
import NavLink from '~shared/NavLink';
import TokenInfoPopover from '~shared/TokenInfoPopover';
import { notNull } from '~utils/arrays';

import TokenBalanceItem from './TokenBalanceItem';

import styles from './ColonyFundingWidget.css';

const displayName = 'common.ColonyHome.ColonyFundingWidget';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Available funds',
  },
});

const ColonyFundingWidget = () => {
  const {
    colony: { balances, name, tokens: colonyTokenItems, nativeToken, status },
  } = useColonyContext();
  const { domainIdFilter: currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID } =
    useColonyHomeContext();

  const tokens = useMemo(
    () =>
      colonyTokenItems?.items
        .filter(notNull)
        .map((colonyToken) => colonyToken.token),
    [colonyTokenItems],
  );

  const domainBalances = useMemo(() => {
    let filteredBalances;
    if (balances?.items) {
      /*
       * Balances if "All Domains" selected
       */
      if (currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
        filteredBalances = balances.items.filter(
          (balance) => balance?.domain === null,
        );
        /*
         * Balances if native domain selected
         */
      } else {
        filteredBalances = balances.items.filter(
          (balance) => balance?.domain?.nativeId === currentDomainId,
        );
      }
      /*
       * Fallback balances (basically a list of all tokens with zero balance)
       */
    } else {
      filteredBalances = tokens?.map((token) => ({
        token,
        balance: '0',
      }));
    }
    /*
     * Reduce the array to a more digestable format
     */
    return filteredBalances.reduce(
      (balanceTokens, currentBalance) => ({
        ...balanceTokens,
        [currentBalance.token?.tokenAddress || '']: currentBalance.balance,
      }),
      {},
    );
  }, [balances, currentDomainId, tokens]);

  return (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <NavLink
          className={styles.fundsLink}
          to={`/${name}/${COLONY_INCOMING_ROUTE}`}
        >
          <FormattedMessage {...MSG.title} />
        </NavLink>
      </Heading>
      <ul data-test="availableFunds">
        {tokens?.map((token) => (
          <li key={token?.tokenAddress}>
            <TokenInfoPopover
              token={token}
              isTokenNative={token?.tokenAddress === nativeToken.tokenAddress}
            >
              <div className={styles.tokenBalance}>
                <TokenBalanceItem
                  token={token}
                  isTokenNative={
                    token?.tokenAddress === nativeToken.tokenAddress
                  }
                  isNativeTokenLocked={!status?.nativeToken?.unlocked}
                  balance={domainBalances[token?.tokenAddress]}
                />
              </div>
            </TokenInfoPopover>
          </li>
        ))}
      </ul>
    </div>
  );
};

ColonyFundingWidget.displayName = displayName;

export default ColonyFundingWidget;
