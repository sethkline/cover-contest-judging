// src/stories/Accordion.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  Collapsible,
} from "../components/ui/Accordion";
import {
  Info,
  HelpCircle,
  Award,
  Book,
  Star,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { BaseButton } from "../components/ui/BaseButton";
import { Badge } from "../components/ui/Badge";

const meta: Meta<typeof Accordion> = {
  title: "Data Display/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    allowMultiple: {
      control: "boolean",
    },
    defaultIndex: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Accordion>
        <AccordionItem title="What is a contest judging application?">
          <p>
            A contest judging application helps manage art contests by tracking
            entries, assigning judges, and calculating scores. It streamlines
            the judging process and makes it more transparent and efficient.
          </p>
        </AccordionItem>

        <AccordionItem title="How are entries scored?">
          <p>Entries are scored based on three criteria:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Creativity: Originality and imagination</li>
            <li>Execution: Technical skill and craftsmanship</li>
            <li>Impact: Overall impression and effectiveness</li>
          </ul>
          <p className="mt-2">
            Each category is scored from 0-10, with the final score being an
            average.
          </p>
        </AccordionItem>

        <AccordionItem title="What age categories are available?">
          <p>We have three age categories for participants:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Ages 3-7</li>
            <li>Ages 8-11</li>
            <li>Ages 12+</li>
          </ul>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const AllowMultiple: Story = {
  render: () => (
    <div className="w-96">
      <Accordion allowMultiple defaultIndex={[0]}>
        <AccordionItem title="Section 1">
          <p>
            Content for section 1. This accordion allows multiple sections to be
            open at once. Try clicking on another section without closing this
            one.
          </p>
        </AccordionItem>

        <AccordionItem title="Section 2">
          <p>
            Content for section 2. You can have multiple sections open
            simultaneously.
          </p>
        </AccordionItem>

        <AccordionItem title="Section 3">
          <p>
            Content for section 3. This is useful when users might want to
            compare information across different sections.
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const WithDefaultOpen: Story = {
  render: () => (
    <div className="w-96">
      <Accordion defaultIndex={1}>
        <AccordionItem title="Section 1">
          <p>Content for section 1</p>
        </AccordionItem>

        <AccordionItem title="Section 2 (Default Open)">
          <p>Content for section 2. This section is open by default.</p>
        </AccordionItem>

        <AccordionItem title="Section 3">
          <p>Content for section 3</p>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="w-96">
      <Accordion>
        <AccordionItem
          title="Contest Information"
          icon={<Info className="h-5 w-5 text-primary-500" />}
        >
          <p>
            Information about the current contests, deadlines, and participation
            details.
          </p>
        </AccordionItem>

        <AccordionItem
          title="Judging Guidelines"
          icon={<Book className="h-5 w-5 text-info-500" />}
        >
          <p>
            Guidelines for judges, including scoring criteria and best
            practices.
          </p>
        </AccordionItem>

        <AccordionItem
          title="Prizes & Recognition"
          icon={<Award className="h-5 w-5 text-warning-500" />}
        >
          <p>
            Information about prizes, certificates, and recognition for winners.
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <div className="w-96">
      <Accordion>
        <AccordionItem title="Available Contest">
          <p>This contest is currently accepting entries.</p>
        </AccordionItem>

        <AccordionItem
          title="Closed Contest"
          disabled
          icon={<AlertTriangle className="h-4 w-4 text-warning-500" />}
        >
          <p>This contest is closed and no longer accepting entries.</p>
        </AccordionItem>

        <AccordionItem title="Upcoming Contest">
          <p>This contest will be open for entries soon.</p>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const WithCustomStyling: Story = {
  render: () => (
    <div className="w-96">
      <Accordion>
        <AccordionItem
          title="Primary Section"
          className="border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20"
          titleClassName="bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100"
        >
          <p>Custom styled content for the primary section.</p>
        </AccordionItem>

        <AccordionItem
          title="Success Section"
          className="border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-900/20"
          titleClassName="bg-success-100 dark:bg-success-900/30 text-success-900 dark:text-success-100"
        >
          <p>Custom styled content for the success section.</p>
        </AccordionItem>

        <AccordionItem
          title="Warning Section"
          className="border-warning-200 dark:border-warning-800 bg-warning-50 dark:bg-warning-900/20"
          titleClassName="bg-warning-100 dark:bg-warning-900/30 text-warning-900 dark:text-warning-100"
        >
          <p>Custom styled content for the warning section.</p>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const SimpleCollapsible: Story = {
  render: () => (
    <div className="w-96">
      <Collapsible
        trigger={
          <div className="flex items-center justify-between w-full">
            <span>Show Details</span>
            <HelpCircle className="h-4 w-4 text-neutral-500" />
          </div>
        }
      >
        <p>
          This is a simple collapsible component that can be used for single
          expandable sections. It's a simplified version of the AccordionItem
          that can be used standalone.
        </p>
      </Collapsible>
    </div>
  ),
};

export const WithComplexContent: Story = {
  render: () => (
    <div className="w-96">
      <Accordion>
        <AccordionItem
          title={
            <div className="flex items-center justify-between w-full">
              <span>Contest Overview</span>
              <Badge variant="primary">Active</Badge>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Cover Contest 2025</h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                Design a cover for your favorite book or an original story.
              </p>
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <div className="font-medium">Start Date</div>
                <div>January 15, 2025</div>
              </div>
              <div>
                <div className="font-medium">End Date</div>
                <div>March 15, 2025</div>
              </div>
            </div>

            <div className="pt-2">
              <BaseButton size="sm" variant="outline">
                View Details
              </BaseButton>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem
          title={
            <div className="flex items-center justify-between w-full">
              <span>Judging Progress</span>
              <Badge variant="info">In Progress</Badge>
            </div>
          }
        >
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Overall Completion</span>
                <span>68%</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: "68%" }}
                />
              </div>
            </div>

            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Ages 3-7</span>
                <span>42/50 Entries</span>
              </div>
              <div className="flex justify-between">
                <span>Ages 8-11</span>
                <span>35/65 Entries</span>
              </div>
              <div className="flex justify-between">
                <span>Ages 12+</span>
                <span>25/32 Entries</span>
              </div>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const FAQExample: Story = {
  render: () => (
    <div className="w-full max-w-3xl p-6 border rounded-lg bg-white dark:bg-neutral-900">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

      <Accordion className="space-y-4">
        <AccordionItem
          title="How do I submit an entry to the contest?"
          icon={<HelpCircle className="h-4 w-4 text-primary-500" />}
        >
          <p>To submit an entry to the contest, follow these steps:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Log into your account or create a new one.</li>
            <li>
              Navigate to the "Contests" section and select the contest you wish
              to enter.
            </li>
            <li>Click on the "Submit Entry" button.</li>
            <li>Fill out the required information and upload your artwork.</li>
            <li>Review your submission and click "Submit".</li>
          </ol>
          <p className="mt-2">
            You'll receive a confirmation email once your entry has been
            successfully submitted.
          </p>
        </AccordionItem>

        <AccordionItem
          title="What are the age categories for the contest?"
          icon={<HelpCircle className="h-4 w-4 text-primary-500" />}
        >
          <p>We have three age categories for participants:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Ages 3-7: For younger children</li>
            <li>Ages 8-11: For middle-grade children</li>
            <li>Ages 12+: For older children and teenagers</li>
          </ul>
          <p className="mt-2">
            Please ensure you select the correct age category when submitting
            your entry.
          </p>
        </AccordionItem>

        <AccordionItem
          title="How are the winners selected?"
          icon={<HelpCircle className="h-4 w-4 text-primary-500" />}
        >
          <p>Winners are selected through a careful judging process:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Each entry is reviewed by multiple judges.</li>
            <li>
              Judges score entries based on creativity, execution, and impact.
            </li>
            <li>Each category receives a score from 0-10.</li>
            <li>
              Final scores are calculated as an average of all judges' scores.
            </li>
            <li>
              The highest-scoring entries in each age category are selected as
              winners.
            </li>
          </ol>
          <p className="mt-2">
            In case of a tie, a panel of senior judges will make the final
            decision.
          </p>
        </AccordionItem>

        <AccordionItem
          title="When will the winners be announced?"
          icon={<HelpCircle className="h-4 w-4 text-primary-500" />}
        >
          <p>
            Winners will be announced two weeks after the contest closing date.
            All participants will be notified via email, and the results will be
            published on our website and social media channels.
          </p>
        </AccordionItem>

        <AccordionItem
          title="What prizes are available for winners?"
          icon={<HelpCircle className="h-4 w-4 text-primary-500" />}
        >
          <div className="space-y-3">
            <p>
              We offer a variety of prizes for winners in each age category:
            </p>

            <div>
              <div className="font-medium">First Place:</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Gift card valued at $100</li>
                <li>Art supply package</li>
                <li>Winner's certificate</li>
                <li>Featured display of artwork in the library</li>
              </ul>
            </div>

            <div>
              <div className="font-medium">Second Place:</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Gift card valued at $50</li>
                <li>Art supply package</li>
                <li>Runner-up certificate</li>
              </ul>
            </div>

            <div>
              <div className="font-medium">Third Place:</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Gift card valued at $25</li>
                <li>Art supply package</li>
                <li>Honorable mention certificate</li>
              </ul>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem
          title="How can I contact support?"
          icon={<HelpCircle className="h-4 w-4 text-primary-500" />}
        >
          <p>
            If you have any questions or need assistance, you can contact our
            support team in several ways:
          </p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-neutral-500 mr-2" />
              <span>Email: support@contestapp.example</span>
            </div>
            <div>
              <BaseButton size="sm" variant="outline" className="mt-2">
                Open Support Chat
              </BaseButton>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
