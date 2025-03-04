// src/stories/Rating.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Rating } from "../components/ui/Rating";

const meta: Meta<typeof Rating> = {
  title: "Form/Rating",
  component: Rating,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 10 },
    },
    max: {
      control: { type: "number", min: 1, max: 10 },
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    showValue: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    variant: {
      control: "select",
      options: ["numeric", "slider"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    value: 7,
    max: 10,
    showValue: true,
    variant: "slider",
    label: "Rating",
    className: "w-80",
  },
};

export const Numeric: Story = {
  args: {
    value: 7,
    max: 10,
    variant: "numeric",
    label: "Rating",
  },
};

export const Small: Story = {
  args: {
    value: 5,
    max: 10,
    size: "sm",
    label: "Rating (Small)",
    className: "w-64",
  },
};

export const Large: Story = {
  args: {
    value: 8,
    max: 10,
    size: "lg",
    label: "Rating (Large)",
    className: "w-96",
  },
};

export const Disabled: Story = {
  args: {
    value: 6,
    max: 10,
    disabled: true,
    label: "Rating (Disabled)",
    className: "w-80",
  },
};

export const WithoutValue: Story = {
  args: {
    value: 4,
    max: 10,
    showValue: false,
    label: "Rating (No Value Display)",
    className: "w-80",
  },
};

export const Interactive: Story = {
  render: () => {
    // Use React hooks directly in the render function
    const [value, setValue] = useState(5);
    return (
      <div className="space-y-8 w-80">
        <Rating
          value={value}
          onChange={setValue}
          label="Creativity Score"
          className="w-full"
        />

        <Rating
          value={value}
          onChange={setValue}
          variant="numeric"
          label="Creativity Score (Numeric)"
          className="w-full"
        />
      </div>
    );
  },
};

export const JudgingForm: Story = {
  render: () => {
    // Create separate state for each category
    const [creativityScore, setCreativityScore] = useState(7);
    const [executionScore, setExecutionScore] = useState(8);
    const [impactScore, setImpactScore] = useState(6);

    const totalScore = creativityScore + executionScore + impactScore;
    const maxPossible = 30;
    const percentage = Math.round((totalScore / maxPossible) * 100);

    return (
      <div className="space-y-6 w-96 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow">
        <h2 className="text-xl font-bold">Entry #127 - Scoring</h2>

        <div className="space-y-4">
          <Rating
            value={creativityScore}
            onChange={setCreativityScore}
            label="Creativity"
            className="w-full"
          />

          <Rating
            value={executionScore}
            onChange={setExecutionScore}
            label="Execution"
            className="w-full"
          />

          <Rating
            value={impactScore}
            onChange={setImpactScore}
            label="Impact"
            className="w-full"
          />
        </div>

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Overall Score</span>
            <span className="font-bold">
              {totalScore}/{maxPossible} ({percentage}%)
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  },
};
