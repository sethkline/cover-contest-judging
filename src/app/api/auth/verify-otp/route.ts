// app/api/auth/verify-otp/route.js
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    // Verify the OTP
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      console.error("OTP verification error:", error);
      return NextResponse.json(
        { error: error.message || "Invalid or expired code" },
        { status: 400 },
      );
    }

    // If successful, data will contain session information
    return NextResponse.json({
      success: true,
      session: data.session,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify OTP" },
      { status: 500 },
    );
  }
}
