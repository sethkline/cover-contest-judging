import React from "react";
import { ArrowUpRight } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-loading";
import { BaseButton } from "@/components/ui/BaseButton";

interface CategoryCardProps {
  categoryId: string;
  categoryName: string;
  judged: number;
  total: number;
  percentage: number;
  onStartJudging: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  categoryId,
  categoryName,
  judged,
  total,
  percentage,
  onStartJudging,
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Age Category: {categoryName}</h3>
        <div className="text-sm text-neutral-500">
          {judged} of {total} entries judged ({percentage}%)
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar
        value={percentage}
        variant={percentage === 100 ? "success" : "primary"}
        showValue={false}
        className="mb-4"
      />

      <BaseButton
        onClick={() => onStartJudging(categoryId)}
        variant={judged < total ? "default" : "success"}
        rightIcon={<ArrowUpRight size={16} />}
      >
        {judged === 0
          ? "Start Judging"
          : judged < total
          ? "Continue Judging"
          : "Review Entries"}
      </BaseButton>
    </div>
  );
};