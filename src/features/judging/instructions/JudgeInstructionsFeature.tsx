"use client";

import Link from "next/link";
import { useAuth } from "@/lib/authContext";

export default function JudgeInstructionsPage() {
  const { judgeStatus } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Judge Instructions</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Guidelines for Judging</h2>

        <div className="space-y-4">
          <p>
            Here are the detailed instructions for judges that will be available
            at all times, regardless of whether you are in pending or active
            status.
          </p>

          {/* Add your actual instructions content here */}
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-medium mb-2">Judging Criteria</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Evaluate submissions based on creativity and originality</li>
              <li>Consider technical execution and adherence to rules</li>
              <li>Provide constructive feedback for all entries</li>
              <li>Maintain impartiality throughout the judging process</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-medium mb-2">Scoring System</h3>
            <p>
              Each submission should be scored on a scale of 1-10 for each
              criterion:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>1-3: Below expectations</li>
              <li>4-6: Meets expectations</li>
              <li>7-8: Exceeds expectations</li>
              <li>9-10: Outstanding</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {judgeStatus === "pending" ? (
          <Link
            href="/judge/welcome"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Welcome Page
          </Link>
        ) : (
          <Link
            href="/judge/dashboard"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
