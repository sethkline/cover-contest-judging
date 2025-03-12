import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendPasswordReset } from "@/services/mailService";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create a service role client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Get the base URL and ensure no trailing slash
    const baseURL = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");

    // Generate a password reset link
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: `${baseURL}/auth/callback?next=/update-password`,
      },
    });

    if (error) {
      console.error("Error generating reset link:", error);
      throw error;
    }

    const resetUrl = data?.properties?.action_link;

    if (!resetUrl) {
      throw new Error("Failed to generate reset link");
    }

    // Send custom email with reset link
    await sendPasswordReset(email, resetUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in reset-password:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 },
    );
  }
}
