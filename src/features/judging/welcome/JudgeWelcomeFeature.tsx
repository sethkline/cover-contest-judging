"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";

export default function JudgeWelcomePage() {
  const { updateJudgeStatus } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleActivate = async () => {
    setIsSubmitting(true);
    try {
      // Assuming updateJudgeStatus is an async function that updates the judge status
      await updateJudgeStatus("active");
      router.push("/judge/dashboard");
    } catch (error) {
      console.error("Error activating judge account:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, Judge!</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <p className="mb-4">
          Thank you for agreeing to serve as a judge for our event. Before you
          begin, please take a moment to familiarize yourself with the judging
          process and criteria.
        </p>

        <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-6">
          <h3 className="font-medium text-blue-700 mb-2">
            Important Information
          </h3>
          <p className="text-blue-700">
            Once you activate your account, you will have access to all
            submissions and judging tools. Make sure you've reviewed all
            guidelines before proceeding.
          </p>
        </div>

        <Link
          href="/judge/instructions"
          className="text-blue-600 hover:underline block mb-6"
        >
          View Detailed Judging Instructions →
        </Link>

        <button
          onClick={handleActivate}
          disabled={isSubmitting}
          className={`w-full py-2 rounded font-medium ${
            isSubmitting
              ? "bg-gray-400 text-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } transition`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Activate Judge Account"
          )}
        </button>
      </div>
    </div>
  );
}
