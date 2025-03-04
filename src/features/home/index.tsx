import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContestTheme } from "./components/ContestTheme";
import { ContestCategories } from "./components/ContestCategories";
import { JudgeAccess } from "./components/JudgeAccess";

// Sample data - In a real app, this might come from an API or CMS
const contests = [
  {
    title: "Program Cover Design Contest",
    description: "Three age categories: 3-7, 8-11, and 12+",
    categories: ["Ages 3-7", "Ages 8-11", "Ages 12+"],
    isActive: true,
  },
];

export const HomeFeature: React.FC = () => {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Header logoOnly={true} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-3">
            Recital Cover Design Contest Judging Portal
          </h1>
        </div>

        <ContestTheme />

        <ContestCategories contests={contests} />

        <JudgeAccess />

        <Footer />
      </div>
    </main>
  );
};
