import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Create user first
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

    // Send magic link
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: new URL("/callback", request.url).toString(),
        data: { role: "judge" },
      },
    });

    if (otpError) {
      console.error("OTP error:", otpError);
      throw otpError;
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
