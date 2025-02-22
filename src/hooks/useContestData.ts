// src/hooks/useContestData.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useContestData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add new entry with images
  const addEntry = async (entryData, frontImage, backImage) => {
    try {
      setLoading(true);

      // 1. Upload images
      const frontImagePath = `entries/${Date.now()}_front.jpg`;
      const { data: frontImageData, error: frontError } = await supabase.storage
        .from('contest-images')
        .upload(frontImagePath, frontImage);

      if (frontError) throw frontError;

      let backImagePath = null;
      if (backImage) {
        backImagePath = `entries/${Date.now()}_back.jpg`;
        const { error: backError } = await supabase.storage
          .from('contest-images')
          .upload(backImagePath, backImage);
        
        if (backError) throw backError;
      }

      // 2. Create entry record
      const { data: entry, error: entryError } = await supabase
        .from('entries')
        .insert({
          contest_id: entryData.contestId,
          front_image_url: frontImagePath,
          back_image_url: backImagePath,
          age_category: entryData.ageCategory
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // 3. Create participant info record
      const { error: participantError } = await supabase
        .from('participant_info')
        .insert({
          entry_id: entry.id,
          full_name: entryData.fullName,
          age: entryData.age,
          artist_statement: entryData.artistStatement
        });

      if (participantError) throw participantError;

      return entry;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Invite judge
  const inviteJudge = async (email) => {
    try {
      setLoading(true);

      // 1. Create judge record
      const { data: judge, error: judgeError } = await supabase
        .from('judges')
        .insert({ email })
        .select()
        .single();

      if (judgeError) throw judgeError;

      // 2. Send invitation email using Supabase Edge Functions
      const { error: inviteError } = await supabase.functions.invoke('send-judge-invite', {
        body: { 
          email,
          judgeId: judge.id
        }
      });

      if (inviteError) throw inviteError;

      return judge;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get entries for judging
  const getEntriesToJudge = async (judgeId, contestId) => {
    try {
      setLoading(true);

      // Get entries that haven't been scored by this judge
      const { data, error } = await supabase
        .from('entries')
        .select(`
          *,
          scores!left (
            id,
            judge_id
          )
        `)
        .eq('contest_id', contestId)
        .is('scores.judge_id', null)
        .order('entry_number');

      if (error) throw error;

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Submit scores
  const submitScores = async (entryId, judgeId, scores) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('scores')
        .insert({
          entry_id: entryId,
          judge_id: judgeId,
          creativity_score: scores.creativity,
          execution_score: scores.execution,
          impact_score: scores.impact
        });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addEntry,
    inviteJudge,
    getEntriesToJudge,
    submitScores
  };
};