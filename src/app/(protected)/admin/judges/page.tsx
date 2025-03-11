"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { Mail, Loader2, RefreshCw, Activity, Trash2 } from "lucide-react";
import { BaseButton } from "@/components/ui/BaseButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/Table";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext"; // Update path as needed

export default function JudgesPage() {
  const supabase = createClientComponentClient();
  const { userRole, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [judges, setJudges] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [judgeProgress, setJudgeProgress] = useState({});
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);

  const router = useRouter();

  // Check if user is authorized
  useEffect(() => {
    if (!authLoading && userRole !== "admin") {
      router.push("/unauthorized");
    }
  }, [authLoading, userRole, router]);

  useEffect(() => {
    if (!authLoading && userRole === "admin") {
      fetchJudges();
    }
  }, [authLoading, userRole]);

  const fetchJudges = async () => {
    try {
      setLoading(true);
      setError(null);

      // Then fetch judges - no need to check admin status again
      const { data, error } = await supabase
        .from("judges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJudges(data || []);
    } catch (error) {
      console.error("Error fetching judges:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch judges",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchJudgeProgress = async () => {
    try {
      // Get all entries count
      const { count: entriesCount, error: entriesError } = await supabase
        .from("entries")
        .select("*", { count: "exact", head: true });

      if (entriesError) throw entriesError;

      // For each judge, get number of entries they've scored
      const judgeProgressData = {};

      for (const judge of judges) {
        const { count: scoresCount, error: scoresError } = await supabase
          .from("scores")
          .select("*", { count: "exact", head: true })
          .eq("judge_id", judge.id);

        if (scoresError) throw scoresError;

        // Calculate completion percentage
        const totalEntries = entriesCount || 0;
        const judgedEntries = scoresCount || 0;
        const completionPercentage =
          totalEntries > 0
            ? Math.round((judgedEntries / totalEntries) * 100)
            : 0;

        judgeProgressData[judge.id] = {
          judgedEntries,
          totalEntries,
          completionPercentage,
        };
      }

      setJudgeProgress(judgeProgressData);
    } catch (error) {
      console.error("Error fetching judge progress:", error);
    }
  };

  // Call this after fetching judges
  useEffect(() => {
    if (judges.length > 0) {
      fetchJudgeProgress();
    }
  }, [judges]);

  // Add a function to view a judge's detailed progress
  const viewJudgeProgress = (judgeId: string) => {
    // Navigate to a page showing detailed judge progress
    router.push(`/admin/judges/${judgeId}/progress`);
  };

  const inviteJudge = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setInviting(true);
      setError(null);
      setSuccess(null);

      // Validate email
      if (!email || !email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }

      console.log("Starting invite process for:", email);

      // Call our API route
      const response = await fetch("/api/admin/judges/invite-judge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to invite judge");
      }

      setSuccess("Judge invitation sent successfully");
      setEmail("");
      fetchJudges();
    } catch (error) {
      console.error("Error inviting judge:", error);
      setError(
        error instanceof Error ? error.message : "Failed to invite judge",
      );
    } finally {
      setInviting(false);
    }
  };
  const resendInvite = async (judgeEmail: string) => {
    try {
      setError(null);
      setResendingEmail(judgeEmail);
  
      // Call our resend API endpoint instead of directly using supabase
      const response = await fetch("/api/admin/judges/resend-judge-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: judgeEmail }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to resend invitation");
      }
  
      setResendingEmail(null);
      setSuccess(`Invitation resent to ${judgeEmail}`);
  
      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Error resending invite:", error);
      setError(
        error instanceof Error ? error.message : "Failed to resend invite",
      );
      setResendingEmail(null);
    }
  };

  const deleteJudge = async (judgeId, judgeEmail) => {
    try {
      setError(null);

      // Confirm deletion
      if (
        !window.confirm(`Are you sure you want to delete judge ${judgeEmail}?`)
      ) {
        return;
      }

      // Start a transaction to handle all deletion operations on the server-side
      const response = await fetch("/api/admin/judges/delete-judge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: judgeId,
          email: judgeEmail,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete judge");
      }

      setSuccess(`Judge ${judgeEmail} has been deleted`);
      fetchJudges(); // Refresh the list
    } catch (error) {
      console.error("Error deleting judge:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete judge",
      );
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-lg">Checking authorization...</span>
      </div>
    );
  }

  // Don't render anything if not authorized
  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        Judges Management
      </h1>

      {/* Invite Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Invite New Judge</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={inviteJudge} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-grow">
                <Input
                  id="judge-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter judge's email address"
                  disabled={inviting}
                  className="w-full"
                />
              </div>
              <BaseButton
                type="submit"
                disabled={inviting || !email}
                className="w-full sm:w-auto"
              >
                {inviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invite
                  </>
                )}
              </BaseButton>
            </div>

            {error && (
              <Alert variant="error" title="Error">
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" title="Success">
                {success}
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Judges Table */}
      <Card>
        <CardHeader>
          <CardTitle>Judges</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {judges.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No judges found
                    </TableCell>
                  </TableRow>
                ) : (
                  judges.map((judge) => {
                    const progress = judgeProgress[judge.id] || {
                      judgedEntries: 0,
                      totalEntries: 0,
                      completionPercentage: 0,
                    };

                    return (
                      <TableRow key={judge.id}>
                        <TableCell>{judge.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              judge.status === "active"
                                ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-300"
                                : "bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300"
                            }
                          >
                            {judge.status === "active" ? "Active" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-neutral-500">
                          {new Date(judge.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {judge.status === "active" ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 flex-grow">
                                <div
                                  className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full"
                                  style={{
                                    width: `${progress.completionPercentage}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-neutral-600 dark:text-neutral-400 min-w-[40px] text-right">
                                {progress.completionPercentage}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-neutral-400 text-sm">
                              Not started
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {judge.status === "pending" ? (
                              <BaseButton
                                onClick={() => resendInvite(judge.email)}
                                variant="outline"
                                size="sm"
                                disabled={resendingEmail === judge.email}
                              >
                                {resendingEmail === judge.email ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Resend
                                  </>
                                )}
                              </BaseButton>
                            ) : (
                              <BaseButton
                                onClick={() => viewJudgeProgress(judge.id)}
                                variant="outline"
                                size="sm"
                              >
                                <Activity className="h-4 w-4 mr-1" />
                                Progress
                              </BaseButton>
                            )}
                            <BaseButton
                              onClick={() => deleteJudge(judge.id, judge.email)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </BaseButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
