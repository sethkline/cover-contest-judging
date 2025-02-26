"use client";

import React, { useState, useEffect } from "react";
import { XCircle, CheckCircle } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

interface FormData {
  password: string;
  confirmPassword: string;
}

const JudgeConfirmation = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check for session when component mounts
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        console.log("Session check:", { session, error });

        if (error || !session) {
          throw new Error("Auth session missing!");
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Session error:", error);
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get current session first
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      // Validate password strength
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long");
        setLoading(false);
        return;
      }

      const { data, error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (updateError) throw updateError;

      // Update judge status to 'active' in judges table
      if (data.user) {
        const { error: judgeError } = await supabase
          .from("judges")
          .update({ status: "active" })
          .eq("id", data.user.id);

        if (judgeError) throw judgeError;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">Verifying your session...</div>
      </div>
    );
  }

  // Show success state
  if (success) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <p className="text-green-800">
            Your account has been successfully set up!
          </p>
        </div>
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="p-6">
            <p className="text-center mb-4 text-gray-600">
              You can now sign in to access the judging interface.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rest of your form JSX remains the same
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">
            Set Up Your Judge Account
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-2">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded text-white transition-colors ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Setting up..." : "Complete Setup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JudgeConfirmation;
