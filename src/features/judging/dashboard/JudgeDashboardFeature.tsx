'use client';

import React, { useState, useEffect } from 'react';
import { Award, Clipboard, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Spinner } from '@/components/ui/progress-loading';

// Import the components
import { StatisticCard } from './components/StatisticCard';
import { ContestCard } from './components/ContestCard';
import { EmptyContestCard } from './components/EmptyContestCard';
import { InstructionCard } from './components/InstructionCard';

export const JudgeDashboardFeature = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [activeContests, setActiveContests] = useState([]);
  const [judgingProgress, setJudgingProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJudgeData() {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
          console.error('No user found');
          return;
        }

        // Get all age categories first
        const { data: categoriesData, error: categoriesError } = await supabase.from('age_categories').select('*');

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          throw categoriesError;
        }

        // Create category names lookup
        const categoryNames = categoriesData.reduce((acc, cat) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {});

        // Add "unknown" category display name
        categoryNames['unknown'] = 'Uncategorized';

        // Fetch active contests
        const { data: contests, error: contestsError } = await supabase
          .from('contests')
          .select('*')
          .eq('is_active', true);

        if (contestsError) {
          console.error('Error fetching contests:', contestsError);
          throw contestsError;
        }

        // For each contest, fetch progress statistics
        const progressData = {};

        for (const contest of contests) {
          // Get total entries for this contest
          const { data: entriesData, error: entriesError } = await supabase
            .from('entries')
            .select('id, age_category_id')
            .eq('contest_id', contest.id);

          if (entriesError) {
            console.error(`Error fetching entries for contest ${contest.id}:`, entriesError);
            throw entriesError;
          }

          // Get entries already judged by this user
          const { data: scoresData, error: scoresError } = await supabase
            .from('scores')
            .select('entry_id')
            .eq('judge_id', user.id);

          if (scoresError) {
            console.error(`Error fetching scores for user ${user.id}:`, scoresError);
            throw scoresError;
          }

          // Calculate judged entry IDs
          const judgedEntryIds = new Set(scoresData.map((score) => score.entry_id));

          // Group entries by age category and count judged/total
          const entriesByCategory = {};

          for (const entry of entriesData) {
            const categoryId = entry.age_category_id || 'unknown';

            if (!entriesByCategory[categoryId]) {
              entriesByCategory[categoryId] = {
                total: 0,
                judged: 0
              };
            }

            entriesByCategory[categoryId].total++;

            if (judgedEntryIds.has(entry.id)) {
              entriesByCategory[categoryId].judged++;
            }
          }

          progressData[contest.id] = {
            contestName: contest.name,
            contestType: contest.type,
            categories: Object.entries(entriesByCategory).map(([catId, counts]) => ({
              categoryId: catId,
              categoryName: categoryNames[catId] || 'Unknown',
              total: counts.total,
              judged: counts.judged,
              percentage: counts.total > 0 ? Math.round((counts.judged / counts.total) * 100) : 0
            }))
          };
        }

        setActiveContests(contests);
        setJudgingProgress(progressData);
      } catch (error) {
        console.error('Error fetching judge data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJudgeData();
  }, [supabase]);

  const startJudging = (contestId, categoryId) => {
    router.push(`/judge/entries?contest=${contestId}&category=${categoryId}`);
  };

  const viewInstructions = () => {
    router.push('/judge/instructions');
  };

  // Calculate stats
  const totalJudged = Object.values(judgingProgress).reduce(
    (total, contest) => total + contest.categories.reduce((catTotal, cat) => catTotal + cat.judged, 0),
    0
  );

  const totalEntries = Object.values(judgingProgress).reduce(
    (total, contest) => total + contest.categories.reduce((catTotal, cat) => catTotal + cat.total, 0),
    0
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" variant="primary" />
          <p className="mt-4 text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-600 mb-4">Judge Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatisticCard
            icon={Award}
            iconColor="text-rev-red-600"
            iconBgColor="bg-rev-red-200"
            label="Active Contests"
            value={activeContests.length}
          />

          <StatisticCard
            icon={Clipboard}
            iconColor="text-rev-purple"
            iconBgColor="bg-rev-grape"
            label="Entries Judged"
            value={totalJudged}
          />

          <StatisticCard
            icon={Layers}
            iconColor="text-rev-brown"
            iconBgColor="bg-rev-tan"
            label="Total Entries"
            value={totalEntries}
          />
        </div>
      </div>

      {activeContests.length === 0 ? (
        <EmptyContestCard />
      ) : (
        activeContests.map((contest) => (
          <ContestCard
            key={contest.id}
            contestId={contest.id}
            contestName={contest.name}
            contestType={contest.type}
            categories={judgingProgress[contest.id]?.categories || []}
            onStartJudging={startJudging}
          />
        ))
      )}

      <InstructionCard onViewInstructions={viewInstructions} />
    </div>
  );
};
