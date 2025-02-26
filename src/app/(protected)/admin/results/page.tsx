// src/app/(protected)/admin/results/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function ResultsPage() {
  const supabase = createServerComponentClient({ cookies });

  // Fetch active contests
  const { data: contests } = await supabase
    .from("contests")
    .select("*")
    .order("name");

  // For each contest, calculate completion stats
  const contestResults = await Promise.all(
    contests?.map(async (contest) => {
      // Get entries for this contest
      const { data: entries, count: totalEntries } = await supabase
        .from("entries")
        .select("id, age_category_id", { count: "exact" })
        .eq("contest_id", contest.id);

      // Get all judges
      const { data: judges } = await supabase
        .from("judges")
        .select("id, email, status");

      // Get all scores
      const { data: scores } = await supabase
        .from("scores")
        .select("entry_id, judge_id");

      // Calculate judge completion
      const judgeStats = judges?.map((judge) => {
        const judgedEntryIds = new Set(
          scores
            ?.filter((score) => score.judge_id === judge.id)
            .map((score) => score.entry_id) || [],
        );

        const entriesJudged = judgedEntryIds.size;
        const isComplete = entriesJudged === totalEntries;
        const completionRate = totalEntries
          ? Math.round((entriesJudged / totalEntries) * 100)
          : 0;

        return {
          ...judge,
          entriesJudged,
          totalEntries,
          isComplete,
          completionRate,
        };
      });

      // Calculate overall completion
      const totalJudges = judges?.length || 0;
      const completedJudges =
        judgeStats?.filter((j) => j.isComplete).length || 0;
      const overallCompletionRate = totalJudges
        ? Math.round((completedJudges / totalJudges) * 100)
        : 0;

      return {
        ...contest,
        totalEntries,
        totalJudges,
        completedJudges,
        overallCompletionRate,
        judgeStats,
      };
    }) || [],
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contest Results</h1>
        <Link href="/admin" className="text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>

      {contestResults.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-medium text-gray-700">
            No contests found
          </h2>
          <p className="text-gray-500 mt-2">
            Create contests to see results here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {contestResults.map((contest) => (
            <div
              key={contest.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{contest.name}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      contest.overallCompletionRate === 100
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {contest.overallCompletionRate === 100
                      ? "Judging Complete"
                      : `${contest.overallCompletionRate}% Judged`}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Entries:</span>{" "}
                    {contest.totalEntries}
                  </div>
                  <div>
                    <span className="font-medium">Judges:</span>{" "}
                    {contest.totalJudges}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {contest.type}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="font-medium mb-2">Judge Completion</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Judge
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completion
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contest.judgeStats?.map((judge) => (
                        <tr key={judge.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {judge.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                judge.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {judge.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {judge.entriesJudged} / {judge.totalEntries} entries
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${
                                  judge.isComplete
                                    ? "bg-green-600"
                                    : "bg-blue-600"
                                }`}
                                style={{ width: `${judge.completionRate}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 flex justify-between items-center">
                <Link
                  href={`/admin/results/${contest.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  View Detailed Results
                </Link>

                {contest.overallCompletionRate === 100 && (
                  <Link
                    href={`/admin/results/${contest.id}/winners`}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Declare Winners
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
