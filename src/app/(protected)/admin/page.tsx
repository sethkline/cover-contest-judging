// src/app/(protected)/admin/page.tsx
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { 
  Award, 
  Users, 
  FileSpreadsheet, 
  PlusCircle, 
  Mail, 
  BarChart3,
  Settings,
  Calendar,
  List,
  UserPlus
} from "lucide-react";
import {StatisticCard} from "@/features/judging/dashboard";
import { useEffect, useState } from "react";

// Create a custom Card component using your design system
const Card = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ 
  title, 
  bgColor = "bg-primary-600" 
}: { 
  title: string; 
  bgColor?: string;
}) => (
  <div className={`${bgColor} text-white p-3`}>
    <h2 className="text-xl font-semibold">{title}</h2>
  </div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4">{children}</div>
);

const ActionButton = ({ 
  href, 
  icon: Icon, 
  label, 
  variant = "filled", 
  color = "primary",
  className = ""
}: { 
  href: string; 
  icon: any;
  label: string;
  variant?: "filled" | "outlined";
  color?: "primary" | "secondary" | "neutral" | "info";
  className?: string;
}) => {
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition";
  
  const variantClasses = {
    filled: {
      primary: "bg-primary-600 hover:bg-primary-700 text-white",
      secondary: "bg-secondary-600 hover:bg-secondary-700 text-white",
      neutral: "bg-neutral-600 hover:bg-neutral-700 text-white",
      info: "bg-info-600 hover:bg-info-700 text-white"
    },
    outlined: {
      primary: "border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white",
      secondary: "border border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-white",
      neutral: "border border-neutral-600 text-neutral-600 hover:bg-neutral-600 hover:text-white",
      info: "border border-info-600 text-info-600 hover:bg-info-600 hover:text-white"
    }
  };
  
  return (
    <Link 
      href={href}
      className={`${baseClasses} ${variantClasses[variant][color]} ${className}`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
};

export default function AdminDashboard() {
  const [entriesCount, setEntriesCount] = useState(0);
  const [judgesCount, setJudgesCount] = useState(0);
  const [activeContests, setActiveContests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([
    { type: 'entry', message: 'New entry submitted: "Project Alpha"', time: '2 hours ago' },
    { type: 'judge', message: 'Judge Sarah completed 5 evaluations', time: '3 hours ago' },
    { type: 'contest', message: 'Spring Challenge now active', time: '1 day ago' }
  ]);

  // Use the client component version of supabase
  const supabase = createClientComponentClient();

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Properly fetch the data using the client component
        const { data: entriesData } = await supabase
          .from('entries')
          .select('id', { count: 'exact' });
        
        const { data: judgesData } = await supabase
          .from('judges')
          .select('id', { count: 'exact' });
        
        const { data: contestsData } = await supabase
          .from('contests')
          .select('id')
          .eq('status', 'active');
        
        setEntriesCount(entriesData?.length || 42);
        setJudgesCount(judgesData?.length || 8);
        setActiveContests(contestsData?.length || 3);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to sample data
        setEntriesCount(42);
        setJudgesCount(8);
        setActiveContests(3);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'entry': return <FileSpreadsheet className="text-primary-500" />;
      case 'judge': return <Users className="text-secondary-500" />;
      case 'contest': return <Award className="text-info-500" />;
      default: return <Settings className="text-neutral-500" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
          <div className="h-64 w-full bg-neutral-100 dark:bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatisticCard
            icon={FileSpreadsheet}
            iconColor="text-primary-600"
            iconBgColor="bg-primary-100 dark:bg-primary-900/30"
            label="Total Entries"
            value={entriesCount}
          />

          <StatisticCard
            icon={Users}
            iconColor="text-secondary-600"
            iconBgColor="bg-secondary-100 dark:bg-secondary-900/30"
            label="Judges"
            value={judgesCount}
          />

          <StatisticCard
            icon={Award}
            iconColor="text-info-600"
            iconBgColor="bg-info-100 dark:bg-info-900/30"
            label="Active Contests"
            value={activeContests}
          />
        </div>
      </div>

      {/* Recent Activity Section */}
      <Card className="mb-6">
        <CardHeader title="Recent Activity" bgColor="bg-info-600" />
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start p-2 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
                <div className="mr-3 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-neutral-800 dark:text-neutral-200">{activity.message}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manage Contests Section */}
      <Card className="mb-6">
        <CardHeader title="Manage Contests" bgColor="bg-primary-600" />
        <CardContent>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Review and manage the current active contests, entries, and judging progress.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionButton
              href="/admin/entries"
              icon={List}
              label="Manage Entries"
              variant="filled"
              color="primary"
            />
            <ActionButton
              href="/admin/contests"
              icon={Calendar}
              label="Manage Contests"
              variant="filled"
              color="primary"
            />
            <ActionButton
              href="/admin/results"
              icon={BarChart3}
              label="View Results"
              variant="outlined"
              color="primary"
              className="md:col-span-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Judges Management Section */}
      <Card className="mb-6">
        <CardHeader title="Judges Management" bgColor="bg-secondary-600" />
        <CardContent>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Invite new judges to the system and monitor judging progress.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionButton
              href="/admin/judges"
              icon={Users}
              label="Manage Judges"
              variant="outlined"
              color="secondary"
            />
            <ActionButton
              href="/admin/judges/invite"
              icon={UserPlus}
              label="Invite Judge"
              variant="filled"
              color="secondary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <Card>
        <CardHeader title="Quick Actions" bgColor="bg-neutral-700" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionButton
              href="/admin/entries/new"
              icon={PlusCircle}
              label="Add New Entry"
              variant="filled"
              color="primary"
            />
            <ActionButton
              href="/admin/judges/invite"
              icon={Mail}
              label="Invite New Judge"
              variant="filled"
              color="secondary"
            />
            <ActionButton
              href="/admin/results"
              icon={BarChart3}
              label="View Contest Results"
              variant="filled"
              color="info"
              className="md:col-span-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}