// src/app/(protected)/admin/entries/[id]/loading.tsx
export default function LoadingPage() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
