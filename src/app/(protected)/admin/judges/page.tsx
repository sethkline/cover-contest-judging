'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JudgesPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [judges, setJudges] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [judgeProgress, setJudgeProgress] = useState({});

  const router = useRouter();

  useEffect(() => {
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get the current user to verify admin status
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (user?.user_metadata?.role !== 'admin') {
        throw new Error('Not authorized');
      }

      // Then fetch judges
      const { data, error } = await supabase.from('judges').select('*').order('created_at', { ascending: false });

      if (error) throw error;
      setJudges(data || []);
    } catch (error) {
      console.error('Error fetching judges:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch judges');
    } finally {
      setLoading(false);
    }
  };

  const fetchJudgeProgress = async () => {
    try {
      // Get all entries count
      const { data: entriesCount, error: entriesError } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true });

      if (entriesError) throw entriesError;

      // For each judge, get number of entries they've scored
      const judgeProgressData = {};

      for (const judge of judges) {
        const { data: scores, error: scoresError } = await supabase
          .from('scores')
          .select('*', { count: 'exact', head: true })
          .eq('judge_id', judge.id);

        if (scoresError) throw scoresError;

        // Calculate completion percentage
        const totalEntries = entriesCount.count || 0;
        const judgedEntries = scores.count || 0;
        const completionPercentage = totalEntries > 0 ? Math.round((judgedEntries / totalEntries) * 100) : 0;

        judgeProgressData[judge.id] = {
          judgedEntries,
          totalEntries,
          completionPercentage
        };
      }

      setJudgeProgress(judgeProgressData);
    } catch (error) {
      console.error('Error fetching judge progress:', error);
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
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      console.log('Starting invite process for:', email);

      // Call our API route
      const response = await fetch('/api/admin/judges/invite-judge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to invite judge');
      }

      setSuccess('Judge invitation sent successfully');
      setEmail('');
      fetchJudges();
    } catch (error) {
      console.error('Error inviting judge:', error);
      setError(error instanceof Error ? error.message : 'Failed to invite judge');
    } finally {
      setInviting(false);
    }
  };
  const resendInvite = async (judgeEmail: string) => {
    try {
      setError(null);

      // Send magic link for invitation
      const { error } = await supabase.auth.signInWithOtp({
        email: judgeEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
          data: {
            role: 'judge'
          }
        }
      });

      if (error) throw error;
      setSuccess(`Invitation resent to ${judgeEmail}`);
    } catch (error) {
      console.error('Error resending invite:', error);
      setError(error instanceof Error ? error.message : 'Failed to resend invite');
    }
  };

  const deleteJudge = async (judgeId: string, judgeEmail: string) => {
    try {
      setError(null);

      // Confirm deletion
      if (!window.confirm(`Are you sure you want to delete judge ${judgeEmail}?`)) {
        return;
      }

      // Delete from judges table first
      const { error: judgeError } = await supabase.from('judges').delete().eq('id', judgeId);

      if (judgeError) throw judgeError;

      // Delete auth user using admin API route
      const response = await fetch('/api/admin/judges/delete-judge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: judgeId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete judge');
      }

      setSuccess(`Judge ${judgeEmail} has been deleted`);
      fetchJudges(); // Refresh the list
    } catch (error) {
      console.error('Error deleting judge:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete judge');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Judges</h1>

      {/* Invite Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Invite New Judge</h2>
        <form onSubmit={inviteJudge} className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <label htmlFor="judge-email" className="sr-only">
                Judge Email
              </label>
              <input
                id="judge-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter judge's email address"
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={inviting}
              />
            </div>
            <button
              type="submit"
              disabled={inviting || !email}
              className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {inviting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="-ml-1 mr-2 h-4 w-4" />
                  Send Invite
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Judges Table */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {judges.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No judges found
                  </td>
                </tr>
              ) : (
                judges.map((judge) => {
                  const progress = judgeProgress[judge.id] || {
                    judgedEntries: 0,
                    totalEntries: 0,
                    completionPercentage: 0
                  };

                  return (
                    <tr key={judge.id}>
                      <td className="px-6 py-4">{judge.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            judge.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {judge.status === 'active' ? (
                            <>
                              <span className="h-2 w-2 mr-1.5 rounded-full bg-green-600"></span>
                              Active
                            </>
                          ) : (
                            <>
                              <span className="h-2 w-2 mr-1.5 rounded-full bg-yellow-600"></span>
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(judge.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {judge.status === 'active' ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-gray-200 rounded-full h-2 flex-grow">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${progress.completionPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{progress.completionPercentage}%</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not started</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end">
                          {judge.status === 'pending' ? (
                            <button
                              onClick={() => resendInvite(judge.email)}
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              Resend
                            </button>
                          ) : (
                            <button
                              onClick={() => viewJudgeProgress(judge.id)}
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              Progress
                            </button>
                          )}
                          <button
                            onClick={() => deleteJudge(judge.id, judge.email)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
