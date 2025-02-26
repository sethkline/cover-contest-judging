"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Award } from "lucide-react";

interface InstructionCardProps {
  onViewInstructions: () => void;
}

export default function InstructionCard({
  onViewInstructions,
}: InstructionCardProps) {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Award className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-1">
              Need a refresher on judging?
            </h3>
            <p className="text-blue-700 text-sm mb-2">
              You can always revisit the instructions on how to effectively
              evaluate entries.
            </p>
            <button
              onClick={onViewInstructions}
              className="text-sm text-blue-700 hover:text-blue-900 font-medium underline"
            >
              View Judging Instructions
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
