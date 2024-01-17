import React from 'react';

import { useColonyContext } from '~hooks';
import DetailsWidget from '~shared/DetailsWidget';
import { ColonyAction, ColonyActionType } from '~types';
import { DecisionDraft } from '~utils/decisions';

const displayName = 'common.ColonyDecisions.DecisionPreview.DecisionDetails';

interface DecisionDetailsProps {
  draftDecision: DecisionDraft;
}

const DecisionDetails = ({
  draftDecision: { motionDomainId, walletAddress },
}: DecisionDetailsProps) => {
  const { colony } = useColonyContext();

  const widgetValues = {
    type: ColonyActionType.CreateDecisionMotion,
    motionData: {
      nativeMotionDomainId: String(motionDomainId),
    },
    initiatorAddress: walletAddress,
  } as ColonyAction; // @TODO: Remove casting

  return <DetailsWidget colony={colony} actionData={widgetValues} />;
};

DecisionDetails.displayName = displayName;

export default DecisionDetails;
