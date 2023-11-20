import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { useController } from 'react-hook-form';

import useToggle from '~hooks/useToggle';
import { useTeams } from '~hooks/useTeams';
import { useRelativePortalElement } from '~hooks/useRelativePortalElement';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import SearchSelect from '~v5/shared/SearchSelect';
import TeamBadge from '~v5/common/Pills/TeamBadge';

import { TeamSelectProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.TeamsSelect';

const TeamsSelect: FC<TeamSelectProps> = ({ name }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const selectedTeam = field.value;
  const isError = !!error;
  const teamsOptions = useTeams();
  const { formatMessage } = useIntl();
  const [
    isTeamSelectVisible,
    {
      toggle: toggleTeamSelect,
      toggleOff: toggleTeamSelectOff,
      registerContainerRef,
    },
  ] = useToggle();
  const selectedOption = teamsOptions.options.find(
    (option) => option.value === selectedTeam,
  );
  const { readonly } = useAdditionalFormOptionsContext();

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTeamSelectVisible]);

  return (
    <div className="sm:relative w-full">
      {readonly ? (
        <TeamBadge
          teamName={
            typeof selectedOption?.label === 'object'
              ? formatMessage(selectedOption?.label)
              : selectedOption?.label
          }
        />
      ) : (
        <>
          <button
            type="button"
            ref={relativeElementRef}
            className={clsx(
              'flex text-md transition-colors md:hover:text-blue-400',
              {
                'text-gray-400': !isError && !isTeamSelectVisible,
                'text-negative-400': isError,
                'text-blue-400': isTeamSelectVisible,
              },
            )}
            onClick={toggleTeamSelect}
          >
            {selectedOption ? (
              <TeamBadge
                teamName={
                  typeof selectedOption.label === 'object'
                    ? formatMessage(selectedOption.label)
                    : selectedOption.label
                }
              />
            ) : (
              formatMessage({ id: 'actionSidebar.selectTeam' })
            )}
          </button>
          {isTeamSelectVisible && (
            <SearchSelect
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
              items={[teamsOptions]}
              onSelect={(value) => {
                field.onChange(value);

                toggleTeamSelectOff();
              }}
              className="z-[60]"
            />
          )}
        </>
      )}
    </div>
  );
};

TeamsSelect.displayName = displayName;

export default TeamsSelect;
