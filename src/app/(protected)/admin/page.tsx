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
  UserPlus,
} from "lucide-react";
import { StatisticCard } from "@/features/judging/dashboard";
import { useEffect, useState } from "react";

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  title,
  bgColor = "bg-primary-600",
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
  className = "",
}: {
  href: string;
  icon: any;
  label: string;
  variant?: "filled" | "outlined";
  color?: "primary" | "secondary" | "neutral" | "info";
  className?: string;
}) => {
  const baseClasses =
    "flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition";

  const variantClasses = {
    filled: {
      primary: "bg-primary-600 hover:bg-primary-700 text-white",
      secondary: "bg-secondary-600 hover:bg-secondary-700 text-white",
      neutral: "bg-neutral-600 hover:bg-neutral-700 text-white",
      info: "bg-info-600 hover:bg-info-700 text-white",
    },
    outlined: {
      primary:
        "border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white",
      secondary:
        "border border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-white",
      neutral:
        "border border-neutral-600 text-neutral-600 hover:bg-neutral-600 hover:text-white",
      info: "border border-info-600 text-info-600 hover:bg-info-600 hover:text-white",
    },
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
  interface Activity {
    id: string;
    type: "entry" | "judge" | "contest";
    message: string;
    created_at: string;
    related_id?: string;
  }

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  // Use the client component version of supabase
  const supabase = createClientComponentClient();

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get counts using proper count API
        const { count: entriesCount, error: entriesError } = await supabase
          .from("entries")
          .select("*", { count: "exact", head: true });

        if (entriesError) throw entriesError;

        const { count: judgesCount, error: judgesError } = await supabase
          .from("judges")
          .select("*", { count: "exact", head: true });

        if (judgesError) throw judgesError;

        const { count: activeContestsCount, error: contestsError } =
          await supabase
            .from("contests")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true);

        if (contestsError) throw contestsError;

        setEntriesCount(entriesCount || 0);
        setJudgesCount(judgesCount || 0);
        setActiveContests(activeContestsCount || 0);

        // Fetch recent activities from the dedicated activities table
        const { data: activityData, error: activityError } = await supabase
          .from("activities")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (activityError) {
          console.error("Error fetching activities:", activityError);
          setRecentActivity([]);
        } else if (activityData && activityData.length > 0) {
          // Use activities from the dedicated table
          setRecentActivity(activityData);
        } else {
          // Fallback to compiling activities from other tables
          const activities: Activity[] = [];

          // Recent entries
          const { data: recentEntries, error: entriesError } = await supabase
            .from("entries")
            .select("id, participant_name, created_at")
            .order("created_at", { ascending: false })
            .limit(3);

          if (!entriesError && recentEntries) {
            recentEntries.forEach((entry) => {
              activities.push({
                id: `entry-${entry.id}`,
                type: "entry",
                message: `New entry submitted by ${entry.participant_name}`,
                created_at: entry.created_at,
                related_id: entry.id,
              });
            });
          }

          // Recent judge activities (scores)
          const { data: recentScores, error: scoresError } = await supabase
            .from("scores")
            .select(
              `
              id, 
              created_at,
              judges:judge_id(email),
              entries:entry_id(participant_name)
            `,
            )
            .order("created_at", { ascending: false })
            .limit(3);

          if (!scoresError && recentScores) {
            recentScores.forEach((score) => {
              activities.push({
                id: `score-${score.id}`,
                type: "judge",
                message: `Judge ${score.judges?.email || "Unknown"} scored entry by ${score.entries?.participant_name || "Unknown"}`,
                created_at: score.created_at,
                related_id: score.id,
              });
            });
          }

          // Sort all activities by date
          activities.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );

          // Take the 5 most recent
          setRecentActivity(activities.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setEntriesCount(0);
        setJudgesCount(0);
        setActiveContests(0);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const getActivityIcon = (type) => {
    switch (type) {
      case "entry":
        return <FileSpreadsheet className="text-primary-500" />;
      case "judge":
        return <Users className="text-secondary-500" />;
      case "contest":
        return <Award className="text-info-500" />;
      default:
        return <Settings className="text-neutral-500" />;
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
        <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
          Admin Dashboard
        </h1>

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
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start p-2 border-b border-neutral-200 dark:border-neutral-700 last:border-0"
                >
                  <div className="mr-3 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-neutral-800 dark:text-neutral-200">
                      {activity.message}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatRelativeTime(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 dark:text-neutral-400 text-center py-4">
              No recent activity found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Manage Contests Section */}
      <Card className="mb-6">
        <CardHeader title="Manage Contests" bgColor="bg-primary-600" />
        <CardContent>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Review and manage the current active contests, entries, and judging
            progress.
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
              href="/admin/judges"
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
              href="/admin/judges"
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
