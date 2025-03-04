import React from "react";
import { CardTitle } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

interface EntryHeaderProps {
  entry: any;
  currentIndex: number;
  totalEntries: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const EntryHeader: React.FC<EntryHeaderProps> = ({
  entry,
  currentIndex,
  totalEntries,
  onPrevious,
  onNext,
}) => {
  return (
    <CardTitle className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevious}
          className={`p-2 rounded-full ${
            currentIndex > 0
              ? "hover:bg-neutral-100 text-neutral-700"
              : "text-neutral-300 cursor-not-allowed"
          }`}
          disabled={currentIndex === 0}
          title="Previous Entry (Left Arrow)"
        >
          <ChevronLeft />
        </button>
        <span>Entry #{entry?.entry_number || 0}</span>
        <button
          onClick={onNext}
          className={`p-2 rounded-full ${
            currentIndex < totalEntries - 1
              ? "hover:bg-neutral-100 text-neutral-700"
              : "text-neutral-300 cursor-not-allowed"
          }`}
          disabled={currentIndex === totalEntries - 1}
          title="Next Entry (Right Arrow)"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-500">
          Age: {entry?.participant_age}
        </span>
        {entry?.artist_statement && (
          <div
            className="relative group"
            title="This entry has an artist statement"
          >
            <Info size={16} className="text-primary-500 cursor-help" />
            <div className="absolute right-0 mt-2 p-3 bg-white border rounded-md shadow-lg w-64 hidden group-hover:block z-10">
              <p className="text-sm font-medium mb-1">Artist Statement:</p>
              <p className="text-sm text-neutral-600">
                {entry.artist_statement}
              </p>
            </div>
          </div>
        )}
      </div>
    </CardTitle>
  );
};
