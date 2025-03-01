import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '../components/layout/Header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    userRole: {
      control: 'select',
      options: ['admin', 'judge', 'guest'],
    },
    onLogout: { action: 'logged out' },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[250px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Guest: Story = {
  args: {
    userRole: 'guest',
  },
};

export const LoggedInJudge: Story = {
  args: {
    userRole: 'judge',
    userName: 'Jane Smith',
  },
};

export const LoggedInAdmin: Story = {
  args: {
    userRole: 'admin',
    userName: 'Admin User',
  },
};

export const WithCustomLogo: Story = {
  args: {
    userRole: 'guest',
    logo: (
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary-600 mr-2"
        >
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
        <span className="font-bold text-xl">ContestApp</span>
      </div>
    ),
  },
};

export const WithCustomChildren: Story = {
  args: {
    userRole: 'admin',
    userName: 'Admin User',
    children: (
      <div className="px-3 py-2 rounded-md text-sm font-medium bg-secondary-600 text-white ml-2">
        New Contest
      </div>
    ),
  },
};