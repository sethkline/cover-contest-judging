// src/stories/Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '../components/ui/Card';
import { BaseButton } from '../components/ui/BaseButton';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: 'select',
      options: ['flat', 'raised', 'outlined'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    elevation: 'raised',
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <BaseButton>Action</BaseButton>
        </CardFooter>
      </>
    ),
    className: 'w-80',
  },
  parameters: {
    docs: {
      source: {
        code: `
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <BaseButton>Action</BaseButton>
  </CardFooter>
</Card>
`,
      },
    },
  },
};

export const Flat: Story = {
  args: {
    elevation: 'flat',
    children: (
      <>
        <CardHeader>
          <CardTitle>Flat Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has no elevation.</p>
        </CardContent>
      </>
    ),
    className: 'w-80',
  },
};

export const Outlined: Story = {
  args: {
    elevation: 'outlined',
    children: (
      <>
        <CardHeader>
          <CardTitle>Outlined Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has an outline but no shadow.</p>
        </CardContent>
      </>
    ),
    className: 'w-80',
  },
};

export const EntryCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Entry #127</CardTitle>
        <CardDescription>Category: Ages 8-11</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-[400/613] bg-neutral-100 dark:bg-neutral-700 rounded-md mb-4 flex items-center justify-center">
          <span className="text-neutral-400">Contest Image</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">Creativity</span>
          <span>8/10</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">Execution</span>
          <span>9/10</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Impact</span>
          <span>7/10</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <BaseButton variant="outline" size="sm">Previous</BaseButton>
        <BaseButton size="sm">Next</BaseButton>
      </CardFooter>
    </Card>
  ),
};