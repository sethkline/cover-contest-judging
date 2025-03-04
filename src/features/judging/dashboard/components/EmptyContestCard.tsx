import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Clock } from "lucide-react";

export const EmptyContestCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-neutral-100 p-3 rounded-full">
            <Clock className="w-12 h-12 text-neutral-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium">No Active Contests</h3>
        <p className="text-neutral-500 mt-1">
          There are no active contests available for judging at this time.
        </p>
      </CardContent>
    </Card>
  );
};
