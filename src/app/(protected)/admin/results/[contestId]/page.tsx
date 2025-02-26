// src/app/(protected)/admin/results/[contestId]/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import EntryResultsClient from "@/components/EntryResultsClient";

export default async function ContestResultsPage({ params }) {
  const { contestId } = params;
  const supabase = createServerComponentClient({ cookies });

  // Fetch contest details
  const { data: contest } = await supabase
    .from("contests")
    .select("*")
    .eq("id", contestId)
    .single();

  if (!contest) {
    return <div>Contest not found</div>;
  }

  // Fetch all entries for this contest
  const { data: entries } = await supabase
    .from("entries")
    .select(
      `
      id, 
      entry_number,
      participant_name,
      participant_age,
      age_category_id,
      artist_statement,
      front_image_path
    `,
    )
    .eq("contest_id", contestId)
    .order("entry_number");

  // Fetch all scores for these entries
  const entryIds = entries?.map((entry) => entry.id) || [];
  const { data: allScores } = await supabase
    .from("scores")
    .select(
      "entry_id, judge_id, creativity_score, execution_score, impact_score",
    )
    .in("entry_id", entryIds);

  // Fetch all age categories
  const { data: categories } = await supabase
    .from("age_categories")
    .select("id, name")
    .order("min_age");

  // Create a category map for lookup
  const categoryMap = {};
  categories?.forEach((cat) => {
    categoryMap[cat.id] = cat.name;
  });

  // Calculate average scores for each entry
  const entryResults =
    entries?.map((entry) => {
      // Get all scores for this entry
      const entryScores =
        allScores?.filter((score) => score.entry_id === entry.id) || [];
      const judgeCount = entryScores.length;

      // Calculate average scores
      const avgCreativity =
        entryScores.reduce((sum, score) => sum + score.creativity_score, 0) /
        (judgeCount || 1);
      const avgExecution =
        entryScores.reduce((sum, score) => sum + score.execution_score, 0) /
        (judgeCount || 1);
      const avgImpact =
        entryScores.reduce((sum, score) => sum + score.impact_score, 0) /
        (judgeCount || 1);
      const totalScore = (avgCreativity + avgExecution + avgImpact) / 3;

      return {
        ...entry,
        category: categoryMap[entry.age_category_id] || "Unknown",
        judgeCount,
        scores: {
          creativity: avgCreativity.toFixed(1),
          execution: avgExecution.toFixed(1),
          impact: avgImpact.toFixed(1),
          total: totalScore.toFixed(1),
        },
      };
    }) || [];

  // Group by age category and sort by score within each group
  const entriesByCategory = {};
  entryResults.forEach((entry) => {
    const category = entry.category;
    if (!entriesByCategory[category]) {
      entriesByCategory[category] = [];
    }
    entriesByCategory[category].push(entry);
  });

  // Sort each category by total score (descending)
  Object.keys(entriesByCategory).forEach((category) => {
    entriesByCategory[category].sort(
      (a, b) => parseFloat(b.scores.total) - parseFloat(a.scores.total),
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{contest.name} Results</h1>
        <Link href="/admin/results" className="text-blue-600 hover:underline">
          Back to Results
        </Link>
      </div>

      {Object.keys(entriesByCategory).length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-medium text-gray-700">
            No entries found
          </h2>
          <p className="text-gray-500 mt-2">
            Add entries to this contest to see results.
          </p>
        </div>
      ) : (
        <EntryResultsClient entriesByCategory={entriesByCategory} />
      )}
    </div>
  );
}
