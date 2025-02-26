"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  categoryId: string;
  categoryName: string;
  judged: number;
  total: number;
  percentage: number;
  onStartJudging: (categoryId: string) => void;
}

export default function CategoryCard({
  categoryId,
  categoryName,
  judged,
  total,
  percentage,
  onStartJudging,
}: CategoryCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Age Category: {categoryName}</h3>
        <div className="text-sm text-gray-500">
          {judged} of {total} entries judged ({percentage}%)
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <button
        onClick={() => onStartJudging(categoryId)}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
          judged === 0
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : judged < total
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {judged === 0
          ? "Start Judging"
          : judged < total
            ? "Continue Judging"
            : "Review Entries"}
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
