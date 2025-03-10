import React from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

interface EntryImageProps {
  entry: any;
  isLoading: boolean;
  isZoomed: boolean;
  showBackImage: boolean;
  onZoomToggle: () => void;
  onViewToggle: () => void;
  getImageUrl: (path: string) => string;
}

export const EntryImage: React.FC<EntryImageProps> = ({
  entry,
  isLoading,
  isZoomed,
  showBackImage,
  onZoomToggle,
  onViewToggle,
  getImageUrl,
}) => {
  // Get current image path
  const currentImagePath =
    showBackImage && entry?.back_image_path
      ? entry.back_image_path
      : entry?.front_image_path
        ? entry.front_image_path
        : "/api/placeholder/400/613";

  // Determine if we're showing the front or back image
  const isShowingFrontImage = !(showBackImage && entry?.back_image_path);

  return (
    <div className="relative">
      {/* Image Container */}
      <div
        className={`relative transition-transform duration-200 ${
          isZoomed ? "cursor-zoom-out scale-150 origin-top" : "cursor-zoom-in"
        }`}
        onClick={onZoomToggle}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-100 animate-pulse flex items-center justify-center">
            <div className="text-neutral-400">Loading...</div>
          </div>
        )}

        {/* Conditionally apply styling based on front/back image */}
        {isShowingFrontImage ? (
          // Front image - maintain fixed aspect ratio of 400/613
          <img
            src={getImageUrl(currentImagePath)}
            alt={`Contest Entry ${entry?.entry_number}`}
            className={`w-full rounded-lg shadow-lg mb-4 ${
              isLoading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
            style={{ aspectRatio: "400/613" }}
            loading="lazy"
          />
        ) : (
          // Back image - preserve natural aspect ratio
          <div className="max-h-[613px] overflow-hidden flex justify-center">
            <img
              src={getImageUrl(currentImagePath)}
              alt={`Contest Entry ${entry?.entry_number} (Back)`}
              className={`rounded-lg shadow-lg mb-4 ${
                isLoading ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300 max-h-[613px] max-w-full object-contain`}
              loading="lazy"
            />
          </div>
        )}

        {/* Zoom indicator */}
        <button
          className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onZoomToggle();
          }}
          title={isZoomed ? "Zoom Out (Esc)" : "Zoom In"}
        >
          {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
        </button>
      </div>

      {/* Back/Front toggle - only show if there's a back image */}
      {entry?.back_image_path && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewToggle();
          }}
          className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full shadow-md hover:bg-white"
        >
          {showBackImage ? "Show Front" : "Show Back"}
        </button>
      )}
    </div>
  );
};
