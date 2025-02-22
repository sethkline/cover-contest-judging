// src/app/api/admin/users/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ 
    cookies,
    options: {
      db: {
        schema: 'auth'
      }
    }
  })

  try {
    // First verify the user is an admin
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    if (user?.user_metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // Use regular query to get users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, created_at, raw_user_meta_data')

    if (error) throw error

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}