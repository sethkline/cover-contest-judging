import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { BaseButton } from "@/components/ui/BaseButton";
import { AlertTriangle } from "lucide-react";

interface NoEntriesCardProps {
  onReturnToDashboard: () => void;
}

export const NoEntriesCard: React.FC<NoEntriesCardProps> = ({
  onReturnToDashboard,
}) => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-warning-100 p-3 rounded-full">
            <AlertTriangle className="w-12 h-12 text-warning-500" />
          </div>
        </div>
        <h2 className="text-xl font-bold">No Entries Available</h2>
        <p className="mb-4">
          There are no entries in this category that need judging.
        </p>
        <BaseButton onClick={onReturnToDashboard}>
          Return to Dashboard
        </BaseButton>
      </CardContent>
    </Card>
  );
};
