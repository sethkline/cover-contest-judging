// src/app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contest Judging System</h1>
        
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Link 
            href="/admin" 
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">Admin Portal</h2>
            <p className="text-gray-600">
              Upload entries, manage judges, and view results
            </p>
          </Link>

          <Link 
            href="/judge" 
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">Judge Portal</h2>
            <p className="text-gray-600">
              Access assigned entries and submit scores
            </p>
          </Link>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">About the Contest</h2>
          <p className="text-gray-700 mb-4">
            Welcome to our art contest judging system. We currently have two contests:
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Cover Design Contest (Ages 3-7, 8-11, and 12+)</li>
            <li>Bookmark Design Contest (All ages)</li>
          </ul>
        </div>
      </div>
    </main>
  )
}