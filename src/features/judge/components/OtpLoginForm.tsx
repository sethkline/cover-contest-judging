// components/OtpLoginForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function OtpLoginForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Email entry, 2: OTP entry
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send access code");
      }

      // Move to step 2 (OTP entry)
      setStep(2);
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the Supabase verify OTP endpoint
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (verifyError) throw verifyError;

      if (data?.session) {
        // Check if user is a judge
        const { data: judgeData, error: judgeError } = await supabase
          .from("judges")
          .select("status")
          .eq("id", data.user.id)
          .single();

        if (judgeError || !judgeData) {
          throw new Error("Access denied. You are not registered as a judge.");
        }

        // Redirect based on judge status
        if (judgeData.status === "pending") {
          router.push("/judge/welcome");
        } else {
          router.push("/judge/dashboard");
        }
      } else {
        throw new Error("Failed to sign in");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(error.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp("");
    setError(null);
  };

  // Step 1: Email form
  if (step === 1) {
    return (
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Judge Sign In</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:bg-primary-400"
          >
            {loading ? "Sending..." : "Send Access Code"}
          </button>
        </form>
      </div>
    );
  }

  // Step 2: OTP form
  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Enter Access Code</h2>

      <p className="mb-4 text-neutral-600">
        We've sent a 6-digit access code to {email}. Please check your email and
        enter the code below.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Access Code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
            maxLength={6}
            className="w-full p-2 border rounded text-center text-lg tracking-widest"
            placeholder="000000"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 bg-neutral-200 text-neutral-800 py-2 px-4 rounded-md hover:bg-neutral-300 transition-colors"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:bg-primary-400"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleRequestOtp}
          disabled={loading}
          className="text-primary-600 hover:underline text-sm"
        >
          Didn't receive a code? Send again
        </button>
      </div>
    </div>
  );
}
