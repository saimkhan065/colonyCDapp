import { Extension } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { RefetchAction } from '~common/ColonyActions/ActionDetailsPage/useGetColonyAction';
import { useUserTokenBalanceContext } from '~context';
import { useAppContext, useColonyContext, useExtensionData } from '~hooks';
import { ActionTypes } from '~redux';
import { ClaimMotionRewardsPayload } from '~redux/sagas/motions/claimMotionRewards';
import { ActionButton } from '~shared/Button';
import { DetailItemProps } from '~shared/DetailsWidget';
import Numeral from '~shared/Numeral';
import { ColonyMotion, InstalledExtensionData } from '~types';
import { intl } from '~utils/intl';
import { getTransactionHashFromPathName } from '~utils/urls';

import { ClaimMotionStakesStyles } from './ClaimMotionStakes';

const { formatMessage } = intl({
  'label.stake': 'Stake',
  'label.winnings': 'Winnings',
  'label.penalty': 'Penalty',
  'label.total': 'Total',
  'label.claim': 'Claim your tokens',
});

const useClaimWidgetConfig = (
  { usersStakes, stakerRewards, databaseMotionId }: ColonyMotion,
  startPollingAction: (pollInterval: number) => void,
  refetchAction: RefetchAction,
  styles: ClaimMotionStakesStyles,
) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { pollLockedTokenBalance } = useUserTokenBalanceContext();
  const { extensionData: votingRepitationExtension } = useExtensionData(
    Extension.VotingReputation,
  );

  const location = useLocation();
  const [isClaimed, setIsClaimed] = useState(false);

  const userAddress = user?.walletAddress;
  const { colonyAddress, nativeToken, motionsWithUnclaimedStakes } = colony;
  const { decimals: nativeTokenDecimals, symbol: nativeTokenSymbol } =
    nativeToken;

  const userStake = usersStakes.find(({ address }) => address === userAddress);
  const stakerReward = stakerRewards.find(
    ({ address }) => address === userAddress,
  );

  // Keep isClaimed state in sync with changes to unclaimed motions on colony object
  useEffect(() => {
    if (motionsWithUnclaimedStakes) {
      const motionIsUnclaimed = motionsWithUnclaimedStakes.some(
        ({ motionId }) => motionId === databaseMotionId,
      );

      if (!motionIsUnclaimed) {
        setIsClaimed(true);
        refetchAction();
      } else {
        setIsClaimed(false);
      }
    }
  }, [motionsWithUnclaimedStakes, databaseMotionId, refetchAction]);

  // Keep isClaimed state in sync with user changes
  useEffect(() => {
    if (!user) {
      setIsClaimed(false);
    } else {
      setIsClaimed(!!stakerReward?.isClaimed);
    }
  }, [user, stakerReward]);

  const config: DetailItemProps[] = [];

  // @NOTE: Hide details widget if we have insufficient data
  if (!userStake || !stakerReward || !userAddress || !colonyAddress) {
    return config;
  }

  const {
    rewards: { yay: yayReward, nay: nayReward },
    isClaimed: isRewardClaimed,
  } = stakerReward;

  if (isRewardClaimed && !isClaimed) {
    setIsClaimed(true);
  }

  const {
    stakes: {
      raw: { nay: nayStakes, yay: yayStakes },
    },
  } = userStake;

  const totals = BigNumber.from(yayReward).add(nayReward);
  const userTotalStake = BigNumber.from(nayStakes).add(yayStakes);
  const userWinnings = totals.sub(userTotalStake);

  // Else, return full widget
  const buttonTextId = isClaimed ? 'button.claimed' : 'button.claim';
  const canClaimStakes = !totals.isZero() && !isClaimed;
  const handleClaimSuccess = () => {
    setIsClaimed(true);
    startPollingAction(1000);
    pollLockedTokenBalance();
  };

  const claimPayload = {
    userAddress,
    colonyAddress,
    extensionAddress: (votingRepitationExtension as InstalledExtensionData)
      ?.address,
    transactionHash: getTransactionHashFromPathName(location.pathname),
  } as ClaimMotionRewardsPayload;

  const claimItem = {
    label: formatMessage({ id: 'label.claim' }),
    labelStyles: styles.claimLabel,
    item: (
      <ActionButton
        actionType={ActionTypes.MOTION_CLAIM}
        values={claimPayload}
        appearance={{ theme: 'primary', size: 'medium' }}
        text={{ id: buttonTextId }}
        disabled={!canClaimStakes}
        dataTest="claimStakeButton"
        onSuccess={handleClaimSuccess}
      />
    ),
  };

  const stakeItem = {
    label: formatMessage({ id: 'label.stake' }),
    item: (
      <Numeral
        value={userTotalStake}
        decimals={nativeTokenDecimals}
        suffix={nativeTokenSymbol}
      />
    ),
  };

  const winningsItem = {
    label: formatMessage({
      id: userWinnings.gte(0) ? 'label.winnings' : 'label.penalty',
    }),
    item: (
      <Numeral
        value={userWinnings}
        decimals={nativeTokenDecimals}
        suffix={nativeTokenSymbol}
      />
    ),
  };

  const totalItem = {
    label: formatMessage({ id: 'label.total' }),
    item: (
      <Numeral
        value={totals}
        decimals={nativeTokenDecimals}
        suffix={nativeTokenSymbol}
      />
    ),
  };

  config.push(claimItem, stakeItem, winningsItem, totalItem);

  return config;
};

export default useClaimWidgetConfig;
