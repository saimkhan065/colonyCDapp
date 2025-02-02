import React from 'react';
import { defineMessages } from 'react-intl';

import { useColonyDashboardContext } from '~context/ColonyDashboardContext';
import useColonySubscription from '~hooks/useColonySubscription';
import { formatText } from '~utils/intl';
import Modal from '~v5/shared/Modal';

const displayName = 'v5.frame.ColonyHome.LeaveColonyModal';
const MSG = defineMessages({
  leaveConfimModalTitle: {
    id: `${displayName}.leaveConfimModalTitle`,
    defaultMessage: 'Are you sure you want to leave this Colony?',
  },
  leaveConfirmModalSubtitle: {
    id: `${displayName}.leaveConfirmModalSubtitle`,
    defaultMessage: `Leaving this Colony will mean you are no longer able to access the Colony during the beta period. Ensure you have a copy of the invite code available to be able to re-join again.`,
  },
  leaveConfirmModalConfirmButton: {
    id: `${displayName}.leaveConfirmModalConfirmButton`,
    defaultMessage: 'Yes, leave this Colony',
  },
});

const LeaveColonyModal = () => {
  const { handleUnwatch } = useColonySubscription();
  const { isLeaveColonyModalOpen, closeLeaveColonyModal } =
    useColonyDashboardContext();

  return (
    <Modal
      title={formatText(MSG.leaveConfimModalTitle)}
      subTitle={formatText(MSG.leaveConfirmModalSubtitle)}
      isOpen={isLeaveColonyModalOpen}
      onClose={() => closeLeaveColonyModal()}
      onConfirm={() => {
        closeLeaveColonyModal();
        handleUnwatch();
      }}
      icon="warning-circle"
      buttonMode="primarySolid"
      confirmMessage={formatText(MSG.leaveConfirmModalConfirmButton)}
      closeMessage={formatText({
        id: 'button.cancel',
      })}
    />
  );
};

LeaveColonyModal.displayName = displayName;
export default LeaveColonyModal;
