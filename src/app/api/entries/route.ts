// src/app/api/entries/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const formData = await request.formData()
    const frontImage = formData.get('frontImage') as File
    const name = formData.get('name') as string
    const age = formData.get('age') as string

    // Upload image directly to Supabase storage
    const fileName = `${Date.now()}_front.jpg`
    const { data: imageData, error: imageError } = await supabase.storage
      .from('contest-images')
      .upload(fileName, frontImage)

    if (imageError) throw imageError

    // Create entry in database
    const { data: entry, error: entryError } = await supabase
      .from('entries')
      .insert({
        front_image_path: fileName,
        participant_name: name,
        participant_age: parseInt(age),
        // ... other entry data
      })
      .select()
      .single()

    if (entryError) throw entryError

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}