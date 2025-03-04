import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { ScoringForm } from "./ScoringForm";
import { BaseButton } from "@/components/ui/BaseButton";

interface EntryDetailsProps {
  entry?: {
    id: number;
    entryNumber: string;
    participant: string;
    age: number;
    ageCategory: string;
    frontImageUrl: string;
    backImageUrl?: string;
    artistStatement?: string;
  };
  onBack?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const EntryDetails: React.FC<EntryDetailsProps> = ({
  entry,
  onBack,
  onNext,
  onPrevious,
}) => {
  const [showBackImage, setShowBackImage] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showScoringForm, setShowScoringForm] = useState(false);

  if (!entry) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>No entry selected. Please select an entry to view.</p>
          {onBack && (
            <BaseButton className="mt-4" onClick={onBack}>
              Back to Entries
            </BaseButton>
          )}
        </CardContent>
      </Card>
    );
  }

  // Simulate image loading
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [entry, showBackImage]);

  const handleScoreSave = (scores: any) => {
    console.log("Scores saved:", scores);
    setShowScoringForm(false);
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  className="p-2 hover:bg-neutral-100 rounded-full"
                  title="Previous Entry (Left Arrow)"
                >
                  <ChevronLeft />
                </button>
              )}
              <span>Entry #{entry.entryNumber}</span>
              {onNext && (
                <button
                  onClick={onNext}
                  className="p-2 hover:bg-neutral-100 rounded-full"
                  title="Next Entry (Right Arrow)"
                >
                  <ChevronRight />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">
                {entry.participant}, {entry.age} years
              </span>
              <span className="text-sm font-medium bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                {entry.ageCategory}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Image Container */}
            <div
              className={`relative transition-transform duration-200 ${
                isZoomed
                  ? "cursor-zoom-out scale-150 origin-top"
                  : "cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {isLoading && (
                <div className="absolute inset-0 bg-neutral-100 animate-pulse flex items-center justify-center">
                  <div className="text-neutral-400">Loading...</div>
                </div>
              )}
              <img
                src={
                  showBackImage && entry.backImageUrl
                    ? entry.backImageUrl
                    : entry.frontImageUrl
                }
                alt={`Contest Entry ${entry.entryNumber}`}
                className={`w-full rounded-lg shadow-lg mb-4 ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
                style={{ aspectRatio: "400/613" }}
                loading="lazy"
              />
              {/* Zoom indicator */}
              <button
                className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                title={isZoomed ? "Zoom Out (Esc)" : "Zoom In"}
              >
                {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </button>
            </div>

            {/* Back/Front toggle - only if there's a back image */}
            {entry.backImageUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBackImage(!showBackImage);
                }}
                className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full shadow-md hover:bg-white"
              >
                {showBackImage ? "Show Front" : "Show Back"}
              </button>
            )}
          </div>

          {/* Artist Statement - if available */}
          {entry.artistStatement && !isZoomed && (
            <div className="mt-4 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
              <h3 className="font-medium mb-2">Artist Statement</h3>
              <p className="text-neutral-700">{entry.artistStatement}</p>
            </div>
          )}

          {/* Action buttons - only shown when not zoomed */}
          <div
            className={`mt-6 flex justify-between transition-opacity duration-200 ${isZoomed ? "opacity-0" : "opacity-100"}`}
          >
            <BaseButton variant="outline" onClick={onBack}>
              Back to Entries
            </BaseButton>

            <BaseButton onClick={() => setShowScoringForm(true)}>
              Score This Entry
            </BaseButton>
          </div>
        </CardContent>
      </Card>

      {showScoringForm && (
        <ScoringForm
          entryId={entry.id}
          entryNumber={entry.entryNumber}
          onSubmit={handleScoreSave}
          onCancel={() => setShowScoringForm(false)}
        />
      )}
    </div>
  );
};
