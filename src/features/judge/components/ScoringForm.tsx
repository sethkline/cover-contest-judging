import React, { useState } from "react";
import { BaseButton } from "@/components/ui/BaseButton";
import { Alert } from "@/components/ui/Alert";
import { Save } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import { TextArea } from "@/components/ui/TextArea";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/Tabs";
import { Info } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

interface ScoringFormProps {
  scores: {
    // Core Criteria
    creativity: number;
    execution: number;
    impact: number;

    // Thematic Elements
    themeInterpretation?: number;
    movementRepresentation?: number;

    // Design Principles
    composition?: number;
    colorUsage?: number;
    visualFocus?: number;

    // Additional Considerations
    storytelling?: number;
    techniqueMastery?: number;

    comments?: string;
  };
  onScoreChange: (criterion: string, value: number | string) => void;
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
  // Initialize missing scores with default values
  const fullScores = {
    // Core Criteria
    creativity: scores.creativity ?? 5,
    execution: scores.execution ?? 5,
    impact: scores.impact ?? 5,

    // Thematic Elements
    themeInterpretation: scores.themeInterpretation ?? 5,
    movementRepresentation: scores.movementRepresentation ?? 5,

    // Design Principles
    composition: scores.composition ?? 5,
    colorUsage: scores.colorUsage ?? 5,
    visualFocus: scores.visualFocus ?? 5,

    // Additional Considerations
    storytelling: scores.storytelling ?? 5,
    techniqueMastery: scores.techniqueMastery ?? 5,

    comments: scores.comments ?? "",
  };

  // Calculate overall score
  const calculateOverallScore = () => {
    const criteriaCount = 10; // Total number of scoring criteria

    const totalScore =
      fullScores.creativity +
      fullScores.execution +
      fullScores.impact +
      fullScores.themeInterpretation +
      fullScores.movementRepresentation +
      fullScores.composition +
      fullScores.colorUsage +
      fullScores.visualFocus +
      fullScores.storytelling +
      fullScores.techniqueMastery;

    return (totalScore / criteriaCount).toFixed(1);
  };

  // Custom Rating component with tooltip for descriptions
  const CriterionRating = ({ label, criterion, description }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <label className="font-medium">{label}</label>
        <Tooltip content={description}>
          <Info size={16} className="text-neutral-400 cursor-help" />
        </Tooltip>
      </div>
      <Rating
        value={fullScores[criterion]}
        onChange={(value) => onScoreChange(criterion, value)}
        max={10}
        className="w-full"
      />
    </div>
  );

  return (
    <div className="space-y-4 mt-6">
      <Tabs defaultValue="core" variant="pills">
        <TabList className="mb-4">
          <Tab value="core">Core Criteria</Tab>
          <Tab value="thematic">Thematic</Tab>
          <Tab value="design">Design</Tab>
          <Tab value="additional">Additional</Tab>
        </TabList>

        <TabPanels>
          {/* Core Criteria */}
          <TabPanel value="core">
            <CriterionRating
              label="Creativity (0-10)"
              criterion="creativity"
              description="Originality of concept, innovative approach, unique perspective"
            />

            <CriterionRating
              label="Execution (0-10)"
              criterion="execution"
              description="Technical skill, craftsmanship, attention to detail"
            />

            <CriterionRating
              label="Impact (0-10)"
              criterion="impact"
              description="Overall impression, emotional response, memorability"
            />
          </TabPanel>

          {/* Thematic Elements */}
          <TabPanel value="thematic">
            <CriterionRating
              label="Theme Interpretation (0-10)"
              criterion="themeInterpretation"
              description="How effectively the artwork represents or relates to dance"
            />

            <CriterionRating
              label="Movement Representation (0-10)"
              criterion="movementRepresentation"
              description="Success in capturing the energy, rhythm, or flow of dance"
            />
          </TabPanel>

          {/* Design Principles */}
          <TabPanel value="design">
            <CriterionRating
              label="Composition (0-10)"
              criterion="composition"
              description="Arrangement of elements, balance, use of space"
            />

            <CriterionRating
              label="Color Usage (0-10)"
              criterion="colorUsage"
              description="Harmony, contrast, mood created through color choices"
            />

            <CriterionRating
              label="Visual Focus (0-10)"
              criterion="visualFocus"
              description="Clarity of subject matter, effective emphasis on key elements"
            />
          </TabPanel>

          {/* Additional Considerations */}
          <TabPanel value="additional">
            <CriterionRating
              label="Storytelling (0-10)"
              criterion="storytelling"
              description="How well the piece communicates a narrative or feeling"
            />

            <CriterionRating
              label="Technique Mastery (0-10)"
              criterion="techniqueMastery"
              description="Appropriate use of the chosen medium or art technique"
            />

            <div className="mb-6">
              <label className="font-medium block mb-2">Comments</label>
              <TextArea
                placeholder="Optional feedback or notes about this entry..."
                value={fullScores.comments}
                onChange={(e) => onScoreChange("comments", e.target.value)}
                rows={3}
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <div className="mt-6 pt-4 border-t flex justify-between items-center">
        <div className="text-xl font-bold">
          Overall Score: {calculateOverallScore()}/10
        </div>

        <BaseButton
          onClick={onSubmit}
          disabled={isSaving}
          isLoading={isSaving}
          leftIcon={!isSaving ? <Save size={18} /> : undefined}
          variant="success"
        >
          Submit Scores & Next Entry
        </BaseButton>
      </div>

      {saveStatus && (
        <Alert
          variant={saveStatus.type === "success" ? "success" : "error"}
          onClose={() => {}}
          className="mt-4"
        >
          {saveStatus.message}
        </Alert>
      )}
    </div>
  );
};
