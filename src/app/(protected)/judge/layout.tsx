"use client";

import { JudgeLayoutFeature } from "@/features/judge/layout";

export default function JudgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <JudgeLayoutFeature>{children}</JudgeLayoutFeature>;
}