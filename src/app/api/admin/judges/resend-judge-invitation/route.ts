import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendJudgeReinvitation } from "@/services/mailService";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Create a service role client for admin operations - this has full permissions
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Verify this email is in the judges table
    const { data: judgeData, error: judgeError } = await supabase
      .from("judges")
      .select("id, email, status")
      .eq("email", email)
      .single();
    
    if (judgeError) {
      return NextResponse.json(
        { error: "This email is not registered as a judge" },
        { status: 404 }
      );
    }

    // Get the full base URL
    const baseURL = process.env.NEXT_PUBLIC_APP_URL;
    
    // Define the redirect URL
    const redirectTo = `${baseURL}/callback?next=/confirm-judge`;
    
    // Try the magicLink approach instead of recovery for public requests
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink", // Try this instead of "recovery"
      email: email,
      options: {
        redirectTo,
      },
    });
    
    if (error) {
      console.error("Link generation error:", error);
      throw error;
    }
    
    // Get the action link from the response
    const inviteUrl = data?.properties?.action_link;
    
    if (!inviteUrl) {
      throw new Error("Failed to generate invitation link");
    }
    
    // Send custom email with the invitation link
    try {
      await sendJudgeReinvitation(email, inviteUrl);
    } catch (emailError) {
      throw emailError;
    }
    
    // Update judge status to pending if it wasn't already
    if (judgeData.status !== 'pending') {
      await supabase
        .from("judges")
        .update({ status: "pending" })
        .eq("id", judgeData.id);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in resend-judge-invitation:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 },
    );
  }
}