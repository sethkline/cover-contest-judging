import React, { useState, useEffect } from 'react';
import { Award, Clipboard, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { withJudgeAuth } from '@/lib/auth';

// Import the components
import StatisticCard from '@/components/judge/dashboard/StatisticCard';
import ContestCard from '@/components/judge/dashboard//ContestCard';
import EmptyContestCard from '@/components/judge/dashboard/EmptyContestCard';
import InstructionCard from '@/components/judge/dashboard/InstructionCard';

const JudgeDashboard = () => {
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
          console.error("No user found");
          return;
        }
    
        console.log("Fetching data for user:", user.id);
    
        // Get all age categories first
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('age_categories')
          .select('*');
    
        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
          throw categoriesError;
        }
    
        console.log("Categories found:", categoriesData.length);
    
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
          console.error("Error fetching contests:", contestsError);
          throw contestsError;
        }
    
        console.log("Active contests found:", contests.length);
    
        // For each contest, fetch progress statistics
        const progressData = {};
    
        for (const contest of contests) {
          console.log("Processing contest:", contest.name);
          
          // Get total entries for this contest
          const { data: entriesData, error: entriesError } = await supabase
            .from('entries')
            .select('id, age_category_id')
            .eq('contest_id', contest.id);
    
          if (entriesError) {
            console.error(`Error fetching entries for contest ${contest.id}:`, entriesError);
            throw entriesError;
          }
    
          console.log(`Entries found for contest ${contest.name}:`, entriesData.length);
          
          // Log category IDs for debugging
          if (entriesData.length > 0) {
            console.log('Entry category IDs:', entriesData.map(e => e.age_category_id));
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
    
          console.log(`Scores found for user:`, scoresData.length);
    
          // Calculate judged entry IDs
          const judgedEntryIds = new Set(scoresData.map(score => score.entry_id));
    
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
    
        console.log("Setting active contests and progress data");
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
    router.push('/judge/welcome');
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
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Judge Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatisticCard
            icon={Award}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
            label="Active Contests"
            value={activeContests.length}
          />

          <StatisticCard
            icon={Clipboard}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
            label="Entries Judged"
            value={totalJudged}
          />

          <StatisticCard
            icon={Layers}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
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

export default withJudgeAuth(JudgeDashboard);
