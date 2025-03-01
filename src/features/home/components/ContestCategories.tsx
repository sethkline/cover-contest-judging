import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Contest {
  title: string;
  description: string;
  categories?: string[];
  isActive?: boolean;
}

interface ContestCategoriesProps {
  contests: Contest[];
}

export const ContestCategories: React.FC<ContestCategoriesProps> = ({
  contests = [
    {
      title: "Program Cover Design Contest",
      description: "Three age categories: 3-7, 8-11, and 12+",
      categories: ["Ages 3-7", "Ages 8-11", "Ages 12+"],
      isActive: true
    }
  ]
}) => {
  return (
    <Card elevation="raised" className="mb-8">
      <CardHeader className="bg-primary-800 text-white">
        <CardTitle>Current Contests</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {contests.map((contest, index) => (
          <div key={index} className={index < contests.length - 1 ? "mb-6 pb-6 border-b" : "mb-2"}>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-primary-600 mb-1">{contest.title}</h3>
              {contest.isActive && (
                <Badge variant="success" size="sm">Active</Badge>
              )}
            </div>
            <p className="text-neutral-700 text-sm mb-2">
              {contest.description}
            </p>
            
            {contest.categories && (
              <div className="flex flex-wrap gap-2 mt-3">
                {contest.categories.map((category, catIndex) => (
                  <Badge key={catIndex} variant="primary" rounded="full">{category}</Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};