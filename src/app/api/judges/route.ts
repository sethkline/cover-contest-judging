// src/app/api/invite-judge/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { email } = await request.json()

    // Create judge in database
    const { data: judge, error: judgeError } = await supabase
      .from('judges')
      .insert({ email })
      .select()
      .single()

    if (judgeError) throw judgeError

    // Send invite using Supabase Auth
    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/judge/setup`
    })

    if (inviteError) throw inviteError

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}