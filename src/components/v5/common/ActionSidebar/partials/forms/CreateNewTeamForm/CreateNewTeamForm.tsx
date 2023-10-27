import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCrateNewTeam } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamColourField from '~v5/common/ActionSidebar/partials/TeamColourField';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { formatText } from '~utils/intl';

const displayName = 'v5.common.ActionSidebar.partials.CreateNewTeamForm';

const CreateNewTeamForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { readonly } = useAdditionalFormOptionsContext();

  useCrateNewTeam(getFormOptions);

  return (
    <>
      <ActionFormRow
        fieldName="teamName"
        iconName="user-list"
        title={<FormattedMessage id="actionSidebar.teamName" />}
        tooltip={
          <FormattedMessage id="actionSidebar.tooltip.createTeam.teamName" />
        }
      >
        <FormInputBase
          name="teamName"
          placeholder={formatText({
            id: 'actionSidebar.placeholder.teamName',
          })}
          mode="secondary"
          readOnly={readonly}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="rocket"
        fieldName="domainPurpose"
        title={<FormattedMessage id="actionSidebar.teamPurpose" />}
        tooltip={
          <FormattedMessage id="actionSidebar.tooltip.createTeam.teamPurpose" />
        }
      >
        <FormTextareaBase
          name="domainPurpose"
          placeholder={formatText({
            id: 'actionSidebar.placeholder.purpose',
          })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="paint"
        fieldName="domainColor"
        title={<FormattedMessage id="actionSidebar.teamColour" />}
        tooltip={
          <FormattedMessage id="actionSidebar.tooltip.createTeam.teamColour" />
        }
      >
        <TeamColourField name="domainColor" />
      </ActionFormRow>
      <ActionFormRow
        iconName="house-line"
        fieldName="createdIn"
        tooltip={<FormattedMessage id="actionSidebar.tooltip.createdIn" />}
        title={<FormattedMessage id="actionSidebar.createdIn" />}
      >
        <TeamsSelect name="createdIn" />
      </ActionFormRow>
      <ActionFormRow
        iconName="scales"
        fieldName="decisionMethod"
        tooltip={<FormattedMessage id="actionSidebar.tooltip.decisionMethod" />}
        title={<FormattedMessage id="actionSidebar.decisionMethod" />}
      >
        <FormCardSelect
          name="decisionMethod"
          options={DECISION_METHOD_OPTIONS}
          title={formatText({ id: 'actionSidebar.decisionMethod' })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="pencil"
        fieldName="description"
        tooltip={<FormattedMessage id="actionSidebar.tooltip.description" />}
        title={<FormattedMessage id="actionSidebar.description" />}
        isExpandable
      >
        {([
          isDecriptionFieldExpanded,
          {
            toggleOff: toggleOffDecriptionSelect,
            toggleOn: toggleOnDecriptionSelect,
          },
        ]) => (
          <DescriptionField
            isDecriptionFieldExpanded={isDecriptionFieldExpanded}
            toggleOffDecriptionSelect={toggleOffDecriptionSelect}
            toggleOnDecriptionSelect={toggleOnDecriptionSelect}
            fieldName="description"
          />
        )}
      </ActionFormRow>
    </>
  );
};

CreateNewTeamForm.displayName = displayName;

export default CreateNewTeamForm;
