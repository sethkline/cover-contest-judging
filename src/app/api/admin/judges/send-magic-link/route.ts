import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendMagicLink } from '@/services/mailService'; // Import your email service

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();
    console.log('Received request to send magic link to:', email);

    // First check if this email is in the judges table
    const { data: judgeData, error: judgeError } = await supabase
      .from('judges')
      .select('id, email, status')
      .eq('email', email)
      .single();

    if (judgeError) {
      console.log('Judge not found:', email);
      return NextResponse.json({ error: 'Email not found in judges list' }, { status: 404 });
    }

    console.log('Found judge:', judgeData);

    // Get the base URL based on environment
    const baseURL = 
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://cover-contest-judging.vercel.app');

    // Remove trailing slashes if any
    const cleanBaseUrl = baseURL.replace(/\/$/, '');
    console.log('Using base URL:', cleanBaseUrl);

    // Determine the redirect based on judge status
    const redirectTarget = judgeData.status === 'pending' ? '/confirm-judge' : '/judge/dashboard';
    console.log('Redirect target:', redirectTarget);

    // Generate the magic link
    const { data, error: magicLinkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${cleanBaseUrl}/callback?next=${redirectTarget}`
      }
    });

    if (magicLinkError) {
      console.error('Error generating magic link:', magicLinkError);
      throw magicLinkError;
    }

    const magicLink = data?.properties?.action_link;
    console.log('Generated magic link:', magicLink);

    if (!magicLink) {
      throw new Error('Failed to generate magic link');
    }

    try {
      await sendMagicLink(email, magicLink);
      console.log('Email sent successfully to:', email);
    } catch (emailError) {
      console.error('Failed to send magic link email:', emailError);
      throw emailError;
    }

    return NextResponse.json({
      success: true,
      message: 'Magic link sent successfully'
    });
  } catch (error) {
    console.error('Error sending magic link:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}