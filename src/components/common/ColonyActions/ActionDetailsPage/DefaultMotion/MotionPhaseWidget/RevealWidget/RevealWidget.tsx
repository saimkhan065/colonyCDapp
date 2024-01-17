import { BigNumber } from 'ethers';
import React from 'react';

import { useAppContext, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { RevealMotionPayload } from '~redux/sagas/motions/revealVoteMotion';
import { ActionForm, OnSuccess } from '~shared/Fields';
import { ColonyMotion } from '~types';
import { mapPayload } from '~utils/actions';
import { MotionState } from '~utils/colonyMotions';

import { PollingControls } from '../MotionPhaseWidget';
import { VoteDetails } from '../VotingWidget';

import RevealWidgetHeading from './RevealWidgetHeading';
import { useRevealWidgetUpdate } from './useRevealWidgetUpdate';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.RevealWidget';

interface RevealWidgetProps extends PollingControls {
  motionData: ColonyMotion;
  motionState: MotionState;
}

const RevealWidget = ({
  motionData: { voterRecord, motionId },
  motionData,
  motionState,
  startPollingAction,
  stopPollingAction,
}: RevealWidgetProps) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { user } = useAppContext();
  const { hasUserVoted, vote, userVoteRevealed, setUserVoteRevealed } =
    useRevealWidgetUpdate(voterRecord, stopPollingAction);
  const transform = mapPayload(
    () =>
      ({
        colonyAddress,
        userAddress: user?.walletAddress ?? '',
        motionId: BigNumber.from(motionId),
      } as RevealMotionPayload),
  );

  const handleSuccess: OnSuccess<Record<string, any>> = (_, { reset }) => {
    reset();
    startPollingAction(1000);
    setUserVoteRevealed(true);
  };

  return (
    <ActionForm
      actionType={ActionTypes.MOTION_REVEAL_VOTE}
      onSuccess={handleSuccess}
      transform={transform}
    >
      <RevealWidgetHeading
        hasUserVoted={hasUserVoted}
        userVoteRevealed={userVoteRevealed}
        vote={vote}
      />
      <VoteDetails
        motionData={motionData}
        motionState={motionState}
        hasUserVoted={hasUserVoted}
        userVoteRevealed={userVoteRevealed}
      />
    </ActionForm>
  );
};

RevealWidget.displayName = displayName;

export default RevealWidget;
