"use client";

import { JudgeWelcomeRoute } from "@/components/ProtectedRoutes";
import JudgeWelcomePage from "@/components/judge/JudgeWelcomePage";

export default function WelcomePage() {
  return (
    <JudgeWelcomeRoute>
      <JudgeWelcomePage />
    </JudgeWelcomeRoute>
  );
}
