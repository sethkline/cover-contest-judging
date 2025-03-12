import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    console.log("Verifying OTP for:", email);
    
    // Verify the OTP and create a session
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    });
    
    if (error) {
      console.error("OTP verification error:", error);
      return NextResponse.json(
        { error: error.message || "Invalid or expired code" },
        { status: 400 }
      );
    }
    
    // Log the auth data to help with debugging
    console.log("Auth data:", {
      user: data?.user?.id,
      hasSession: !!data?.session,
      sessionExpires: data?.session?.expires_at
    });
    
    // If we don't have a session, something went wrong
    if (!data?.session) {
      console.error("No session created from OTP verification");
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }
    
    // Set auth cookies for the client
    const cookieStore = cookies();
    
    // Set the session cookie
    cookieStore.set('sb-access-token', data.session.access_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    cookieStore.set('sb-refresh-token', data.session.refresh_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    // If successful, determine redirect based on judge status
    const { data: judgeData, error: judgeError } = await supabase
      .from('judges')
      .select('status')
      .eq('id', data.user.id)
      .single();
      
    if (judgeError) {
      console.error("Error retrieving judge data:", judgeError);
      throw judgeError;
    }
    
    // Determine the redirect URL based on judge status
    const redirectUrl = judgeData.status === 'pending' 
      ? '/confirm-judge' 
      : '/judge/dashboard';
    
    // Return success with redirect information and session
    return NextResponse.json({ 
      success: true,
      redirectUrl,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      }
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}