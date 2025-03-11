import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { sendJudgeReinvitation } from "@/services/mailService";

export async function POST(request: Request) {
  try {
    // 1. Check if the current user is an admin
    const cookieStore = cookies();
    const authClient = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const {
      data: { session },
    } = await authClient.auth.getSession();
    
    // If no session, this could be the judge requesting their own reinvitation
    // In that case, we don't need admin privileges but still need to verify the email
    const isPublicRequest = !session;
    
    if (session) {
      // Get admin status from user metadata
      const isAdmin = session.user.user_metadata?.role === "admin";
      
      if (!isAdmin) {
        return NextResponse.json(
          { error: "Not authorized" },
          { status: 403 }
        );
      }
    }
    
    // 2. Get the email from the request body
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 3. Create a service role client for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // 4. Verify this email is in the judges table
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

    // 5. Get the full base URL
    const baseURL = process.env.NEXT_PUBLIC_APP_URL;
    
    // 6. Define the redirect URL
    const redirectTo = `${baseURL}/callback?next=/confirm-judge`;
    
    // 7. Generate password reset token (for initial setup)
    const { data: resetData, error: resetError } =
      await supabase.auth.admin.generateLink({
        type: "recovery",
        email: email,
        options: {
          redirectTo,
        },
      });
    
    if (resetError) {
      console.error("Reset token error:", resetError);
      throw resetError;
    }
    
    // 8. Get the action link from the response
    const inviteUrl = resetData?.properties?.action_link;
    
    if (!inviteUrl) {
      throw new Error("Failed to generate invitation link");
    }
    
    // 9. Send custom email with the invitation link using the reinvitation template
    try {
      await sendJudgeReinvitation(email, inviteUrl);
    } catch (emailError) {
      throw emailError;
    }
    
    // 10. Update judge status to pending if it wasn't already
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