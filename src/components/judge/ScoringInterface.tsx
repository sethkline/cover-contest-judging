import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

const ScoringInterface = () => {
  const [selectedCategory, setSelectedCategory] = useState("3-7");
  const [showBackImage, setShowBackImage] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEntry, setCurrentEntry] = useState(127);

  const ageCategories = [
    { id: "3-7", label: "Ages 3-7" },
    { id: "8-11", label: "Ages 8-11" },
    { id: "12+", label: "Ages 12+" },
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        setCurrentEntry((prev) => prev - 1);
      } else if (e.key === "ArrowRight") {
        setCurrentEntry((prev) => prev + 1);
      } else if (e.key === "Escape") {
        setIsZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Simulate image loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [currentEntry, showBackImage]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Contest Type Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Cover Contest</h1>
        <div className="flex gap-4 mb-4">
          {ageCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entry Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentEntry((prev) => prev - 1)}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Previous Entry (Left Arrow)"
              >
                <ChevronLeft />
              </button>
              <span>Entry #{currentEntry}</span>
              <button
                onClick={() => setCurrentEntry((prev) => prev + 1)}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Next Entry (Right Arrow)"
              >
                <ChevronRight />
              </button>
            </div>
            <span className="text-sm text-gray-500">
              Category: {selectedCategory}
            </span>
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
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400">Loading...</div>
                </div>
              )}
              <img
                src="/api/placeholder/400/613"
                alt={`Contest Entry ${currentEntry}`}
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

            {/* Back/Front toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBackImage(!showBackImage);
              }}
              className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full shadow-md hover:bg-white"
            >
              {showBackImage ? "Show Front" : "Show Back"}
            </button>
          </div>

          {/* Scoring Section - Only visible when not zoomed */}
          <div
            className={`space-y-4 mt-6 transition-opacity duration-200 ${isZoomed ? "opacity-0" : "opacity-100"}`}
          >
            {["Creativity", "Execution", "Impact"].map((criterion) => (
              <div key={criterion} className="space-y-2">
                <label className="block font-medium">{criterion}</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  className="w-full"
                  onChange={(e) =>
                    console.log(`${criterion}: ${e.target.value}`)
                  }
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-4 border-t">
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Submit Scores & Next Entry
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="text-center text-gray-600">
        <div>Entries Judged: 12 / 30 in current category</div>
        <div className="text-sm mt-2">
          Use arrow keys to navigate • Click image or press Esc to zoom
        </div>
      </div>
    </div>
  );
};

export default ScoringInterface;
