// src/stories/Sidebar.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "../components/layout/Sidebar";
import {
  Home,
  Users,
  Settings,
  FileText,
  Award,
  Activity,
  BookOpen,
  BarChart,
} from "lucide-react";

const meta: Meta<typeof Sidebar> = {
  title: "Layout/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    collapsed: {
      control: "boolean",
    },
    onCollapse: { action: "toggled collapse" },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const adminItems = [
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
    children: [
      {
        href: "/admin/contests/cover",
        label: "Cover Contest",
      },
      {
        href: "/admin/contests/bookmark",
        label: "Bookmark Contest",
      },
    ],
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
    href: "/admin/reports",
    label: "Reports",
    icon: <BarChart size={20} />,
    children: [
      {
        href: "/admin/reports/participation",
        label: "Participation",
      },
      {
        href: "/admin/reports/scores",
        label: "Scoring Analysis",
      },
    ],
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: <Settings size={20} />,
  },
];

const judgeItems = [
  {
    href: "/judge/dashboard",
    label: "Dashboard",
    icon: <Home size={20} />,
    active: true,
  },
  {
    href: "/judge/entries",
    label: "Entries to Judge",
    icon: <BookOpen size={20} />,
  },
  {
    href: "/judge/completed",
    label: "Completed Entries",
    icon: <Activity size={20} />,
  },
  {
    href: "/judge/profile",
    label: "Profile",
    icon: <Users size={20} />,
  },
];

export const AdminSidebar: Story = {
  args: {
    items: adminItems,
    collapsed: false,
    header: (
      <div className="flex items-center">
        <Award size={24} className="text-primary-600 mr-2" />
        <span className="font-bold text-neutral-900 dark:text-white">
          Admin Panel
        </span>
      </div>
    ),
    footer: (
      <div className="text-xs text-neutral-500 dark:text-neutral-400">
        Version 1.0.0
      </div>
    ),
  },
};

export const JudgeSidebar: Story = {
  args: {
    items: judgeItems,
    collapsed: false,
    header: (
      <div className="flex items-center">
        <BookOpen size={24} className="text-primary-600 mr-2" />
        <span className="font-bold text-neutral-900 dark:text-white">
          Judge Portal
        </span>
      </div>
    ),
  },
};

export const CollapsedSidebar: Story = {
  args: {
    items: adminItems,
    collapsed: true,
    header: (
      <div className="flex items-center justify-center">
        <Award size={24} className="text-primary-600" />
      </div>
    ),
  },
};
