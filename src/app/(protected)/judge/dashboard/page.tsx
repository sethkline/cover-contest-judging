"use client";

import {JudgeDashboardFeature} from "@/features/judging/dashboard";
import { withJudgeAuth } from "@/lib/auth";

const JudgeDashboardPage = () => {
  return <JudgeDashboardFeature />;
};

export default withJudgeAuth(JudgeDashboardPage);