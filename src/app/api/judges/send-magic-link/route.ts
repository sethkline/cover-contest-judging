// app/api/judges/send-magic-link/route.js
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendMagicLink } from "@/services/mailService"; // Import your mail service function

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email } = await request.json();
    console.log("Received request to send magic link to:", email);
    
    // First check if this email is in the judges table
    const { data: judgeData, error: judgeError } = await supabase
      .from('judges')
      .select('id, email, status')
      .eq('email', email)
      .single();
    
    if (judgeError) {
      console.log("Judge not found:", email);
      return NextResponse.json(
        { error: "Email not found in judges list" },
        { status: 404 }
      );
    }
    
    // Get the base URL based on environment
    const baseURL = process.env.NEXT_PUBLIC_APP_URL || 
      (process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : 'https://cover-contest-judging.vercel.app');
    
    // Determine the redirect based on judge status
    const redirectTarget = judgeData.status === 'pending' 
      ? '/confirm-judge' 
      : '/judge/dashboard';
    
    // GENERATE the magic link (but it doesn't send it automatically)
    const { data, error: magicLinkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        redirectTo: `${baseURL}/callback?next=${redirectTarget}`
      }
    });

    if (magicLinkError) {
      console.error("Error generating magic link:", magicLinkError);
      throw magicLinkError;
    }
    
    // Get the actual magic link URL from the response
    const magicLinkUrl = data?.properties?.action_link;
    
    if (!magicLinkUrl) {
      throw new Error("Failed to generate magic link");
    }
    
    console.log("Generated magic link:", magicLinkUrl);
    
    try {
      await sendMagicLink(email, magicLinkUrl);
      console.log("Magic link email sent successfully to", email);
    } catch (emailError) {
      console.error("Failed to send magic link email:", emailError);
      throw emailError;
    }

    return NextResponse.json({ 
      success: true, 
      message: "Magic link sent successfully"
    });
  } catch (error) {
    console.error("Error sending magic link:", error);
    
    return NextResponse.json(
      { error: error.message || "Failed to send magic link" },
      { status: 500 }
    );
  }
}