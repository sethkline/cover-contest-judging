// src/stories/CheckboxRadio.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox, Radio, RadioGroup } from "../components/ui/CheckBoxRadio";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import { BaseButton } from "../components/ui/BaseButton";

// Checkbox Meta
const checkboxMeta: Meta<typeof Checkbox> = {
  title: "Form/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
    },
    indeterminate: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
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
  },
};

export default checkboxMeta;
type CheckboxStory = StoryObj<typeof Checkbox>;

// Checkbox Stories
export const BasicCheckbox: CheckboxStory = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return <Checkbox checked={checked} onChange={setChecked} />;
  },
};

export const CheckboxWithLabel: CheckboxStory = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        checked={checked}
        onChange={setChecked}
        label="Accept terms and conditions"
      />
    );
  },
};

export const CheckboxWithDescription: CheckboxStory = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        checked={checked}
        onChange={setChecked}
        label="Subscribe to newsletter"
        description="Receive updates on contest announcements and results."
      />
    );
  },
};

export const IndeterminateCheckbox: CheckboxStory = {
  render: function Render() {
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(true);

    return (
      <div className="space-y-4">
        <Checkbox
          checked={checked}
          onChange={setChecked}
          indeterminate={indeterminate}
          label="Select all items"
        />

        <div className="pl-6 space-y-2">
          <Checkbox checked={checked} onChange={() => {}} label="Item 1" />
          <Checkbox checked={false} onChange={() => {}} label="Item 2" />
          <Checkbox checked={false} onChange={() => {}} label="Item 3" />
        </div>

        <div className="flex space-x-2 mt-2">
          <BaseButton
            size="sm"
            variant="outline"
            onClick={() => {
              setIndeterminate(!indeterminate);
              setChecked(false);
            }}
          >
            Toggle Indeterminate
          </BaseButton>
        </div>
      </div>
    );
  },
};

export const CheckboxSizes: CheckboxStory = {
  render: function Render() {
    const [checkedSm, setCheckedSm] = useState(false);
    const [checkedMd, setCheckedMd] = useState(false);
    const [checkedLg, setCheckedLg] = useState(false);

    return (
      <div className="space-y-4">
        <Checkbox
          checked={checkedSm}
          onChange={setCheckedSm}
          size="sm"
          label="Small checkbox"
        />

        <Checkbox
          checked={checkedMd}
          onChange={setCheckedMd}
          size="default"
          label="Default checkbox"
        />

        <Checkbox
          checked={checkedLg}
          onChange={setCheckedLg}
          size="lg"
          label="Large checkbox"
        />
      </div>
    );
  },
};

export const CheckboxVariants: CheckboxStory = {
  render: function Render() {
    const [checkedDefault, setCheckedDefault] = useState(true);
    const [checkedSuccess, setCheckedSuccess] = useState(true);
    const [checkedWarning, setCheckedWarning] = useState(true);
    const [checkedError, setCheckedError] = useState(true);

    return (
      <div className="space-y-4">
        <Checkbox
          checked={checkedDefault}
          onChange={setCheckedDefault}
          variant="default"
          label="Default variant"
        />

        <Checkbox
          checked={checkedSuccess}
          onChange={setCheckedSuccess}
          variant="success"
          label="Success variant"
        />

        <Checkbox
          checked={checkedWarning}
          onChange={setCheckedWarning}
          variant="warning"
          label="Warning variant"
        />

        <Checkbox
          checked={checkedError}
          onChange={setCheckedError}
          variant="error"
          label="Error variant"
        />

        <Checkbox
          checked={false}
          onChange={() => {}}
          error="This field is required"
          label="With error message"
        />
      </div>
    );
  },
};

export const DisabledCheckbox: CheckboxStory = {
  render: function Render() {
    return (
      <div className="space-y-4">
        <Checkbox
          checked={false}
          onChange={() => {}}
          disabled
          label="Disabled unchecked"
        />

        <Checkbox
          checked={true}
          onChange={() => {}}
          disabled
          label="Disabled checked"
        />

        <Checkbox
          checked={false}
          onChange={() => {}}
          disabled
          indeterminate
          label="Disabled indeterminate"
        />
      </div>
    );
  },
};

export const LeftLabelCheckbox: CheckboxStory = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        checked={checked}
        onChange={setChecked}
        label="Label on the left"
        labelPosition="left"
      />
    );
  },
};

export const CheckboxGroup: CheckboxStory = {
  render: function Render() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const categories = [
      { id: "cover", label: "Cover Contest" },
      { id: "bookmark", label: "Bookmark Contest" },
      { id: "illustration", label: "Illustration Contest" },
    ];

    const handleCategoryChange = (id: string, isChecked: boolean) => {
      if (isChecked) {
        setSelectedCategories([...selectedCategories, id]);
      } else {
        setSelectedCategories(
          selectedCategories.filter((catId) => catId !== id),
        );
      }
    };

    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Contest Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <Checkbox
                key={category.id}
                checked={selectedCategories.includes(category.id)}
                onChange={(checked) =>
                  handleCategoryChange(category.id, checked)
                }
                label={category.label}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-neutral-500">
            Selected: {selectedCategories.length}
          </p>
        </CardFooter>
      </Card>
    );
  },
};

// Radio Stories
export const BasicRadio: StoryObj<typeof Radio> = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return <Radio checked={checked} onChange={setChecked} />;
  },
};

export const RadioWithLabel: StoryObj<typeof Radio> = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return (
      <Radio
        checked={checked}
        onChange={setChecked}
        label="Select this option"
      />
    );
  },
};

export const RadioWithDescription: StoryObj<typeof Radio> = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return (
      <Radio
        checked={checked}
        onChange={setChecked}
        label="Email notifications"
        description="Receive contest updates via email."
      />
    );
  },
};

export const RadioSizes: StoryObj<typeof Radio> = {
  render: function Render() {
    const [checkedSm, setCheckedSm] = useState(false);
    const [checkedMd, setCheckedMd] = useState(false);
    const [checkedLg, setCheckedLg] = useState(false);

    return (
      <div className="space-y-4">
        <Radio
          checked={checkedSm}
          onChange={setCheckedSm}
          size="sm"
          label="Small radio"
        />

        <Radio
          checked={checkedMd}
          onChange={setCheckedMd}
          size="default"
          label="Default radio"
        />

        <Radio
          checked={checkedLg}
          onChange={setCheckedLg}
          size="lg"
          label="Large radio"
        />
      </div>
    );
  },
};

export const RadioVariants: StoryObj<typeof Radio> = {
  render: function Render() {
    const [checkedDefault, setCheckedDefault] = useState(true);
    const [checkedSuccess, setCheckedSuccess] = useState(true);
    const [checkedWarning, setCheckedWarning] = useState(true);
    const [checkedError, setCheckedError] = useState(true);

    return (
      <div className="space-y-4">
        <Radio
          checked={checkedDefault}
          onChange={setCheckedDefault}
          variant="default"
          label="Default variant"
        />

        <Radio
          checked={checkedSuccess}
          onChange={setCheckedSuccess}
          variant="success"
          label="Success variant"
        />

        <Radio
          checked={checkedWarning}
          onChange={setCheckedWarning}
          variant="warning"
          label="Warning variant"
        />

        <Radio
          checked={checkedError}
          onChange={setCheckedError}
          variant="error"
          label="Error variant"
        />

        <Radio
          checked={false}
          onChange={() => {}}
          error="Please select an option"
          label="With error message"
        />
      </div>
    );
  },
};

export const DisabledRadio: StoryObj<typeof Radio> = {
  render: function Render() {
    return (
      <div className="space-y-4">
        <Radio
          checked={false}
          onChange={() => {}}
          disabled
          label="Disabled unchecked"
        />

        <Radio
          checked={true}
          onChange={() => {}}
          disabled
          label="Disabled checked"
        />
      </div>
    );
  },
};

export const LeftLabelRadio: StoryObj<typeof Radio> = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return (
      <Radio
        checked={checked}
        onChange={setChecked}
        label="Label on the left"
        labelPosition="left"
      />
    );
  },
};

// RadioGroup Stories
export const BasicRadioGroup: StoryObj<typeof RadioGroup> = {
  render: function Render() {
    const [value, setValue] = useState("option1");

    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ];

    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={options}
        name="basic-radio-group"
      />
    );
  },
};

export const RadioGroupWithDescriptions: StoryObj<typeof RadioGroup> = {
  render: function Render() {
    const [value, setValue] = useState("email");

    const options = [
      {
        value: "email",
        label: "Email",
        description: "Get notified via email.",
      },
      {
        value: "sms",
        label: "SMS",
        description: "Get notified via text message.",
      },
      {
        value: "push",
        label: "Push Notification",
        description: "Get notified via mobile app.",
      },
    ];

    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={options}
        name="notification-preferences"
      />
    );
  },
};

export const HorizontalRadioGroup: StoryObj<typeof RadioGroup> = {
  render: function Render() {
    const [value, setValue] = useState("no");

    const options = [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "maybe", label: "Maybe" },
    ];

    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={options}
        name="horizontal-radio-group"
        orientation="horizontal"
      />
    );
  },
};

export const RadioGroupWithError: StoryObj<typeof RadioGroup> = {
  render: function Render() {
    const [value, setValue] = useState("");

    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ];

    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={options}
        name="error-radio-group"
        error="Please select an option"
      />
    );
  },
};

export const AgeGroupSelection: StoryObj<typeof RadioGroup> = {
  render: function Render() {
    const [value, setValue] = useState("");

    const options = [
      { value: "3-7", label: "Ages 3-7", description: "For younger children." },
      {
        value: "8-11",
        label: "Ages 8-11",
        description: "For middle-grade children.",
      },
      {
        value: "12+",
        label: "Ages 12+",
        description: "For older children and teenagers.",
      },
    ];

    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Select Age Category</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={value}
            onChange={setValue}
            options={options}
            name="age-category"
            error={value ? "" : "Age category is required"}
          />
        </CardContent>
        <CardFooter>
          <BaseButton disabled={!value} className="w-full">
            Continue
          </BaseButton>
        </CardFooter>
      </Card>
    );
  },
};

export const ContestTypeSelection: StoryObj<typeof RadioGroup> = {
  render: function Render() {
    const [value, setValue] = useState("cover");

    const options = [
      {
        value: "cover",
        label: "Cover Contest",
        description: "Design a cover for your favorite book.",
      },
      {
        value: "bookmark",
        label: "Bookmark Contest",
        description: "Create a bookmark design inspired by a story.",
      },
    ];

    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Select Contest Type</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={value}
            onChange={setValue}
            options={options}
            name="contest-type"
            variant="success"
          />
        </CardContent>
      </Card>
    );
  },
};
