"use client";

import Link from "next/link";
import { Entry, Contest } from "@/types"; // You'll want to create these types

type EntryDetailViewProps = {
  entry: Entry & { contests: Contest };
  frontImageUrl: string;
  backImageUrl: string | null;
};

export default function EntryDetailView({ 
  entry, 
  frontImageUrl, 
  backImageUrl 
}: EntryDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Entry Details</h1>
        <Link
          href="/admin/entries"
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Back to Entries
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Entry Information</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Entry Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {entry.entry_number}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contest</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {entry.contests.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Participant Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {entry.participant_name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Age</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {entry.participant_age}
                  </dd>
                </div>
                {entry.age_category_id && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Age Category
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {entry.age_category_id}
                    </dd>
                  </div>
                )}
                {entry.artist_statement && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Artist Statement
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {entry.artist_statement}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Submitted
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Images</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Front Image
                  </p>
                  <img
                    src={frontImageUrl}
                    alt="Front of entry"
                    className="max-w-full h-auto rounded-lg shadow"
                  />
                </div>
                {entry.back_image_path && backImageUrl && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Back Image
                    </p>
                    <img
                      src={backImageUrl}
                      alt="Back of entry"
                      className="max-w-full h-auto rounded-lg shadow"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}