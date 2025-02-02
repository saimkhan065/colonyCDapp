import SubNavigation from './SubNavigation';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SubNavigation> = {
  title: 'Common/Sub Navigation',
  component: SubNavigation,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SubNavigation>;

export const Base: Story = {};
