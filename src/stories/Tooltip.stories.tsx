// src/stories/Tooltip.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "../components/ui/Tooltip";
import { BaseButton } from "../components/ui/BaseButton";
import { Badge } from "../components/ui/Badge";
import {
  Info,
  HelpCircle,
  AlertCircle,
  Edit,
  Trash,
  Settings,
  Star,
  Award,
} from "lucide-react";

const meta: Meta<typeof Tooltip> = {
  title: "Feedback/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    delay: {
      control: { type: "number", min: 0, max: 1000, step: 100 },
    },
    sideOffset: {
      control: { type: "number", min: 0, max: 20 },
    },
    maxWidth: {
      control: { type: "number", min: 100, max: 500 },
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
  args: {
    content: "This is a tooltip",
    children: <BaseButton>Hover Me</BaseButton>,
  },
};

export const TopPosition: Story = {
  args: {
    content: "Tooltip on top",
    position: "top",
    children: <BaseButton>Top Tooltip</BaseButton>,
  },
};

export const RightPosition: Story = {
  args: {
    content: "Tooltip on right",
    position: "right",
    children: <BaseButton>Right Tooltip</BaseButton>,
  },
};

export const BottomPosition: Story = {
  args: {
    content: "Tooltip on bottom",
    position: "bottom",
    children: <BaseButton>Bottom Tooltip</BaseButton>,
  },
};

export const LeftPosition: Story = {
  args: {
    content: "Tooltip on left",
    position: "left",
    children: <BaseButton>Left Tooltip</BaseButton>,
  },
};

export const LongContent: Story = {
  args: {
    content:
      "This is a tooltip with a very long content that will wrap to multiple lines to demonstrate how the tooltip handles longer text content.",
    children: <BaseButton>Long Content</BaseButton>,
  },
};

export const WithIcon: Story = {
  args: {
    content: "Help information",
    children: (
      <Info className="h-5 w-5 text-neutral-500 hover:text-neutral-700 cursor-help" />
    ),
  },
};

export const ZeroDelay: Story = {
  args: {
    content: "Appears instantly!",
    delay: 0,
    children: <BaseButton>No Delay</BaseButton>,
  },
};

export const LongDelay: Story = {
  args: {
    content: "Takes a moment to appear",
    delay: 1000,
    children: <BaseButton>Long Delay (1s)</BaseButton>,
  },
};

export const WithHTMLContent: Story = {
  args: {
    content: (
      <div>
        <h3 className="font-bold mb-1">Contest Details</h3>
        <p>Ends on December 15, 2025</p>
      </div>
    ),
    maxWidth: 300,
    children: <BaseButton>HTML Content</BaseButton>,
  },
};

export const Disabled: Story = {
  args: {
    content: "This tooltip will not show up",
    disabled: true,
    children: <BaseButton>Disabled Tooltip</BaseButton>,
  },
};

export const PositionsShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <Tooltip content="Top tooltip" position="top">
        <BaseButton className="w-full">Top</BaseButton>
      </Tooltip>

      <Tooltip content="Right tooltip" position="right">
        <BaseButton className="w-full">Right</BaseButton>
      </Tooltip>

      <Tooltip content="Bottom tooltip" position="bottom">
        <BaseButton className="w-full">Bottom</BaseButton>
      </Tooltip>

      <Tooltip content="Left tooltip" position="left">
        <BaseButton className="w-full">Left</BaseButton>
      </Tooltip>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex space-x-4">
      <Tooltip content="Get help">
        <HelpCircle className="h-5 w-5 text-neutral-500 hover:text-neutral-700 cursor-help" />
      </Tooltip>

      <Tooltip content="Important information" position="bottom">
        <Info className="h-5 w-5 text-info-500 hover:text-info-700 cursor-help" />
      </Tooltip>

      <Tooltip content="Warning: This action cannot be undone" position="right">
        <AlertCircle className="h-5 w-5 text-warning-500 hover:text-warning-700 cursor-help" />
      </Tooltip>
    </div>
  ),
};

export const TableActions: Story = {
  render: () => (
    <div className="flex space-x-2">
      <Tooltip content="View details">
        <BaseButton variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Info className="h-4 w-4" />
        </BaseButton>
      </Tooltip>

      <Tooltip content="Edit entry">
        <BaseButton variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
        </BaseButton>
      </Tooltip>

      <Tooltip content="Delete entry">
        <BaseButton
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-error-500"
        >
          <Trash className="h-4 w-4" />
        </BaseButton>
      </Tooltip>
    </div>
  ),
};

export const FormHelp: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <label className="text-sm font-medium">Age Category</label>
          <Tooltip content="Age category determines which judges will review the entry">
            <HelpCircle className="h-4 w-4 text-neutral-400 cursor-help" />
          </Tooltip>
        </div>
        <select className="w-full border border-neutral-300 rounded-md p-2 text-sm">
          <option>Ages 3-7</option>
          <option>Ages 8-11</option>
          <option>Ages 12+</option>
        </select>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <label className="text-sm font-medium">Artist Statement</label>
          <Tooltip content="A brief explanation of the inspiration or meaning behind the artwork">
            <HelpCircle className="h-4 w-4 text-neutral-400 cursor-help" />
          </Tooltip>
        </div>
        <textarea
          className="w-full border border-neutral-300 rounded-md p-2 text-sm"
          rows={3}
        />
      </div>
    </div>
  ),
};

export const BadgeWithTooltip: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Tooltip content="Entries scored by at least 3 judges">
          <Badge variant="success">Fully Judged</Badge>
        </Tooltip>
      </div>

      <div>
        <Tooltip content="Entries with at least one judge's score">
          <Badge variant="warning">Partially Judged</Badge>
        </Tooltip>
      </div>

      <div>
        <Tooltip content="Entries waiting for judges to score">
          <Badge variant="error">Not Judged</Badge>
        </Tooltip>
      </div>
    </div>
  ),
};

export const ContestInfo: Story = {
  render: () => (
    <div className="flex items-center space-x-6">
      <div className="text-center">
        <Tooltip content="This contest is currently accepting submissions">
          <div className="flex flex-col items-center">
            <Settings className="h-8 w-8 text-primary-500 mb-1" />
            <span className="text-sm">Active</span>
          </div>
        </Tooltip>
      </div>

      <div className="text-center">
        <Tooltip content="147 entries have been submitted to this contest">
          <div className="flex flex-col items-center">
            <Award className="h-8 w-8 text-secondary-500 mb-1" />
            <span className="text-sm">147 Entries</span>
          </div>
        </Tooltip>
      </div>

      <div className="text-center">
        <Tooltip content="Average score across all judged entries">
          <div className="flex flex-col items-center">
            <Star className="h-8 w-8 text-warning-500 mb-1" />
            <span className="text-sm">8.4 Avg</span>
          </div>
        </Tooltip>
      </div>
    </div>
  ),
};
