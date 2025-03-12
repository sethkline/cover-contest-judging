// app/api/auth/generate-otp/route.js
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/services/mailService";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(request) {
  try {
    const { email } = await request.json();

    // First check if this email is in the judges table
    const { data: judgeData, error: judgeError } = await supabase
      .from("judges")
      .select("id, email, status")
      .eq("email", email)
      .single();

    if (judgeError) {
      return NextResponse.json(
        { error: "Email not found in judges list" },
        { status: 404 },
      );
    }

    // Generate OTP using Supabase's built-in function
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      // We don't need a redirect for OTP
    });

    if (error) {
      console.error("Error generating OTP:", error);
      throw error;
    }

    // Extract the OTP from the response
    const emailOtp = data?.properties?.email_otp;

    if (!emailOtp) {
      throw new Error("Failed to generate OTP");
    }

    console.log("Generated OTP:", emailOtp);

    // Send email with OTP
    await sendOtpEmail(email, emailOtp);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate OTP" },
      { status: 500 },
    );
  }
}
