import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import ButtonRadioButtons from '~v5/common/Fields/RadioButtons/ButtonRadioButtons';

const ButtonRadioButtonsMeta: Meta<typeof ButtonRadioButtons> = {
  title: 'Common/Fields/Radio Buttons/Button',
  component: ButtonRadioButtons,
};

export default ButtonRadioButtonsMeta;

const ButtonRadioButtonsWithHooks = () => {
  const [value, setValue] = React.useState('first');

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <ButtonRadioButtons
      items={[
        {
          label: 'Oppose',
          id: 'oppose',
          value: 'oppose',
          colorClassName: 'text-red-500',
          iconName: 'thumbs-down',
        },
        {
          label: 'Support',
          id: 'support',
          value: 'support',
          colorClassName: 'text-purple-200',
          iconName: 'thumbs-up',
        },
      ]}
      value={value}
      onChange={handleChange}
    />
  );
};

export const Base: StoryObj<typeof ButtonRadioButtons> = {
  render: () => {
    return <ButtonRadioButtonsWithHooks />;
  },
};
