import React from "react";
import { BaseButton } from "@/components/ui/BaseButton";
import { Alert } from "@/components/ui/Alert";
import { Save } from "lucide-react";
import { Rating } from "@/components/ui/Rating";

interface ScoringFormProps {
  scores: {
    creativity: number;
    execution: number;
    impact: number;
  };
  onScoreChange: (criterion: string, value: number) => void;
  onSubmit: () => void;
  isSaving: boolean;
  saveStatus: {
    type: "success" | "error";
    message: string;
  } | null;
}

export const ScoringForm: React.FC<ScoringFormProps> = ({
  scores,
  onScoreChange,
  onSubmit,
  isSaving,
  saveStatus,
}) => {
  return (
    <div className="space-y-4 mt-6">
      <Rating
        value={scores.creativity}
        onChange={(value) => onScoreChange("creativity", value)}
        label="Creativity (0-10)"
        max={10}
        className="w-full"
      />

      <Rating
        value={scores.execution}
        onChange={(value) => onScoreChange("execution", value)}
        label="Execution (0-10)"
        max={10}
        className="w-full"
      />

      <Rating
        value={scores.impact}
        onChange={(value) => onScoreChange("impact", value)}
        label="Impact (0-10)"
        max={10}
        className="w-full"
      />

      {saveStatus && (
        <Alert 
          variant={saveStatus.type === "success" ? "success" : "error"}
          onClose={() => {}}
        >
          {saveStatus.message}
        </Alert>
      )}

      <div className="mt-6 pt-4 border-t">
        <BaseButton
          onClick={onSubmit}
          disabled={isSaving}
          isLoading={isSaving}
          leftIcon={!isSaving ? <Save size={18} /> : undefined}
          className="w-full"
          variant="success"
        >
          Submit Scores & Next Entry
        </BaseButton>
      </div>
    </div>
  );
};