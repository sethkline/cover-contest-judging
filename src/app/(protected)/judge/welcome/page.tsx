"use client";

import { JudgeWelcomeRoute } from "@/components/ProtectedRoutes";
import JudgeWelcomePage from "@/features/judging/welcome/JudgeWelcomeFeature";

export default function WelcomePage() {
  return (
    <JudgeWelcomeRoute>
      <JudgeWelcomePage />
    </JudgeWelcomeRoute>
  );
}
