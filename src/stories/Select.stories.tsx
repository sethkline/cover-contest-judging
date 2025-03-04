// src/stories/Select.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../components/ui/Select";
import { Users, Calendar, Filter } from "lucide-react";

const meta: Meta<typeof Select> = {
  title: "Form/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error", "success"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
    fullWidth: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const ageCategories = [
  { value: "", label: "Select age category", disabled: true },
  { value: "3-7", label: "Ages 3-7" },
  { value: "8-11", label: "Ages 8-11" },
  { value: "12+", label: "Ages 12+" },
];

const contests = [
  { value: "", label: "Select contest", disabled: true },
  { value: "cover", label: "Cover Contest" },
  { value: "bookmark", label: "Bookmark Contest" },
];

export const Default: Story = {
  args: {
    options: ageCategories,
    className: "w-64",
  },
};

export const WithDefaultSelected: Story = {
  args: {
    options: ageCategories,
    defaultValue: "8-11",
    className: "w-64",
  },
};

export const Error: Story = {
  args: {
    options: ageCategories,
    variant: "error",
    className: "w-64",
  },
};

export const Success: Story = {
  args: {
    options: ageCategories,
    variant: "success",
    className: "w-64",
  },
};

export const Small: Story = {
  args: {
    options: ageCategories,
    size: "sm",
    className: "w-64",
  },
};

export const Large: Story = {
  args: {
    options: ageCategories,
    size: "lg",
    className: "w-64",
  },
};

export const Disabled: Story = {
  args: {
    options: ageCategories,
    disabled: true,
    className: "w-64",
  },
};

export const FullWidth: Story = {
  args: {
    options: ageCategories,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
};

export const WithLeftIcon: Story = {
  args: {
    options: ageCategories,
    icon: <Users size={16} />,
    className: "w-64",
  },
};

export const ContestSelector: Story = {
  args: {
    options: contests,
    icon: <Calendar size={16} />,
    placeholder: "Select contest",
    className: "w-64",
  },
  parameters: {
    docs: {
      description: {
        story: "A select component for choosing the contest type.",
      },
    },
  },
};

export const WithFormField: Story = {
  render: () => (
    <div className="space-y-2 w-64">
      <label
        htmlFor="age-category"
        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        Age Category
      </label>
      <Select
        id="age-category"
        options={ageCategories}
        icon={<Filter size={16} />}
      />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Select the appropriate age group for the participant.
      </p>
    </div>
  ),
};
