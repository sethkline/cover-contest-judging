"use client";

import React, { useState, useEffect, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Award, Clock, Clipboard, Layers, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { withJudgeAuth } from "@/lib/auth";

const JudgeDashboard = () => {
  const router = useRouter();
  const [activeContests, setActiveContests] = useState([]);
  const [judgingProgress, setJudgingProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJudgeData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Fetch active contests
        const { data: contests, error: contestsError } = await supabase
          .from("contests")
          .select("*")
          .eq("is_active", true);

        if (contestsError) throw contestsError;

        // For each contest, fetch progress statistics
        const progressData = {};

        for (const contest of contests) {
          // Get total entries for this contest
          const { data: entriesData, error: entriesError } = await supabase
            .from("entries")
            .select("id, age_category_id")
            .eq("contest_id", contest.id);

          if (entriesError) throw entriesError;

          // Get entries already judged by this user
          const { data: scoresData, error: scoresError } = await supabase
            .from("scores")
            .select("entry_id")
            .eq("judge_id", user?.id);

          if (scoresError) throw scoresError;

          // Calculate judged entry IDs
          const judgedEntryIds = new Set(
            scoresData.map((score) => score.entry_id),
          );

          // Group entries by age category and count judged/total
          const entriesByCategory = {};

          for (const entry of entriesData) {
            const categoryId = entry.age_category_id;

            if (!entriesByCategory[categoryId]) {
              entriesByCategory[categoryId] = {
                total: 0,
                judged: 0,
              };
            }

            entriesByCategory[categoryId].total++;

            if (judgedEntryIds.has(entry.id)) {
              entriesByCategory[categoryId].judged++;
            }
          }

          // Get category names
          const { data: categoriesData, error: categoriesError } =
            await supabase.from("age_categories").select("*");

          if (categoriesError) throw categoriesError;

          const categoryNames = categoriesData.reduce((acc, cat) => {
            acc[cat.id] = cat.name;
            return acc;
          }, {});

          progressData[contest.id] = {
            contestName: contest.name,
            contestType: contest.type,
            categories: Object.entries(entriesByCategory).map(
              ([catId, counts]) => ({
                categoryId: catId,
                categoryName: categoryNames[catId] || "Unknown",
                total: counts.total,
                judged: counts.judged,
                percentage:
                  counts.total > 0
                    ? Math.round((counts.judged / counts.total) * 100)
                    : 0,
              }),
            ),
          };
        }

        setActiveContests(contests);
        setJudgingProgress(progressData);
      } catch (error) {
        console.error("Error fetching judge data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJudgeData();
  }, []);

  const startJudging = (contestId, categoryId) => {
    router.push(`/judge/entries?contest=${contestId}&category=${categoryId}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center min-h-screen">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Judge Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Award className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Contests</p>
                <p className="text-2xl font-bold">{activeContests.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Clipboard className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Entries Judged</p>
                <p className="text-2xl font-bold">
                  {Object.values(judgingProgress).reduce(
                    (total, contest) =>
                      total +
                      contest.categories.reduce(
                        (catTotal, cat) => catTotal + cat.judged,
                        0,
                      ),
                    0,
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Layers className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Entries</p>
                <p className="text-2xl font-bold">
                  {Object.values(judgingProgress).reduce(
                    (total, contest) =>
                      total +
                      contest.categories.reduce(
                        (catTotal, cat) => catTotal + cat.total,
                        0,
                      ),
                    0,
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {activeContests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Clock className="w-12 h-12 mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">No Active Contests</h3>
            <p className="text-gray-500 mt-1">
              There are no active contests available for judging at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        activeContests.map((contest) => (
          <Card key={contest.id} className="mb-6">
            <CardHeader>
              <CardTitle>
                {contest.name} (
                {contest.type === "cover" ? "Cover" : "Bookmark"} Contest)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {judgingProgress[contest.id]?.categories.map((category) => (
                  <div
                    key={category.categoryId}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex flex-wrap justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        Age Category: {category.categoryName}
                      </h3>
                      <div className="text-sm text-gray-500">
                        {category.judged} of {category.total} entries judged (
                        {category.percentage}%)
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>

                    <button
                      onClick={() =>
                        startJudging(contest.id, category.categoryId)
                      }
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        category.judged < category.total
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {category.judged < category.total
                        ? "Continue Judging"
                        : "Review Entries"}
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Instructions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Award className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-1">
                Need a refresher on judging?
              </h3>
              <p className="text-blue-700 text-sm mb-2">
                You can always revisit the instructions on how to effectively
                evaluate entries.
              </p>
              <button
                onClick={() => router.push("/judge/welcome")}
                className="text-sm text-blue-700 hover:text-blue-900 font-medium underline"
              >
                View Judging Instructions
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default withJudgeAuth(JudgeDashboard);
