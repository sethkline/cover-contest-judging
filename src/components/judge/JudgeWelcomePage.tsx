"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/lib/authContext";
import Link from "next/link";

// Icon components
const ArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Star = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-yellow-500"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Check = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-green-600 mt-1 flex-shrink-0"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Zap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-yellow-500"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ThemeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-purple-600"
  >
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
  </svg>
);

const JudgeWelcome = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleBeginJudging = async () => {
    try {
      setIsUpdating(true);
      setUpdateStatus(null);

      if (!user) {
        throw new Error("User not found");
      }

      // Update judge status to active
      const { error } = await supabase
        .from("judges")
        .update({ status: "active" })
        .eq("id", user.id)
        .select();

      if (error) {
        throw new Error(`Failed to update judge status: ${error.message}`);
      }

      setUpdateStatus({
        success: true,
        message: "Status updated successfully! Redirecting to dashboard...",
      });

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        router.push("/judge/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error updating judge status:", error);
      setUpdateStatus({
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to the Judging Panel
        </h1>
        <p className="text-gray-600">
          Thank you for volunteering as a judge. Here's how the process works.
        </p>
      </div>

      {updateStatus && (
        <div
          className={`mb-6 p-4 rounded-md ${
            updateStatus.success
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {updateStatus.message}
        </div>
      )}

      {/* Theme Card */}
      <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThemeIcon /> 2025 Spring Recital Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-purple-800">
                "Echoes of Grace: Stories in Motion"
              </h3>
              <p className="italic mt-2 text-gray-700">
                "For it is by grace you have been saved, through faith—and this
                is not from yourselves, it is the gift of God—not by works, so
                that no one can boast."
              </p>
              <p className="text-sm text-gray-600 mt-1">- Ephesians 2:8-9</p>
            </div>

            <p className="text-gray-700">
              This year's recital celebrates how God's grace echoes throughout
              our lives, transforming our stories and movements. Students'
              designs should reflect themes of grace, faith, and transformation.
            </p>

            <p className="text-gray-700">
              When judging entries, please consider how well they capture the
              spiritual meaning behind this year's theme, telling a story
              through motion.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star /> Judging Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Scoring Criteria</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Core Criteria */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Core Criteria</h4>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">Creativity (0-10):</span>{" "}
                    Originality of concept, imagination, and innovative
                    approaches
                  </li>
                  <li>
                    <span className="font-medium">Execution (0-10):</span>{" "}
                    Technical skill, attention to detail, craftsmanship
                  </li>
                  <li>
                    <span className="font-medium">Impact (0-10):</span> Overall
                    impression, emotional response, memorability
                  </li>
                </ul>
              </div>

              {/* Thematic Elements */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Thematic Elements</h4>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">
                      Theme Interpretation (0-10):
                    </span>{" "}
                    How effectively the artwork tells a story through motion
                  </li>
                  <li>
                    <span className="font-medium">
                      Movement Representation (0-10):
                    </span>{" "}
                    Success in capturing energy, rhythm, or flow
                  </li>
                </ul>
              </div>

              {/* Design Principles */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Design Principles</h4>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">Composition (0-10):</span>{" "}
                    Arrangement of elements, balance, use of space
                  </li>
                  <li>
                    <span className="font-medium">Color Usage (0-10):</span>{" "}
                    Harmony, contrast, mood created through color
                  </li>
                  <li>
                    <span className="font-medium">Visual Focus (0-10):</span>{" "}
                    Clarity of subject matter, emphasis on key elements
                  </li>
                </ul>
              </div>

              {/* Additional Considerations */}
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Additional Considerations</h4>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">Storytelling (0-10):</span>{" "}
                    How well the piece communicates a narrative
                  </li>
                  <li>
                    <span className="font-medium">
                      Technique Mastery (0-10):
                    </span>{" "}
                    Appropriate use of chosen medium
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-2">
              <p>
                For a detailed explanation of each criterion, please visit the{" "}
                <Link
                  href="/judge/instructions"
                  className="text-primary-600 hover:underline"
                >
                  Judging Instructions
                </Link>{" "}
                page.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3">Judging Process</h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="bg-primary-100 rounded-full p-2 text-primary-700 mt-1">
                  1
                </div>
                <div>
                  <p>
                    <strong>Select a category</strong> to begin judging entries
                    from that age group.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-primary-100 rounded-full p-2 text-primary-700 mt-1">
                  2
                </div>
                <div>
                  <p>
                    <strong>View each entry</strong> - you can click on images
                    to zoom in, and toggle between front and back views when
                    available.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-primary-100 rounded-full p-2 text-primary-700 mt-1">
                  3
                </div>
                <div>
                  <p>
                    <strong>Score each entry</strong> on all criteria using the
                    sliders (0-10), organized in tabs.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-primary-100 rounded-full p-2 text-primary-700 mt-1">
                  4
                </div>
                <div>
                  <p>
                    <strong>Submit your scores</strong> to move to the next
                    entry. You can use keyboard arrows for navigation.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="flex items-center gap-2 text-lg font-medium mb-2">
              <Zap /> Tips for Fair Judging
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check />
                <p className="text-sm">
                  Consider each entry independently rather than comparing
                  directly to others.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <Check />
                <p className="text-sm">
                  Take into account the age category when evaluating technical
                  skill.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <Check />
                <p className="text-sm">
                  Look for how the artwork tells a story through motion,
                  reflecting this year's theme.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <Check />
                <p className="text-sm">
                  Use the full range of scores (0-10) to distinguish between
                  entries.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <Check />
                <p className="text-sm">
                  Take breaks if needed to ensure fair evaluation of all
                  entries.
                </p>
              </li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleBeginJudging}
              disabled={isUpdating}
              className={`bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 mx-auto ${
                isUpdating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isUpdating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  Begin Judging <ArrowRight />
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JudgeWelcome;
