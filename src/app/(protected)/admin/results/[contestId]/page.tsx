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
      front_image_path,
      back_image_path
    `,
    )
    .eq("contest_id", contestId)
    .order("entry_number");

  // Fetch all scores for these entries
  const entryIds = entries?.map((entry) => entry.id) || [];
  const { data: allScores } = await supabase
    .from("scores")
    .select(
      `
      entry_id, 
      judge_id, 
      creativity_score, 
      execution_score, 
      impact_score,
      theme_interpretation_score,
      movement_representation_score,
      composition_score,
      color_usage_score,
      visual_focus_score,
      storytelling_score,
      technique_mastery_score,
      judge_comments
      `,
    )
    .in("entry_id", entryIds);

  console.log("Sample Score Object:", allScores?.[0] || "No scores");

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

      // Calculate average scores for all criteria
      const calcAverage = (scoreField) => {
        return (
          entryScores.reduce((sum, score) => {
            // Handle case where new score fields might be null for older scores
            const value = score[scoreField] || 0;
            return sum + value;
          }, 0) / (judgeCount || 1)
        );
      };

      console.log("Entry Scores for Entry #", entry.entry_number, entryScores);

      // Core criteria
      const avgCreativity = calcAverage("creativity_score");
      const avgExecution = calcAverage("execution_score");
      const avgImpact = calcAverage("impact_score");

      // Thematic Elements
      const avgThemeInterpretation = calcAverage("theme_interpretation_score");
      const avgMovementRepresentation = calcAverage(
        "movement_representation_score",
      );

      // Design Principles
      const avgComposition = calcAverage("composition_score");
      const avgColorUsage = calcAverage("color_usage_score");
      const avgVisualFocus = calcAverage("visual_focus_score");

      // Additional Considerations
      const avgStorytelling = calcAverage("storytelling_score");
      const avgTechniqueMastery = calcAverage("technique_mastery_score");

      console.log(
        "Average for theme_interpretation_score:",
        entryScores.map((s) => s.theme_interpretation_score),
        avgThemeInterpretation,
      );

      // Calculate overall score using all available criteria
      // Count how many criteria have values
      let criteriaCount = 0;
      let totalScoreSum = 0;

      const addIfPresent = (value) => {
        if (value > 0) {
          totalScoreSum += value;
          criteriaCount++;
        }
      };

      // Add all criteria that have values
      addIfPresent(avgCreativity);
      addIfPresent(avgExecution);
      addIfPresent(avgImpact);
      addIfPresent(avgThemeInterpretation);
      addIfPresent(avgMovementRepresentation);
      addIfPresent(avgComposition);
      addIfPresent(avgColorUsage);
      addIfPresent(avgVisualFocus);
      addIfPresent(avgStorytelling);
      addIfPresent(avgTechniqueMastery);

      // Calculate overall average
      const totalScore = totalScoreSum / (criteriaCount || 3); // Default to original 3 criteria if none present

      // Get all judge comments
      const comments = entryScores
        .filter((score) => score.judge_comments)
        .map((score) => score.judge_comments);

      return {
        ...entry,
        category: categoryMap[entry.age_category_id] || "Unknown",
        judgeCount,
        comments,
        scores: {
          // Core
          creativity: avgCreativity.toFixed(1),
          execution: avgExecution.toFixed(1),
          impact: avgImpact.toFixed(1),

          // Thematic
          themeInterpretation: avgThemeInterpretation.toFixed(1),
          movementRepresentation: avgMovementRepresentation.toFixed(1),

          // Design
          composition: avgComposition.toFixed(1),
          colorUsage: avgColorUsage.toFixed(1),
          visualFocus: avgVisualFocus.toFixed(1),

          // Additional
          storytelling: avgStorytelling.toFixed(1),
          techniqueMastery: avgTechniqueMastery.toFixed(1),

          // Total
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
        <Link
          href="/admin/results"
          className="text-primary-600 hover:underline"
        >
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
