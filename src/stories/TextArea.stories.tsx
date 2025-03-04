// src/stories/TextArea.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "../components/ui/TextArea";

const meta: Meta<typeof TextArea> = {
  title: "Form/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error", "success"],
    },
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
    },
    disabled: {
      control: "boolean",
    },
    rows: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
    className: "w-80",
  },
};

export const Error: Story = {
  args: {
    placeholder: "Type your message here...",
    variant: "error",
    className: "w-80",
  },
};

export const Success: Story = {
  args: {
    placeholder: "Type your message here...",
    variant: "success",
    className: "w-80",
  },
};

export const NoResize: Story = {
  args: {
    placeholder: "This textarea cannot be resized...",
    resize: "none",
    className: "w-80",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "This textarea is disabled...",
    disabled: true,
    className: "w-80",
  },
};

export const WithValue: Story = {
  args: {
    value:
      "This is a pre-filled textarea with content that demonstrates how it looks when it contains text. The height adjusts based on the rows property.",
    className: "w-80",
  },
};

export const ArtistStatement: Story = {
  args: {
    placeholder: "Share the inspiration behind your artwork (optional)...",
    className: "w-80",
    rows: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          "An example of a textarea used for an artist statement in the contest entry form.",
      },
    },
  },
};

export const LargeTextArea: Story = {
  args: {
    placeholder: "Enter detailed feedback...",
    className: "w-96",
    rows: 8,
  },
};

export const WithFormField: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <label
        htmlFor="artist-statement"
        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        Artist Statement
      </label>
      <TextArea
        id="artist-statement"
        placeholder="Share the inspiration behind your artwork..."
        rows={4}
      />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Max 200 words. Tell us about your creative process.
      </p>
    </div>
  ),
};
