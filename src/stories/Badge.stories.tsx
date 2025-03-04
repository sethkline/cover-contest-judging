// src/stories/Badge.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../components/ui/Badge";
import {
  Check,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
  Award,
  Star,
  User,
} from "lucide-react";

const meta: Meta<typeof Badge> = {
  title: "Data Display/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "success",
        "warning",
        "error",
        "info",
        "outline",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    rounded: {
      control: "select",
      options: ["default", "full"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
    size: "default",
    rounded: "default",
  },
};

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Success: Story = {
  args: {
    children: "Success",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Warning",
    variant: "warning",
  },
};

export const Error: Story = {
  args: {
    children: "Error",
    variant: "error",
  },
};

export const InfoA: Story = {
  args: {
    children: "Info",
    variant: "info",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const RoundedFull: Story = {
  args: {
    children: "Rounded Full",
    rounded: "full",
  },
};

export const WithIcon: Story = {
  args: {
    children: "Completed",
    variant: "success",
    icon: <Check size={12} />,
  },
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="success" icon={<Check size={12} />}>
        Completed
      </Badge>
      <Badge variant="warning" icon={<Clock size={12} />}>
        Pending
      </Badge>
      <Badge variant="info" icon={<Info size={12} />}>
        In Review
      </Badge>
      <Badge variant="error" icon={<AlertCircle size={12} />}>
        Failed
      </Badge>
      <Badge variant="default" icon={<AlertTriangle size={12} />}>
        Needs Attention
      </Badge>
    </div>
  ),
};

export const AgeCategories: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="primary" rounded="full">
        Ages 3-7
      </Badge>
      <Badge variant="secondary" rounded="full">
        Ages 8-11
      </Badge>
      <Badge variant="info" rounded="full">
        Ages 12+
      </Badge>
    </div>
  ),
};

export const ContestTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="primary" icon={<Award size={12} />}>
        Cover Contest
      </Badge>
      <Badge variant="secondary" icon={<Star size={12} />}>
        Bookmark Contest
      </Badge>
    </div>
  ),
};

export const UserRoles: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="error" rounded="full" icon={<User size={12} />}>
        Admin
      </Badge>
      <Badge variant="info" rounded="full" icon={<User size={12} />}>
        Judge
      </Badge>
      <Badge variant="success" rounded="full" icon={<User size={12} />}>
        Participant
      </Badge>
    </div>
  ),
};

export const ScoreIndicator: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Scoring Progress:</h3>
        <div className="flex gap-2">
          <Badge variant="success">High Score: 9.5</Badge>
          <Badge variant="warning">Average Score: 7.2</Badge>
          <Badge variant="error">Low Score: 4.8</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Entry Count by Category:</h3>
        <div className="flex gap-2">
          <Badge variant="primary">Ages 3-7: 42</Badge>
          <Badge variant="secondary">Ages 8-11: 65</Badge>
          <Badge variant="info">Ages 12+: 40</Badge>
        </div>
      </div>
    </div>
  ),
};

export const EntryCard: Story = {
  render: () => (
    <div className="border rounded-lg p-4 w-72 bg-white dark:bg-neutral-800">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">Entry #127</h3>
        <Badge variant="primary" rounded="full">
          Ages 8-11
        </Badge>
      </div>

      <div className="aspect-[400/613] bg-neutral-100 dark:bg-neutral-700 rounded-md mb-3 flex items-center justify-center">
        <span className="text-neutral-400">Contest Image</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <Badge variant="success" size="sm" icon={<Check size={12} />}>
          Judged
        </Badge>
        <Badge variant="info" size="sm">
          Score: 8.7
        </Badge>
      </div>
    </div>
  ),
};
