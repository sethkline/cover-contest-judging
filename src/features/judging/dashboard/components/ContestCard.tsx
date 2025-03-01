import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CategoryCard } from "./CategoryCard";

interface Category {
  categoryId: string;
  categoryName: string;
  total: number;
  judged: number;
  percentage: number;
}

interface ContestCardProps {
  contestId: string;
  contestName: string;
  contestType: string;
  categories: Category[];
  onStartJudging: (contestId: string, categoryId: string) => void;
}

export const ContestCard: React.FC<ContestCardProps> = ({
  contestId,
  contestName,
  contestType,
  categories,
  onStartJudging,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {contestName} ({contestType === "cover" ? "Cover" : "Bookmark"}{" "}
          Contest)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.categoryId}
              categoryId={category.categoryId}
              categoryName={category.categoryName}
              judged={category.judged}
              total={category.total}
              percentage={category.percentage}
              onStartJudging={(categoryId) =>
                onStartJudging(contestId, categoryId)
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};