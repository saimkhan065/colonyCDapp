import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, MessageDescriptor } from 'react-intl';

import { Form } from '~shared/Fields';
import Icon from '~shared/Icon';
import { WizardStepProps } from '~shared/Wizard';
import { formatText } from '~utils/intl';
import MenuContainer from '~v5/shared/MenuContainer';

import { ButtonRow, HeaderRow } from '../shared';

import { FormValues, Step2 } from './types';

const displayName = 'common.CreateColonyWizard.StepTokenChoice';

type Props = Pick<
  WizardStepProps<FormValues, Step2>,
  'nextStep' | 'wizardForm' | 'wizardValues' | 'setStepsValues' | 'previousStep'
>;

interface TokenSelectorProps {
  name: string;
  icon: ReactNode;
  title: MessageDescriptor | string;
  description: MessageDescriptor | string;
}

export const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Creating a new native token or use existing?',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'We highly recommend creating a new token, you will have greater control of your token going forward, support all features of Colony, and potentially save a lot of cost if on another chain.',
  },
  createOptionTitle: {
    id: `${displayName}.createOptionTitle`,
    defaultMessage: 'Create a new token',
  },
  createOptionDescription: {
    id: `${displayName}.createOptionDescription`,
    defaultMessage:
      'Quickest, easiest, and best option for greater control over your token using your Colony.',
  },
  selectOptionTitle: {
    id: `${displayName}.selectOptionTitle`,
    defaultMessage: 'Use an existing token',
  },
  selectOptionDescription: {
    id: `${displayName}.selectOptionDescription`,
    defaultMessage:
      'Suitable for public tokens. Requires token to be on the same blockchain as the Colony.',
  },
});

const TokenSelector = ({
  name,
  icon,
  title,
  description,
}: TokenSelectorProps) => {
  const { register, watch } = useFormContext();

  const registerField = register && register('tokenChoice');
  const checked = name === watch('tokenChoice');

  return (
    <label htmlFor={`id-${name}`}>
      <MenuContainer
        checked={checked}
        className={clsx(
          'flex flex-col items-center cursor-pointer text-center h-full md:hover:shadow-default md:hover:shadow-light-blue md:hover:border-blue-200',
        )}
      >
        <input
          {...registerField}
          type="radio"
          value={name}
          id={`id-${name}`}
          className="mb-4"
        />
        {icon}
        <span className="text-1 pt-4">{formatText(title)}</span>
        <span className="description-1 pt-1">{formatText(description)}</span>
      </MenuContainer>
    </label>
  );
};

const StepTokenChoice = ({
  wizardForm: { initialValues: defaultValues },
  wizardValues: { tokenChoice },
  previousStep,
  nextStep,
}: Props) => (
  <Form<Step2>
    onSubmit={nextStep}
    defaultValues={{
      tokenChoice: tokenChoice || defaultValues.tokenChoice,
    }}
  >
    <HeaderRow heading={MSG.heading} description={MSG.description} />
    <div className="flex gap-6">
      <TokenSelector
        name="create"
        title={MSG.createOptionTitle}
        description={MSG.createOptionDescription}
        icon={
          <Icon
            style={{ transform: 'rotate(90deg)' }}
            name="coin-vertical"
            appearance={{ size: 'mediumSmall' }}
          />
        }
      />
      <TokenSelector
        name="select"
        title={MSG.selectOptionTitle}
        description={MSG.selectOptionDescription}
        icon={<Icon name="hand-coins" appearance={{ size: 'mediumSmall' }} />}
      />
    </div>
    <ButtonRow previousStep={previousStep} />
  </Form>
);

StepTokenChoice.displayName = displayName;

export default StepTokenChoice;
