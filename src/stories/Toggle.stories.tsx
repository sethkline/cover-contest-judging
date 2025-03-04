// src/stories/Toggle.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toggle } from "../components/ui/Toggle";
import { Check, Bell, Sun, Moon, Eye, EyeOff } from "lucide-react";

const meta: Meta<typeof Toggle> = {
  title: "Form/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    labelPosition: {
      control: "select",
      options: ["left", "right"],
    },
    disabled: {
      control: "boolean",
    },
    checked: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return <Toggle checked={checked} onChange={setChecked} />;
  },
};

export const WithLabel: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return <Toggle checked={checked} onChange={setChecked} label="Toggle me" />;
  },
};

export const LeftLabel: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return (
      <Toggle
        checked={checked}
        onChange={setChecked}
        label="Left label"
        labelPosition="left"
      />
    );
  },
};

export const Small: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return (
      <Toggle
        checked={checked}
        onChange={setChecked}
        size="sm"
        label="Small toggle"
      />
    );
  },
};

export const Large: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return (
      <Toggle
        checked={checked}
        onChange={setChecked}
        size="lg"
        label="Large toggle"
      />
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="space-y-4">
        <Toggle
          checked={false}
          onChange={() => {}}
          label="Disabled (off)"
          disabled
        />

        <Toggle
          checked={true}
          onChange={() => {}}
          label="Disabled (on)"
          disabled
        />
      </div>
    );
  },
};

export const WithIcon: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(true);

    return (
      <Toggle
        checked={checked}
        onChange={setChecked}
        label="With icon"
        icon={<Check />}
      />
    );
  },
};

export const Variants: Story = {
  render: function Render() {
    const [checkedDefault, setCheckedDefault] = useState(true);
    const [checkedSuccess, setCheckedSuccess] = useState(true);
    const [checkedWarning, setCheckedWarning] = useState(true);
    const [checkedError, setCheckedError] = useState(true);

    return (
      <div className="space-y-4">
        <Toggle
          checked={checkedDefault}
          onChange={setCheckedDefault}
          label="Default"
          variant="default"
        />

        <Toggle
          checked={checkedSuccess}
          onChange={setCheckedSuccess}
          label="Success"
          variant="success"
        />

        <Toggle
          checked={checkedWarning}
          onChange={setCheckedWarning}
          label="Warning"
          variant="warning"
        />

        <Toggle
          checked={checkedError}
          onChange={setCheckedError}
          label="Error"
          variant="error"
        />
      </div>
    );
  },
};

export const UseCases: Story = {
  render: function Render() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [visibility, setVisibility] = useState(true);

    return (
      <div className="space-y-4">
        <Toggle
          checked={notifications}
          onChange={setNotifications}
          label="Enable notifications"
          icon={<Bell />}
          variant="default"
        />

        <Toggle
          checked={darkMode}
          onChange={setDarkMode}
          label={darkMode ? "Dark mode" : "Light mode"}
          icon={darkMode ? <Moon /> : <Sun />}
          variant="success"
        />

        <Toggle
          checked={visibility}
          onChange={setVisibility}
          label={visibility ? "Visible" : "Hidden"}
          icon={visibility ? <Eye /> : <EyeOff />}
          variant="warning"
        />
      </div>
    );
  },
};

export const AllSizes: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(true);

    return (
      <div className="space-y-4">
        <Toggle
          checked={checked}
          onChange={setChecked}
          size="sm"
          label="Small toggle"
        />

        <Toggle
          checked={checked}
          onChange={setChecked}
          size="default"
          label="Default toggle"
        />

        <Toggle
          checked={checked}
          onChange={setChecked}
          size="lg"
          label="Large toggle"
        />
      </div>
    );
  },
};

export const SettingsForm: Story = {
  render: function Render() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
      <div className="space-y-6 p-6 border rounded-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm">Email Notifications</label>
            <Toggle
              checked={emailNotifications}
              onChange={setEmailNotifications}
              size="sm"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm">Auto-save</label>
            <Toggle
              checked={autoSave}
              onChange={setAutoSave}
              variant="success"
              size="sm"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm">Dark Mode</label>
            <Toggle
              checked={darkMode}
              onChange={setDarkMode}
              icon={darkMode ? <Moon /> : <Sun />}
              size="sm"
            />
          </div>
        </div>

        <div className="text-xs text-neutral-500 mt-2">
          Settings are automatically saved.
        </div>
      </div>
    );
  },
};
