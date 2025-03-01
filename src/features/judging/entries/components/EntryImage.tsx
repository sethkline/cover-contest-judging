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
  getImageUrl
}) => {
  return (
    <div className="relative">
      {/* Image Container */}
      <div
        className={`relative transition-transform duration-200 ${
          isZoomed
            ? "cursor-zoom-out scale-150 origin-top"
            : "cursor-zoom-in"
        }`}
        onClick={onZoomToggle}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-100 animate-pulse flex items-center justify-center">
            <div className="text-neutral-400">Loading...</div>
          </div>
        )}

        {/* Use the actual entry image paths */}
        <img
          src={
            showBackImage && entry?.back_image_path
              ? getImageUrl(entry.back_image_path)
              : entry?.front_image_path
                ? getImageUrl(entry.front_image_path)
                : "/api/placeholder/400/613"
          }
          alt={`Contest Entry ${entry?.entry_number}`}
          className={`w-full rounded-lg shadow-lg mb-4 ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          style={{ aspectRatio: "400/613" }}
          loading="lazy"
        />

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