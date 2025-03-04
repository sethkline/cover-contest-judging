import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Rating } from "@/components/ui/Rating";
import { TextArea } from "@/components/ui/TextArea";
import { BaseButton } from "@/components/ui/BaseButton";
import { FormField } from "@/components/ui/FormField";
import { Alert } from "@/components/ui/Alert";

interface ScoringFormProps {
  entryId: number;
  entryNumber: string;
  onSubmit?: (scores: {
    creativity: number;
    execution: number;
    impact: number;
    feedback: string;
  }) => void;
  onCancel?: () => void;
}

export const ScoringForm: React.FC<ScoringFormProps> = ({
  entryId,
  entryNumber,
  onSubmit,
  onCancel,
}) => {
  const [creativityScore, setCreativityScore] = useState(7);
  const [executionScore, setExecutionScore] = useState(7);
  const [impactScore, setImpactScore] = useState(7);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalScore = creativityScore + executionScore + impactScore;
  const maxPossible = 30;
  const percentage = Math.round((totalScore / maxPossible) * 100);
  const averageScore = (totalScore / 3).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (onSubmit) {
        onSubmit({
          creativity: creativityScore,
          execution: executionScore,
          impact: impactScore,
          feedback,
        });
      }

      setIsSubmitting(false);
      setSuccess(true);

      // Reset success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Score Entry #{entryNumber}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {success && (
            <Alert variant="success" onClose={() => setSuccess(false)}>
              Scores submitted successfully!
            </Alert>
          )}

          <div className="space-y-4">
            <Rating
              value={creativityScore}
              onChange={setCreativityScore}
              label="Creativity"
              max={10}
              className="w-full"
            />

            <Rating
              value={executionScore}
              onChange={setExecutionScore}
              label="Execution"
              max={10}
              className="w-full"
            />

            <Rating
              value={impactScore}
              onChange={setImpactScore}
              label="Impact"
              max={10}
              className="w-full"
            />
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Overall Score</span>
              <span className="font-bold">
                {totalScore}/{maxPossible} ({percentage}%)
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="text-right text-sm mt-1">
              <span className="font-medium">Average: {averageScore}/10</span>
            </div>
          </div>

          <FormField
            label="Feedback (Optional)"
            helpText="Provide constructive feedback for the participant"
          >
            <TextArea
              placeholder="Share your thoughts on the entry..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </FormField>
        </CardContent>

        <CardFooter className="flex justify-between">
          <BaseButton type="button" variant="outline" onClick={onCancel}>
            Cancel
          </BaseButton>

          <BaseButton type="submit" isLoading={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Scores"}
          </BaseButton>
        </CardFooter>
      </form>
    </Card>
  );
};
