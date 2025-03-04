"use client";

import { JudgeEntriesFeature } from "@/features/judging/entries";
import { withJudgeAuth } from "@/lib/auth";

const JudgeEntriesPage = () => {
  return <JudgeEntriesFeature />;
};

export default withJudgeAuth(JudgeEntriesPage);
