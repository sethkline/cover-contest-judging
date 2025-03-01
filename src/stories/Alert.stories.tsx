// src/stories/Alert.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../components/ui/Alert';
import { Award } from 'lucide-react';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    title: {
      control: 'text',
    },
    hideCloseButton: {
      control: 'boolean',
    },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    children: 'This is an informational message for the user.',
    className: 'w-96',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    children: 'Your entry has been successfully submitted!',
    className: 'w-96',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    children: 'Please review your information before submitting.',
    className: 'w-96',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    children: 'There was a problem with your submission. Please try again.',
    className: 'w-96',
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: 'info',
    children: 'This is a simple alert without a title.',
    className: 'w-96',
  },
};

export const CustomIcon: Story = {
  args: {
    variant: 'info',
    title: 'Contest Update',
    children: 'The judging period has been extended until next Friday.',
    icon: <Award className="h-5 w-5 text-primary-500" />,
    className: 'w-96',
  },
};

export const NoCloseButton: Story = {
  args: {
    variant: 'warning',
    title: 'Important',
    children: 'This alert cannot be dismissed because it contains critical information.',
    hideCloseButton: true,
    className: 'w-96',
  },
};

export const LongContent: Story = {
  args: {
    variant: 'info',
    title: 'Contest Rules',
    children: (
      <div className="space-y-2">
        <p>Please follow these guidelines for your contest submission:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>All entries must be original work</li>
          <li>Submissions must be in JPG or PNG format</li>
          <li>Maximum file size is 5MB</li>
          <li>Include your name and age category</li>
        </ul>
      </div>
    ),
    className: 'w-96',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert variant="info" title="Information">
        This is an informational message.
      </Alert>
      
      <Alert variant="success" title="Success">
        Your changes have been saved successfully.
      </Alert>
      
      <Alert variant="warning" title="Warning">
        Please review your information before continuing.
      </Alert>
      
      <Alert variant="error" title="Error">
        There was a problem with your request.
      </Alert>
    </div>
  ),
};