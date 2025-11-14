import type { Meta, StoryObj } from '@storybook/react';
import Canvas3 from './Canvas3';

const meta = {
  title: 'Components/Canvas3',
  component: Canvas3,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Canvas3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
