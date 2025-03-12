"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { BaseButton } from "@/components/ui/BaseButton";
import { Input } from "@/components/ui/Input";
import { AlertCircle, Mail } from "lucide-react";

// This component will use the search params
function JudgeInvitationErrorContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const supabase = createClientComponentClient();

  // Get error from URL parameters
  const error =
    searchParams.get("error") || "Invalid or expired invitation link";

  const handleResendInvitation = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      // First check if this email is in the judges table
      const { data: judgeData, error: judgeError } = await supabase
        .from("judges")
        .select("id, email, status")
        .eq("email", email)
        .single();

      if (judgeError) {
        // If error is not found, the email isn't registered as a judge
        setErrorMessage(
          "This email is not registered as a judge. Please contact the administrator.",
        );
        setLoading(false);
        return;
      }

      if (judgeData && judgeData.status === "active") {
        // Judge is already active, so just send a magic link
        const { error: signInError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/callback?next=/judge/dashboard`,
          },
        });

        if (signInError) throw signInError;

        setMessage("Login link sent! Please check your email.");
      } else {
        // Call our API endpoint to resend the invitation
        const response = await fetch("/api/resend-judge-invitation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to resend invitation");
        }

        setMessage(
          "A new invitation has been sent to your email. Please check your inbox.",
        );
      }
    } catch (error) {
      console.error("Error resending invitation:", error);
      setErrorMessage(
        "Failed to resend invitation. Please try again or contact support.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-error-500" />
          Judge Invitation Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-error-600 bg-error-50 p-3 rounded-md text-sm">
          {error}
        </div>

        <p className="text-neutral-600">
          Your judge invitation link appears to be invalid or has expired.
          Please enter your email below to request a new invitation.
        </p>

        <form onSubmit={handleResendInvitation} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {message && (
            <div className="bg-success-50 text-success-700 p-3 rounded-md text-sm">
              {message}
            </div>
          )}

          {errorMessage && (
            <div className="bg-error-50 text-error-700 p-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-3">
          <BaseButton
            type="button"
            variant="outline"
            onClick={() => (window.location.href = "/login")}
            className="flex-1"
          >
            Go to Login
          </BaseButton>
          <BaseButton
            type="submit"
            onClick={handleResendInvitation}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                <Mail size={16} />
                Resend Invitation
              </>
            )}
          </BaseButton>
        </div>
      </CardFooter>
    </Card>
  );
}

// Main page component with Suspense boundary
export default function JudgeInvitationErrorPage() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-neutral-50">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse">
                Please wait while we load the page...
              </div>
            </CardContent>
          </Card>
        }
      >
        <JudgeInvitationErrorContent />
      </Suspense>
    </div>
  );
}
