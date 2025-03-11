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

    // Create a service role client (this has full permissions)
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
      // Return a generic error for security reasons
      return NextResponse.json(
        { error: "Unable to process request" },
        { status: 404 }
      );
    }

    // Get the full base URL
    const baseURL = process.env.NEXT_PUBLIC_APP_URL;
    
    // Define the redirect URL 
    const redirectTo = `${baseURL}/callback?next=/confirm-judge`;

    console.log(`Generating magic link with redirect to: ${redirectTo}`);
    
    // Generate a magic link instead of recovery link
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        redirectTo,
      },
    });
    
    if (error) {
      console.error("Link generation error:", error);
      throw error;
    }
    
    const inviteUrl = data?.properties?.action_link;
    console.log(`Generated magic link: ${inviteUrl}`);

    
    if (!inviteUrl) {
      throw new Error("Failed to generate invitation link");
    }
    
    // Send the invitation email
    await sendJudgeReinvitation(email, inviteUrl);
    
    // Update judge status to pending if it wasn't already
    if (judgeData.status !== 'pending') {
      await supabase
        .from("judges")
        .update({ status: "pending" })
        .eq("id", judgeData.id);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error requesting invitation:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 400 },
    );
  }
}