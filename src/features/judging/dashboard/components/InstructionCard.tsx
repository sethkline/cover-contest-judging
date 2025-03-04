import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Award } from "lucide-react";

interface InstructionCardProps {
  onViewInstructions: () => void;
}

export const InstructionCard: React.FC<InstructionCardProps> = ({
  onViewInstructions,
}) => {
  return (
    <Card className="bg-info-50 border-info-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-info-100 p-2 rounded-full">
            <Award className="text-info-600" size={20} />
          </div>
          <div>
            <h3 className="font-medium text-info-800 mb-1">
              Need a refresher on judging?
            </h3>
            <p className="text-info-700 text-sm mb-2">
              You can always revisit the instructions on how to effectively
              evaluate entries.
            </p>
            <button
              onClick={onViewInstructions}
              className="text-sm text-info-700 hover:text-info-900 font-medium underline"
            >
              View Judging Instructions
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
