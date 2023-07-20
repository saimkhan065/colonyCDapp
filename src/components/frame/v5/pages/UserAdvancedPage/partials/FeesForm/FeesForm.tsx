import React from 'react';
import { useIntl } from 'react-intl';

import { HookForm } from '~shared/Fields';
import SettingsRow from '~v5/common/SettingsRow';
import { SlotKey } from '~hooks';
import { useFeesForm } from './hooks';

const FeesForm = () => {
  const { formatMessage } = useIntl();
  const {
    handleFeesOnChange,
    handleSubmit,
    metatransactionsValidationSchema,
    metatransasctionsDefault,
  } = useFeesForm();

  return (
    <HookForm
      validationSchema={metatransactionsValidationSchema}
      defaultValues={{
        [SlotKey.Metatransactions]: metatransasctionsDefault,
      }}
      onSubmit={handleSubmit}
    >
      <h4 className="heading-4 mb-6">
        {formatMessage({ id: 'userAdvancedPage.title' })}
      </h4>
      <div className="border-b border-gray-200">
        <SettingsRow
          title={{ id: 'advancedSettings.fees.title' }}
          description={{ id: 'advancedSettings.fees.description' }}
          tooltipMessage={{ id: 'advancedSettings.fees.tooltip' }}
          id={SlotKey.Metatransactions}
          onChange={handleFeesOnChange}
        />
      </div>
    </HookForm>
  );
};

export default FeesForm;
