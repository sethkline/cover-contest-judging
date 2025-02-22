// src/app/(protected)/admin/judges/page.tsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'

export default function JudgesPage() {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [judges, setJudges] = useState<any[]>([])

  useEffect(() => {
    fetchJudges()
  }, [])

  const fetchJudges = async () => {
    try {
      setLoading(true)
      setError(null)

      // First get the current user to verify admin status
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      if (user?.user_metadata?.role !== 'admin') {
        throw new Error('Not authorized')
      }

      // Then fetch judges
      const { data, error } = await supabase
        .from('judges')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setJudges(data || [])

    } catch (error) {
      console.error('Error fetching judges:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch judges')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Judges</h1>
      
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {judges.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No judges found
                  </td>
                </tr>
              ) : (
                judges.map((judge) => (
                  <tr key={judge.id}>
                    <td className="px-6 py-4">{judge.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        judge.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {judge.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(judge.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}