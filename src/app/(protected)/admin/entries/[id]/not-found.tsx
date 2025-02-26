// src/app/(protected)/admin/entries/[id]/loading.tsx
// src/app/(protected)/admin/entries/[id]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Entry Not Found</h2>
        <p className="text-gray-600 mb-4">
          The entry you're looking for doesn't exist.
        </p>
        <Link
          href="/admin/entries"
          className="text-blue-600 hover:text-blue-800"
        >
          Return to Entries
        </Link>
      </div>
    </div>
  );
}
