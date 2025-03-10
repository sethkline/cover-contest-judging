// EntryViewerModal.tsx
import { Dialog } from "@headlessui/react";
import { getSupabasePublicUrl } from "@/lib/utils/storage";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/Tabs";
import { useState } from "react";

export default function EntryViewerModal({ isOpen, entry, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!entry) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-bold">
              Entry #{entry.entry_number} - {entry.participant_name}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={getSupabasePublicUrl(
                    "contest-images",
                    entry.front_image_path,
                  )}
                  alt={`Entry ${entry.entry_number} by ${entry.participant_name}`}
                  className="w-full rounded-lg shadow-md"
                />
                {entry.back_image_path && (
                  <img
                    src={getSupabasePublicUrl(
                      "contest-images",
                      entry.back_image_path,
                    )}
                    alt={`Entry ${entry.entry_number} back side`}
                    className="w-full rounded-lg shadow-md mt-4"
                  />
                )}
              </div>

              <div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Entry Details
                    </h3>
                    <table className="min-w-full mt-2">
                      <tbody>
                        <tr>
                          <td className="py-1 text-sm font-medium text-gray-900">
                            Name:
                          </td>
                          <td className="py-1 text-sm text-gray-500">
                            {entry.participant_name}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 text-sm font-medium text-gray-900">
                            Age:
                          </td>
                          <td className="py-1 text-sm text-gray-500">
                            {entry.participant_age}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 text-sm font-medium text-gray-900">
                            Category:
                          </td>
                          <td className="py-1 text-sm text-gray-500">
                            {entry.category}
                          </td>
                        </tr>
                        {entry.artist_statement && (
                          <tr>
                            <td className="py-1 text-sm font-medium text-gray-900">
                              Artist Statement:
                            </td>
                            <td className="py-1 text-sm text-gray-500">
                              {entry.artist_statement}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Tabbed Score Display */}
                  <div className="mt-6">
                    <Tabs
                      defaultValue="overview"
                      variant="underline"
                      onChange={(value) => setActiveTab(value)}
                    >
                      <TabList className="mb-4 border-b border-gray-200">
                        <Tab value="overview">Overview</Tab>
                        <Tab value="detailed">All Scores</Tab>
                        {entry.comments?.length > 0 && (
                          <Tab value="comments">Comments</Tab>
                        )}
                      </TabList>

                      <TabPanels>
                        {/* Overview Tab */}
                        <TabPanel value="overview">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium text-gray-700">
                                Core Scores
                              </h3>
                              <div className="text-sm font-bold text-gray-900">
                                Total: {entry.scores.total}
                              </div>
                            </div>

                            <table className="min-w-full">
                              <tbody>
                                <tr>
                                  <td className="py-1 text-sm font-medium text-gray-900">
                                    Creativity:
                                  </td>
                                  <td className="py-1 text-sm text-gray-500">
                                    {entry.scores.creativity}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-1 text-sm font-medium text-gray-900">
                                    Execution:
                                  </td>
                                  <td className="py-1 text-sm text-gray-500">
                                    {entry.scores.execution}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-1 text-sm font-medium text-gray-900">
                                    Impact:
                                  </td>
                                  <td className="py-1 text-sm text-gray-500">
                                    {entry.scores.impact}
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <div className="mt-4 pt-4 border-t">
                              <p className="text-xs text-gray-500">
                                Judged by {entry.judgeCount}{" "}
                                {entry.judgeCount === 1 ? "judge" : "judges"}
                              </p>
                            </div>
                          </div>
                        </TabPanel>

                        {/* Detailed Scores Tab */}
                        <TabPanel value="detailed">
                          <div className="space-y-4">
                            {/* Core Criteria */}
                            <div>
                              <h3 className="text-sm font-medium text-gray-700 mb-1">
                                Core Criteria
                              </h3>
                              <table className="min-w-full">
                                <tbody>
                                  <tr>
                                    <td className="py-1 text-sm font-medium text-gray-900">
                                      Creativity:
                                    </td>
                                    <td className="py-1 text-sm text-gray-500">
                                      {entry.scores.creativity}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-1 text-sm font-medium text-gray-900">
                                      Execution:
                                    </td>
                                    <td className="py-1 text-sm text-gray-500">
                                      {entry.scores.execution}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-1 text-sm font-medium text-gray-900">
                                      Impact:
                                    </td>
                                    <td className="py-1 text-sm text-gray-500">
                                      {entry.scores.impact}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Thematic Elements */}
                            <div>
                              <h3 className="text-sm font-medium text-gray-700 mb-1">
                                Thematic Elements
                              </h3>
                              <table className="min-w-full">
                                <tbody>
                                  <tr>
                                    <td className="py-1 text-sm font-medium text-gray-900">
                                      Theme Interpretation:
                                    </td>
                                    <td className="py-1 text-sm text-gray-500">
                                      {entry.scores.themeInterpretation ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-1 text-sm font-medium text-gray-900">
                                      Movement:
                                    </td>
                                    <td className="py-1 text-sm text-gray-500">
                                      {entry.scores.movementRepresentation ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Design Principles */}
                            <div>
                              <h3 className="text-sm font-medium text-gray-700 mb-1">
                                Design Principles
                              </h3>
                              <table className="min-w-full">
                                <tbody>
                                  <tr>
                                    <td className="py-1 text-sm font-medium text-gray-900">
                                      Composition:
                                    </td>
                                    <td className="py-1 text-sm text-gray-500">
                                      {entry.scores.composition || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-1 text-sm font-medium text-gray-900">
                                      Color Usage:
                                    </td>
                                    <td className="py-1 text-sm text-gray-500">
                                      {entry.scores.colorUsage || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-1 text-sm font-medium text-gray-900">
                                      Visual Focus:
                                    </td>
                                    <td className="py-1 text-sm text-gray-500">
                                      {entry.scores.visualFocus || "N/A"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Additional Considerations */}
                            <div>
                              <h3 className="text-sm font-medium text-gray-700 mb-1">
                                Additional Considerations
                              </h3>
                              <table className="min-w-full">
                                <tbody>
                                  <tr>
                                    <td className="py-1 text-sm font-medium text-gray-900">
                                      Storytelling:
                                    </td>
                                    <td className="py-1 text-sm text-gray-500">
                                      {entry.scores.storytelling || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-1 text-sm font-medium text-gray-900">
                                      Technique Mastery:
                                    </td>
                                    <td className="py-1 text-sm text-gray-500">
                                      {entry.scores.techniqueMastery || "N/A"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                              <div className="flex justify-between">
                                <span className="text-sm font-bold text-gray-900">
                                  Overall Score:
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {entry.scores.total}/10
                                </span>
                              </div>
                            </div>
                          </div>
                        </TabPanel>

                        {/* Comments Tab */}
                        {entry.comments?.length > 0 && (
                          <TabPanel value="comments">
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium text-gray-700">
                                Judge Comments
                              </h3>

                              {entry.comments.map((comment, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-50 p-3 rounded border"
                                >
                                  <p className="text-sm text-gray-700 whitespace-pre-line">
                                    {comment}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    Judge #{index + 1}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </TabPanel>
                        )}
                      </TabPanels>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
