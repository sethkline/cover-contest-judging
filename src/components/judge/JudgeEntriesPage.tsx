"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Save,
  Info,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { withJudgeAuth } from "@/lib/auth";
import { getSupabasePublicUrl } from "@/lib/utils/storage";

const JudgeEntriesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contestId = searchParams.get("contest");
  const categoryId = searchParams.get("category");

  const supabase = createClientComponentClient();

  const [showBackImage, setShowBackImage] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [contestInfo, setContestInfo] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [entries, setEntries] = useState([]);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [scores, setScores] = useState({
    creativity: 5,
    execution: 5,
    impact: 5,
  });

  // Handle empty or null categoryId
  useEffect(() => {
    if (!contestId) {
      router.push("/judge/dashboard");
      return;
    }

    async function fetchDefaultCategory() {
      try {
        // If category is null/undefined, fetch the first available category
        if (!categoryId || categoryId === "null") {
          const { data: categories, error } = await supabase
            .from("age_categories")
            .select("*")
            .order("min_age", { ascending: true })
            .limit(1);

          if (error) throw error;

          if (categories && categories.length > 0) {
            // Redirect to the same page but with the category parameter
            router.replace(
              `/judge/entries?contest=${contestId}&category=${categories[0].id}`,
            );
          }
        }
      } catch (error) {
        console.error("Error fetching default category:", error);
      }
    }

    fetchDefaultCategory();
  }, [contestId, categoryId, router]);

  // Fetch contest, category, and entries data
  useEffect(() => {
    if (!contestId || !categoryId || categoryId === "null") return;

    async function fetchData() {
      try {
        setIsLoading(true);

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Fetch contest info
        const { data: contestData, error: contestError } = await supabase
          .from("contests")
          .select("*")
          .eq("id", contestId)
          .single();

        if (contestError) throw contestError;

        // Fetch category info
        const { data: categoryData, error: categoryError } = await supabase
          .from("age_categories")
          .select("*")
          .eq("id", categoryId)
          .single();

        if (categoryError) throw categoryError;

        // Fetch entries in this contest and category
        const { data: entriesData, error: entriesError } = await supabase
          .from("entries")
          .select("*")
          .eq("contest_id", contestId)
          .eq("age_category_id", categoryId)
          .order("entry_number", { ascending: true });

        if (entriesError) throw entriesError;

        // Get all entries that have already been scored by this judge
        const { data: scoresData, error: scoresError } = await supabase
          .from("scores")
          .select("entry_id, creativity_score, execution_score, impact_score")
          .eq("judge_id", user.id);

        if (scoresError) throw scoresError;

        // Create a map of entry IDs to their scores
        const scoredEntriesMap = scoresData.reduce((map, score) => {
          map[score.entry_id] = {
            creativity: score.creativity_score,
            execution: score.execution_score,
            impact: score.impact_score,
          };
          return map;
        }, {});

        // Find the first unscored entry (if any)
        let firstUnscoredIndex = 0;
        for (let i = 0; i < entriesData.length; i++) {
          if (!scoredEntriesMap[entriesData[i].id]) {
            firstUnscoredIndex = i;
            break;
          }
        }

        setContestInfo(contestData);
        setCategoryInfo(categoryData);
        setEntries(entriesData);
        setCurrentEntryIndex(firstUnscoredIndex);

        // If there are scores for the first entry, set those
        const currentEntryId = entriesData[firstUnscoredIndex]?.id;
        if (currentEntryId && scoredEntriesMap[currentEntryId]) {
          setScores(scoredEntriesMap[currentEntryId]);
        } else {
          // Reset scores for this new entry
          setScores({
            creativity: 5,
            execution: 5,
            impact: 5,
          });
        }
      } catch (error) {
        console.error("Error fetching judging data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [contestId, categoryId, supabase]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        navigateToPreviousEntry();
      } else if (e.key === "ArrowRight") {
        navigateToNextEntry();
      } else if (e.key === "Escape") {
        setIsZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentEntryIndex, entries.length]);

  // Simulate image loading
  useEffect(() => {
    if (entries.length === 0) return;

    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [currentEntryIndex, showBackImage, entries.length]);

  const navigateToPreviousEntry = () => {
    if (currentEntryIndex > 0) {
      setCurrentEntryIndex((prev) => prev - 1);
      // Check if there are existing scores for this entry
      checkExistingScores(entries[currentEntryIndex - 1]?.id);
    }
  };

  const navigateToNextEntry = () => {
    if (currentEntryIndex < entries.length - 1) {
      setCurrentEntryIndex((prev) => prev + 1);
      // Check if there are existing scores for this entry
      checkExistingScores(entries[currentEntryIndex + 1]?.id);
    } else {
      // Handle end of entries
      router.push("/judge/dashboard");
    }
  };

  const checkExistingScores = async (entryId) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("scores")
        .select("creativity_score, execution_score, impact_score")
        .eq("entry_id", entryId)
        .eq("judge_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking scores:", error);
        return;
      }

      if (data) {
        // Entry has been scored before, load those scores
        setScores({
          creativity: data.creativity_score,
          execution: data.execution_score,
          impact: data.impact_score,
        });
      } else {
        // Reset scores for this new entry
        setScores({
          creativity: 5,
          execution: 5,
          impact: 5,
        });
      }
    } catch (error) {
      console.error("Error checking existing scores:", error);
    }
  };

  const handleScoreChange = (criterion, value) => {
    setScores((prev) => ({
      ...prev,
      [criterion]: Number(value),
    }));
  };

  const submitScores = async () => {
    if (!entries.length) return;

    try {
      setIsSaving(true);
      setSaveStatus(null);

      const currentEntry = entries[currentEntryIndex];
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Check if this entry has already been scored
      const { data: existingScore, error: checkError } = await supabase
        .from("scores")
        .select("id")
        .eq("entry_id", currentEntry.id)
        .eq("judge_id", user.id)
        .single();

      let saveError = null;

      if (existingScore) {
        // Update existing score
        const { error } = await supabase
          .from("scores")
          .update({
            creativity_score: scores.creativity,
            execution_score: scores.execution,
            impact_score: scores.impact,
          })
          .eq("id", existingScore.id);

        saveError = error;
      } else {
        // Insert new score
        const { error } = await supabase.from("scores").insert({
          entry_id: currentEntry.id,
          judge_id: user.id,
          creativity_score: scores.creativity,
          execution_score: scores.execution,
          impact_score: scores.impact,
        });

        saveError = error;
      }

      if (saveError) {
        setSaveStatus({
          type: "error",
          message: "Failed to save scores. Please try again.",
        });
      } else {
        setSaveStatus({
          type: "success",
          message: "Scores saved successfully!",
        });

        // Automatically move to the next entry after a short delay
        setTimeout(() => {
          navigateToNextEntry();
          setSaveStatus(null);
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting scores:", error);
      setSaveStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center min-h-screen">
        <div>Loading entries...</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-yellow-500">⚠️</div>
            <h2 className="text-xl font-bold">No Entries Available</h2>
            <p className="mb-4">
              There are no entries in this category that need judging.
            </p>
            <button
              onClick={() => router.push("/judge/dashboard")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentEntry = entries[currentEntryIndex];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Contest Type Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {contestInfo?.name || "Contest"} - {categoryInfo?.name || "Category"}
        </h1>
      </div>

      {/* Entry Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={navigateToPreviousEntry}
                className={`p-2 rounded-full ${
                  currentEntryIndex > 0
                    ? "hover:bg-gray-100 text-gray-700"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                disabled={currentEntryIndex === 0}
                title="Previous Entry (Left Arrow)"
              >
                <ChevronLeft />
              </button>
              <span>Entry #{currentEntry?.entry_number || 0}</span>
              <button
                onClick={navigateToNextEntry}
                className={`p-2 rounded-full ${
                  currentEntryIndex < entries.length - 1
                    ? "hover:bg-gray-100 text-gray-700"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                disabled={currentEntryIndex === entries.length - 1}
                title="Next Entry (Right Arrow)"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Age: {currentEntry?.participant_age}
              </span>
              {currentEntry?.artist_statement && (
                <div
                  className="relative group"
                  title="This entry has an artist statement"
                >
                  <Info size={16} className="text-blue-500 cursor-help" />
                  <div className="absolute right-0 mt-2 p-3 bg-white border rounded-md shadow-lg w-64 hidden group-hover:block z-10">
                    <p className="text-sm font-medium mb-1">
                      Artist Statement:
                    </p>
                    <p className="text-sm text-gray-600">
                      {currentEntry.artist_statement}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Image Container */}
            <div
              className={`relative transition-transform duration-200 ${
                isZoomed
                  ? "cursor-zoom-out scale-150 origin-top"
                  : "cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {isLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400">Loading...</div>
                </div>
              )}

              {/* Use the actual entry image paths */}
              <img
                src={
                  showBackImage && currentEntry?.back_image_path
                    ? getSupabasePublicUrl(
                        "contest-images",
                        currentEntry.back_image_path,
                      )
                    : currentEntry?.front_image_path
                      ? getSupabasePublicUrl(
                          "contest-images",
                          currentEntry.front_image_path,
                        )
                      : "/api/placeholder/400/613"
                }
                alt={`Contest Entry ${currentEntry?.entry_number}`}
                className={`w-full rounded-lg shadow-lg mb-4 ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
                style={{ aspectRatio: "400/613" }}
                loading="lazy"
              />

              {/* Zoom indicator */}
              <button
                className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                title={isZoomed ? "Zoom Out (Esc)" : "Zoom In"}
              >
                {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </button>
            </div>

            {/* Back/Front toggle - only show if there's a back image */}
            {currentEntry?.back_image_path && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBackImage(!showBackImage);
                }}
                className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full shadow-md hover:bg-white"
              >
                {showBackImage ? "Show Front" : "Show Back"}
              </button>
            )}
          </div>

          {/* Scoring Section - Only visible when not zoomed */}
          <div
            className={`space-y-4 mt-6 transition-opacity duration-200 ${isZoomed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <div className="space-y-2">
              <label className="block font-medium">Creativity (0-10)</label>
              <input
                type="range"
                min="0"
                max="10"
                value={scores.creativity}
                className="w-full"
                onChange={(e) =>
                  handleScoreChange("creativity", e.target.value)
                }
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0</span>
                <span className="font-medium">{scores.creativity}</span>
                <span>10</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Execution (0-10)</label>
              <input
                type="range"
                min="0"
                max="10"
                value={scores.execution}
                className="w-full"
                onChange={(e) => handleScoreChange("execution", e.target.value)}
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0</span>
                <span className="font-medium">{scores.execution}</span>
                <span>10</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Impact (0-10)</label>
              <input
                type="range"
                min="0"
                max="10"
                value={scores.impact}
                className="w-full"
                onChange={(e) => handleScoreChange("impact", e.target.value)}
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0</span>
                <span className="font-medium">{scores.impact}</span>
                <span>10</span>
              </div>
            </div>

            {saveStatus && (
              <div
                className={`p-3 rounded-md text-sm ${
                  saveStatus.type === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {saveStatus.message}
              </div>
            )}

            <div className="mt-6 pt-4 border-t">
              <button
                onClick={submitScores}
                disabled={isSaving}
                className={`w-full flex justify-center items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors ${
                  isSaving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Submit Scores & Next Entry
                  </>
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="text-center text-gray-600">
        <div>
          Entry {currentEntryIndex + 1} of {entries.length} in current category
        </div>
        <div className="text-sm mt-2">
          Use arrow keys to navigate • Click image or press Esc to zoom
        </div>
      </div>
    </div>
  );
};

export default withJudgeAuth(JudgeEntriesPage);
