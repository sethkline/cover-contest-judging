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

    // Generate password reset token (for initial setup)
    const { data: resetData, error: resetError } =
      await supabase.auth.admin.generateLink({
        type: "recovery",
        email: email,
        options: {
          redirectTo: new URL(
            "/judge/setup",
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          ).toString(),
        },
      });

    if (resetError) {
      console.error("Reset token error:", resetError);
      throw resetError;
    }

    // Get the action link (recovery URL) from the response
    const inviteUrl = resetData?.properties?.action_link;

    if (!inviteUrl) {
      throw new Error("Failed to generate invitation link");
    }

    // Send custom email with Mailgun
    await sendJudgeInvitation(email, inviteUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in invite-judge:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 },
    );
  }
}
