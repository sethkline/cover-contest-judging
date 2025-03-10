import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendJudgeInvitation } from '@/services/mailService';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    console.log('Starting invite process for:', email);

    // Create user with a random password (they'll reset this later)
    const {
      data: { user },
      error: createError
    } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: false,
      user_metadata: { role: 'judge' }
    });

    if (createError) {
      console.error('Create user error:', createError);
      throw createError;
    }

    console.log('User created successfully:', user?.id);

    if (!user) throw new Error('Failed to create user');

    // Create judge record
    const { error: judgeError } = await supabase.from('judges').insert([
      {
        id: user.id,
        email: email,
        status: 'pending'
      }
    ]);

    if (judgeError) {
      console.error('Judge record error:', judgeError);
      throw judgeError;
    }

    const getBaseURL = () => {
      // Check if we're in development mode
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      // Use localhost in development mode, else use the production URL
      let url = isDevelopment 
        ? 'http://localhost:3000' 
        : (process.env.NEXT_PUBLIC_APP_URL || 'https://cover-contest-judging.vercel.app');
      
      // Make sure the URL has a protocol
      url = url.startsWith('http') ? url : `https://${url}`;
      // Ensure there's no trailing slash
      url = url.endsWith('/') ? url.slice(0, -1) : url;
      
      console.log(`Using base URL: ${url} (${isDevelopment ? 'development' : 'production'} mode)`);
      return url;
    };

    // Get the full base URL
    const baseURL = getBaseURL();

    // IMPORTANT: Make sure the entire URL is properly formed
    const redirectTo = `${baseURL}/auth/callback?next=/confirm-judge`;

    // URL encode the redirect URL to ensure it's properly passed in the query
    // Commenting this out as Supabase likely does this internally
    // const encodedRedirectTo = encodeURIComponent(redirectTo);

    console.log('Full redirect URL:', redirectTo);

    // Generate password reset token (for initial setup)
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo
      }
    });

    if (resetError) {
      console.error('Reset token error:', resetError);
      throw resetError;
    }

    console.log('Recovery link generated successfully');
    console.log('Reset data properties:', resetData?.properties);

    // Get the action link (recovery URL) from the response
    const inviteUrl = resetData?.properties?.action_link;

    if (!inviteUrl) {
      throw new Error('Failed to generate invitation link');
    }

    console.log('Generated invite URL:', inviteUrl);

    // Check if the action_link includes our callback path
    if (!inviteUrl.includes('/auth/callback')) {
      console.warn("Warning: The generated action_link doesn't contain the expected callback path");
    }

    // Send custom email with Mailgun
    console.log('About to send custom email invitation');
    try {
      await sendJudgeInvitation(email, inviteUrl);
      console.log('Custom email sent successfully to:', email);
    } catch (emailError) {
      console.error('Failed to send custom email:', emailError);
      throw emailError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in invite-judge:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An error occurred' }, { status: 400 });
  }
}
