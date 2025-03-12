import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendJudgeInvitation } from "@/services/mailService";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Create user with a random password (they'll reset this later)
    const {
      data: { user },
      error: createError,
    } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: false,
      user_metadata: { role: "judge" },
    });

    if (createError) {
      console.error("Create user error:", createError);
      throw createError;
    }

    if (!user) throw new Error("Failed to create user");

    // Create judge record
    const { error: judgeError } = await supabase.from("judges").insert([
      {
        id: user.id,
        email: email,
        status: "pending",
      },
    ]);

    if (judgeError) {
      console.error("Judge record error:", judgeError);
      throw judgeError;
    }

    // Get the full base URL
    const baseURL = process.env.NEXT_PUBLIC_APP_URL;

    // IMPORTANT: Make sure the entire URL is properly formed
    const redirectTo = `${baseURL}/callback?next=/confirm-judge`;

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink", // Change this from "recovery" to "magiclink"
      email: email,
      options: {
        redirectTo,
      },
    });

    if (linkError) {
      console.error("Magic link error:", linkError);
      throw linkError;
    }

    // Get the action link (recovery URL) from the response
    const inviteUrl = linkData?.properties?.action_link;

    if (!inviteUrl) {
      throw new Error("Failed to generate invitation link");
    }

    // Check if the action_link includes our callback path
    if (!inviteUrl.includes("/auth/callback")) {
      console.warn(
        "Warning: The generated action_link doesn't contain the expected callback path",
      );
    }

    // Send custom email with Mailgun
    try {
      await sendJudgeInvitation(email, inviteUrl);
    } catch (emailError) {
      throw emailError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in invite-judge:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 },
    );
  }
}
