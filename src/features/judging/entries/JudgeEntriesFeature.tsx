'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getSupabasePublicUrl } from '@/lib/utils/storage';
import { Spinner } from '@/components/ui/progress-loading';
import { EntryImage } from './components/EntryImage';
import { ScoringForm } from './components/ScoringForm';
import { ProgressIndicator } from './components/ProgressIndicator';
import { EntryHeader } from './components/EntryHeader';
import { NoEntriesCard } from './components/NoEntriesCard';

export const JudgeEntriesFeature = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contestId = searchParams.get('contest');
  const categoryId = searchParams.get('category');

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
    // Core criteria
    creativity: 5,
    execution: 5,
    impact: 5,

    // Thematic Elements
    themeInterpretation: 5,
    movementRepresentation: 5,

    // Design Principles
    composition: 5,
    colorUsage: 5,
    visualFocus: 5,

    // Additional Considerations
    storytelling: 5,
    techniqueMastery: 5,

    comments: ''
  });

  // Handle empty or null categoryId
  useEffect(() => {
    if (!contestId) {
      router.push('/judge/dashboard');
      return;
    }

    async function fetchDefaultCategory() {
      try {
        // If category is null/undefined, fetch the first available category
        if (!categoryId || categoryId === 'null') {
          const { data: categories, error } = await supabase
            .from('age_categories')
            .select('*')
            .order('min_age', { ascending: true })
            .limit(1);

          if (error) throw error;

          if (categories && categories.length > 0) {
            // Redirect to the same page but with the category parameter
            router.replace(`/judge/entries?contest=${contestId}&category=${categories[0].id}`);
          }
        }
      } catch (error) {
        console.error('Error fetching default category:', error);
      }
    }

    fetchDefaultCategory();
  }, [contestId, categoryId, router]);

  // Fetch contest, category, and entries data
  useEffect(() => {
    if (!contestId || !categoryId || categoryId === 'null') return;

    async function fetchData() {
      try {
        setIsLoading(true);

        // Get current user
        const {
          data: { user }
        } = await supabase.auth.getUser();

        // Fetch contest info
        const { data: contestData, error: contestError } = await supabase
          .from('contests')
          .select('*')
          .eq('id', contestId)
          .single();

        if (contestError) throw contestError;

        // Fetch category info
        const { data: categoryData, error: categoryError } = await supabase
          .from('age_categories')
          .select('*')
          .eq('id', categoryId)
          .single();

        if (categoryError) throw categoryError;

        // Fetch entries in this contest and category
        const { data: entriesData, error: entriesError } = await supabase
          .from('entries')
          .select('*')
          .eq('contest_id', contestId)
          .eq('age_category_id', categoryId)
          .order('entry_number', { ascending: true });

        if (entriesError) throw entriesError;

        // Get all entries that have already been scored by this judge
        const { data: scoresData, error: scoresError } = await supabase
          .from('scores')
          .select(
            `
            entry_id, 
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
          `
          )
          .eq('judge_id', user.id);

        if (scoresError) throw scoresError;

        // Create a map of entry IDs to their scores
        const scoredEntriesMap = scoresData.reduce((map, score) => {
          map[score.entry_id] = {
            creativity: score.creativity_score,
            execution: score.execution_score,
            impact: score.impact_score,
            themeInterpretation: score.theme_interpretation_score,
            movementRepresentation: score.movement_representation_score,
            composition: score.composition_score,
            colorUsage: score.color_usage_score,
            visualFocus: score.visual_focus_score,
            storytelling: score.storytelling_score,
            techniqueMastery: score.technique_mastery_score,
            comments: score.judge_comments
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
            themeInterpretation: 5,
            movementRepresentation: 5,
            composition: 5,
            colorUsage: 5,
            visualFocus: 5,
            storytelling: 5,
            techniqueMastery: 5,
            comments: ''
          });
        }
      } catch (error) {
        console.error('Error fetching judging data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [contestId, categoryId, supabase]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        navigateToPreviousEntry();
      } else if (e.key === 'ArrowRight') {
        navigateToNextEntry();
      } else if (e.key === 'Escape') {
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
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
      router.push('/judge/dashboard');
    }
  };

  const checkExistingScores = async (entryId) => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('scores')
        .select(
          `
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
        `
        )
        .eq('entry_id', entryId)
        .eq('judge_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking scores:', error);
        return;
      }

      if (data) {
        // Entry has been scored before, load those scores
        setScores({
          creativity: data.creativity_score ?? 5,
          execution: data.execution_score ?? 5,
          impact: data.impact_score ?? 5,
          themeInterpretation: data.theme_interpretation_score ?? 5,
          movementRepresentation: data.movement_representation_score ?? 5,
          composition: data.composition_score ?? 5,
          colorUsage: data.color_usage_score ?? 5,
          visualFocus: data.visual_focus_score ?? 5,
          storytelling: data.storytelling_score ?? 5,
          techniqueMastery: data.technique_mastery_score ?? 5,
          comments: data.judge_comments || ''
        });
      } else {
        // Reset scores for this new entry
        setScores({
          creativity: 5,
          execution: 5,
          impact: 5,
          themeInterpretation: 5,
          movementRepresentation: 5,
          composition: 5,
          colorUsage: 5,
          visualFocus: 5,
          storytelling: 5,
          techniqueMastery: 5,
          comments: ''
        });
      }
    } catch (error) {
      console.error('Error checking existing scores:', error);
    }
  };

  const handleScoreChange = (criterion, value) => {
    setScores((prev) => ({
      ...prev,
      [criterion]: typeof value === 'number' ? Number(value) : value
    }));
  };

  const submitScores = async () => {
    if (!entries.length) return;

    try {
      setIsSaving(true);
      setSaveStatus(null);

      const currentEntry = entries[currentEntryIndex];
      const {
        data: { user }
      } = await supabase.auth.getUser();


      // Check if this entry has already been scored
      const { data: existingScore, error: checkError } = await supabase
        .from('scores')
        .select('id')
        .eq('entry_id', currentEntry?.id)
        .eq('judge_id', user?.id)
        .single();

      let saveError = null;
      let scoreId = null;

      if (existingScore) {
        // Update existing score
        const { error } = await supabase
          .from('scores')
          .update({
            creativity_score: scores.creativity ?? 5,
            execution_score: scores.execution ?? 5,
            impact_score: scores.impact ?? 5,
            theme_interpretation_score: scores.themeInterpretation ?? 5,
            movement_representation_score: scores.movementRepresentation ?? 5,
            composition_score: scores.composition ?? 5,
            color_usage_score: scores.colorUsage ?? 5,
            visual_focus_score: scores.visualFocus ?? 5,
            storytelling_score: scores.storytelling ?? 5,
            technique_mastery_score: scores.techniqueMastery ?? 5,
            judge_comments: scores.comments
          })
          .eq('id', existingScore.id);

        saveError = error;
        scoreId = existingScore.id;
      } else {
        // Insert new score
        const { data: newScore, error } = await supabase
        .from('scores')
        .insert({
          entry_id: currentEntry?.id,
          judge_id: user?.id,
          creativity_score: scores.creativity ?? 5,
          execution_score: scores.execution ?? 5,
          impact_score: scores.impact ?? 5,
          theme_interpretation_score: scores.themeInterpretation ?? 5,
          movement_representation_score: scores.movementRepresentation ?? 5,
          composition_score: scores.composition ?? 5,
          color_usage_score: scores.colorUsage ?? 5,
          visual_focus_score: scores.visualFocus ?? 5,
          storytelling_score: scores.storytelling ?? 5,
          technique_mastery_score: scores.techniqueMastery ?? 5,
          judge_comments: scores.comments
        })
        .select('id')
        .single();

        saveError = error;
        if (newScore) {
          scoreId = newScore.id;
        }
      }
     
    if (saveError) {
      setSaveStatus({
        type: 'error',
        message: 'Failed to save scores. Please try again.'
      });
    } else {
      // Log activity after successful score submission
      try {
        // First, get judge email for the activity message
        const { data: judgeData } = await supabase
          .from('judges')
          .select('email')
          .eq('id', user.id)
          .single();
          
        // Create activity record
        await supabase.from('activities').insert({
          type: 'judge',
          message: `Judge ${judgeData?.email || user.email || 'Unknown'} scored Entry #${currentEntry.entry_number}`,
          related_id: scoreId
        });
      } catch (activityError) {
        console.error('Error logging activity:', activityError);
        // Don't fail the submission if activity logging fails
      }

      setSaveStatus({
        type: 'success',
        message: 'Scores saved successfully!'
      });

      // Automatically move to the next entry after a short delay
      setTimeout(() => {
        navigateToNextEntry();
        setSaveStatus(null);
      }, 1500);
    }
  } catch (error) {
    console.error('Error submitting scores:', error);
    setSaveStatus({
      type: 'error',
      message: 'An unexpected error occurred. Please try again.'
    });
  } finally {
    setIsSaving(false);
  }
};

  if (isLoading && entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" variant="primary" />
          <p className="mt-4 text-neutral-600">Loading entries...</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <NoEntriesCard onReturnToDashboard={() => router.push('/judge/dashboard')} />
      </div>
    );
  }

  const currentEntry = entries[currentEntryIndex];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Contest Type Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {contestInfo?.name || 'Contest'} - {categoryInfo?.name || 'Category'}
        </h1>
      </div>

      {/* Entry Card */}
      <Card className="mb-6">
        <CardHeader>
          <EntryHeader
            entry={currentEntry}
            currentIndex={currentEntryIndex}
            totalEntries={entries.length}
            onPrevious={navigateToPreviousEntry}
            onNext={navigateToNextEntry}
          />
        </CardHeader>
        <CardContent>
          <EntryImage
            entry={currentEntry}
            isLoading={isLoading}
            isZoomed={isZoomed}
            showBackImage={showBackImage}
            onZoomToggle={() => setIsZoomed(!isZoomed)}
            onViewToggle={() => setShowBackImage(!showBackImage)}
            getImageUrl={(path) => getSupabasePublicUrl('contest-images', path)}
          />

          {/* Scoring Section - Only visible when not zoomed */}
          <div
            className={`transition-opacity duration-200 ${isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ScoringForm
              scores={scores}
              onScoreChange={handleScoreChange}
              onSubmit={submitScores}
              isSaving={isSaving}
              saveStatus={saveStatus}
            />
          </div>
        </CardContent>
      </Card>

      <ProgressIndicator currentIndex={currentEntryIndex} totalEntries={entries.length} />
    </div>
  );
};
