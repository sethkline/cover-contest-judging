import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface ContestThemeProps {
  year?: string;
  title?: string;
  verse?: string;
  verseReference?: string;
  description?: string[];
}

export const ContestTheme: React.FC<ContestThemeProps> = ({
  year = "2025 Spring",
  title = "Echoes of Grace: Stories in Motion",
  verse = "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.",
  verseReference = "Ephesians 2:8-9",
  description = [
    "This year's recital celebrates how God's grace echoes throughout our lives, transforming our stories and movements. Students' designs should reflect themes of grace, faith, and transformation.",
    "Judges will evaluate entries on creativity, execution, and how well they capture the spiritual meaning behind this year's theme.",
  ],
}) => {
  return (
    <Card elevation="raised" className="mb-8">
      <CardHeader className="bg-primary-800 text-white">
        <CardTitle>{year} Recital Theme</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="text-2xl font-medium text-primary-600 mb-3 text-center">
          "{title}"
        </h3>

        <div className="mb-6 text-center italic">
          <p className="text-neutral-700">"{verse}"</p>
          <p className="text-neutral-600 mt-1">- {verseReference}</p>
        </div>

        <div className="text-neutral-700">
          {description.map((paragraph, index) => (
            <p
              key={index}
              className={index < description.length - 1 ? "mb-4" : ""}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
