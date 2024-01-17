import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ADDRESS_ZERO } from '~constants';
import { useColonyContext } from '~hooks';
import Card from '~shared/Card';
import EthUsd from '~shared/EthUsd';
import IconTooltip from '~shared/IconTooltip';
import Numeral from '~shared/Numeral';
import TokenIcon from '~shared/TokenIcon';
import TokenInfoPopover from '~shared/TokenInfoPopover';
import { Token } from '~types';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import CopyableAddress from '~v5/shared/CopyableAddress';

import styles from './TokenCard.css';

interface Props {
  domainId: number;
  token: Token;
}

const displayName = 'common.TokenCard';

const MSG = defineMessages({
  nativeToken: {
    id: `${displayName}.nativeToken`,
    defaultMessage: ' (Native Token)',
  },
  unknownToken: {
    id: `${displayName}.unknownToken`,
    defaultMessage: 'Unknown Token',
  },
});

const TokenCard = ({ domainId, token }: Props) => {
  const {
    colony: { balances, nativeToken, status },
  } = useColonyContext();
  const { nativeToken: nativeTokenStatus } = status || {};

  const currentTokenBalance =
    getBalanceForTokenAndDomain(balances, token?.tokenAddress, domainId) || 0;

  return (
    <Card key={token.tokenAddress} className={styles.main}>
      <TokenInfoPopover
        token={token}
        isTokenNative={token.tokenAddress === nativeToken?.tokenAddress}
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [[0, 0]],
              },
            },
          ],
        }}
      >
        <div className={styles.cardHeading}>
          <TokenIcon token={token} size="xs" />
          <div className={styles.tokenSymbol}>
            {token.symbol ? (
              <span>{token.symbol}</span>
            ) : (
              <>
                <FormattedMessage {...MSG.unknownToken} />
                <CopyableAddress address={token.tokenAddress} />
              </>
            )}
            {token.tokenAddress === nativeToken?.tokenAddress &&
              !nativeTokenStatus?.unlocked && (
                <IconTooltip
                  icon="lock"
                  tooltipText={{ id: 'tooltip.lockedToken' }}
                  className={styles.tokenLockWrapper}
                  appearance={{ size: 'tiny' }}
                />
              )}
            {token.tokenAddress === nativeToken?.tokenAddress && (
              <span className={styles.nativeTokenText}>
                <FormattedMessage {...MSG.nativeToken} />
              </span>
            )}
          </div>
        </div>
      </TokenInfoPopover>
      <div
        className={
          currentTokenBalance.lt(0)
            ? styles.balanceNotPositive
            : styles.balanceContent
        }
      >
        <Numeral
          className={styles.balanceNumeral}
          decimals={getTokenDecimalsWithFallback(token.decimals)}
          value={currentTokenBalance}
        />
      </div>
      <div className={styles.cardFooter}>
        {token.tokenAddress === ADDRESS_ZERO && (
          <EthUsd className={styles.ethUsdText} value={currentTokenBalance} />
        )}
      </div>
    </Card>
  );
};

TokenCard.displayName = displayName;

export default TokenCard;
