// src/app/(protected)/admin/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies });

  // Fetch summary data
  const [entriesCount, judgesCount, contestsData] = await Promise.all([
    supabase.from("entries").select("*", { count: "exact", head: true }),
    supabase.from("judges").select("*", { count: "exact", head: true }),
    supabase.from("contests").select("*").eq("is_active", true),
  ]);

  // Get a count of active contests
  const activeContests = contestsData.data?.length || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Entries</h2>
          <p className="text-3xl font-bold text-blue-600">
            {entriesCount.count}
          </p>
          <Link
            href="/admin/entries"
            className="text-blue-600 hover:underline mt-2 block"
          >
            Manage Entries →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Judges</h2>
          <p className="text-3xl font-bold text-blue-600">
            {judgesCount.count}
          </p>
          <Link
            href="/admin/judges"
            className="text-blue-600 hover:underline mt-2 block"
          >
            Manage Judges →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <p className="text-3xl font-bold text-purple-600">{activeContests}</p>
          <Link
            href="/admin/results"
            className="text-purple-600 hover:underline mt-2 block"
          >
            View Results →
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/admin/entries/new"
              className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
            >
              Add New Entry
            </Link>
            <Link
              href="/admin/judges/invite"
              className="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
            >
              Invite Judge
            </Link>
            <Link
              href="/admin/results"
              className="block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-center md:col-span-2"
            >
              View Contest Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
