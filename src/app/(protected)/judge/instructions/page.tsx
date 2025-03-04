"use client";

import { JudgeInstructionsRoute } from "@/components/ProtectedRoutes";
import JudgeInstructionsPage from "@/features/judging/instructions/JudgeInstructionsFeature";

export default function InstructionsPage() {
  return (
    <JudgeInstructionsRoute>
      <JudgeInstructionsPage />
    </JudgeInstructionsRoute>
  );
}
