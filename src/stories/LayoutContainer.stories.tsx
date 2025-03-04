// src/stories/LayoutContainer.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { LayoutContainer } from "../components/layout/LayoutContainer";
import { Home, Users, Settings, FileText, Award } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";

const meta: Meta<typeof LayoutContainer> = {
  title: "Layout/LayoutContainer",
  component: LayoutContainer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    hasSidebar: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LayoutContainer>;

const adminSidebarItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <Home size={20} />,
    active: true,
  },
  {
    href: "/admin/contests",
    label: "Contests",
    icon: <Award size={20} />,
  },
  {
    href: "/admin/entries",
    label: "Entries",
    icon: <FileText size={20} />,
  },
  {
    href: "/admin/judges",
    label: "Judges",
    icon: <Users size={20} />,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: <Settings size={20} />,
  },
];

export const AdminLayout: Story = {
  args: {
    hasSidebar: true,
    headerProps: {
      userRole: "admin",
      userName: "Admin User",
    },
    sidebarProps: {
      items: adminSidebarItems,
      header: (
        <div className="flex items-center">
          <Award size={24} className="text-primary-600 mr-2" />
          <span className="font-bold text-neutral-900 dark:text-white">
            Admin Panel
          </span>
        </div>
      ),
    },
    children: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Contests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <div className="text-neutral-500 dark:text-neutral-400">
                Cover Contest, Bookmark Contest
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">147</div>
              <div className="text-neutral-500 dark:text-neutral-400">
                Across all contests
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Judges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <div className="text-neutral-500 dark:text-neutral-400">
                2 pending invitations
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="font-medium">New entry submitted</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Entry #127 in Cover Contest (Ages 8-11)
                </div>
              </div>
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="font-medium">Judge completed scoring</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Judge Sarah completed scoring 5 entries
                </div>
              </div>
              <div>
                <div className="font-medium">New judge invitation accepted</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  John Doe (john.doe@example.com) has joined as a judge
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },
};

export const JudgeLayout: Story = {
  args: {
    hasSidebar: true,
    headerProps: {
      userRole: "judge",
      userName: "Judge User",
    },
    sidebarProps: {
      items: [
        {
          href: "/judge/dashboard",
          label: "Dashboard",
          icon: <Home size={20} />,
          active: true,
        },
        {
          href: "/judge/entries",
          label: "Entries to Judge",
          icon: <FileText size={20} />,
        },
        {
          href: "/judge/profile",
          label: "Profile",
          icon: <Users size={20} />,
        },
      ],
      header: (
        <div className="flex items-center">
          <Award size={24} className="text-primary-600 mr-2" />
          <span className="font-bold text-neutral-900 dark:text-white">
            Judge Portal
          </span>
        </div>
      ),
    },
    children: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Judge Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">18</div>
              <div className="text-neutral-500 dark:text-neutral-400">
                Remaining to judge
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">32</div>
              <div className="text-neutral-500 dark:text-neutral-400">
                Thank you for your contributions!
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Contests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="font-medium">Cover Contest</div>
                <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
                  <div>Progress: 20/35 entries judged</div>
                  <div>Ages: 3-7, 8-11, 12+</div>
                </div>
              </div>
              <div>
                <div className="font-medium">Bookmark Contest</div>
                <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
                  <div>Progress: 12/15 entries judged</div>
                  <div>Ages: 8-11, 12+</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },
};

export const SimpleLayout: Story = {
  args: {
    hasSidebar: false,
    headerProps: {
      userRole: "guest",
    },
    children: (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Welcome to the Contest Platform</h1>

        <Card>
          <CardHeader>
            <CardTitle>About Our Contests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">
              Our library runs two annual contests for young artists and
              writers. The Cover Contest and Bookmark Contest provide an
              opportunity for creative expression and recognition of talent in
              our community.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cover Contest</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Design a cover for your favorite book or an original story. Open
                to ages 3-7, 8-11, and 12+.
              </p>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                Learn More
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bookmark Contest</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Create a bookmark design inspired by your favorite story. Open
                to ages 8-11 and 12+.
              </p>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                Learn More
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
};
