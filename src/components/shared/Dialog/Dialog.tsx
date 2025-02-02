import React, { ReactNode } from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~shared/Icon';

import Modal from '../Modal';

import styles from './Dialog.css';

const MSG = defineMessages({
  buttonCancel: {
    id: 'core.Dialog.buttonCancel',
    defaultMessage: 'Cancel',
  },
});

interface Props {
  /** Dialog needs the cancel function from your Dialog component */
  cancel: () => void;
  /** Children to render in this Dialog */
  children: ReactNode;
  /** Determines if the Dialog can be dismissed */
  isDismissable?: boolean;
}

const displayName = 'Dialog';

const Dialog = ({
  children,
  cancel,
  isDismissable = true,
  ...props
}: Props) => (
  <Modal
    {...props}
    role="dialog"
    className={styles.modal}
    onRequestClose={cancel}
    isOpen
  >
    {isDismissable && (
      <div className={styles.dialogOuterActions}>
        <button
          type="button"
          className={styles.closeIconButton}
          onClick={cancel}
        >
          <Icon
            appearance={{ size: 'medium' }}
            name="circle-close"
            title={MSG.buttonCancel}
          />
        </button>
      </div>
    )}
    <div className={styles.main}>{children}</div>
  </Modal>
);

Dialog.displayName = displayName;

export default Dialog;
