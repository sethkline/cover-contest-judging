import React from "react";

interface ProgressIndicatorProps {
  currentIndex: number;
  totalEntries: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentIndex,
  totalEntries,
}) => {
  return (
    <div className="text-center text-neutral-600">
      <div>
        Entry {currentIndex + 1} of {totalEntries} in current category
      </div>
      <div className="text-sm mt-2">
        Use arrow keys to navigate • Click image or press Esc to zoom
      </div>
    </div>
  );
};
