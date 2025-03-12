// app/judge-access/page.jsx
"use client";

import { useState, Suspense } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation"; 

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/Card";
import { BaseButton } from "@/components/ui/BaseButton";
import { Input } from "@/components/ui/Input";
import { Loader2, Mail, Key } from "lucide-react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/Tabs";

function JudgeAccessContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'otp' ? 'otp' : 'magic-link';

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const supabase = createClientComponentClient();

  // Handle magic link request
  const handleSendMagicLink = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/judges/send-magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send access link");
      }

      setSuccess(
        "Access link sent! Please check your email inbox (and spam folder).",
      );
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP request
  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

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

      setOtpSent(true);
      setSuccess("Access code sent! Please check your email.");
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
const handleVerifyOtp = async (e) => {
  e.preventDefault();
  
  if (!email || !otp) {
    setError("Please enter both your email and the access code");
    return;
  }
  
  setLoading(true);
  setError("");
  
  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Invalid or expired code");
    }
    
    // If we received a session from the backend, set it client-side as well
    if (data.session) {
      const { data: clientSessionData } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      });
      
      console.log("Session set on client:", !!clientSessionData.session);
    }
    
    // Redirect based on response
    window.location.href = data.redirectUrl || "/judge/dashboard";
  } catch (error) {
    console.error("Error verifying OTP:", error);
    setError(error.message || "Invalid or expired code");
  } finally {
    setLoading(false);
  }
};

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Judge Access</CardTitle>
        <CardDescription>
          Choose your preferred method to access the judging platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab}>
          <TabList className="mb-4">
            <Tab value="magic-link">Email Link</Tab>
            <Tab value="otp">Access Code</Tab>
          </TabList>
          <TabPanels>
            {/* Magic Link Tab */}
            <TabPanel value="magic-link">
              <div className="space-y-4">
                <p className="text-neutral-600">
                  Enter your email address below to receive a secure login link.
                  This link will give you immediate access to the judging
                  interface.
                </p>

                <form onSubmit={handleSendMagicLink} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your judge email"
                      required
                    />
                  </div>

                  {success && (
                    <div className="bg-success-50 text-success-700 p-3 rounded-md text-sm">
                      {success}
                    </div>
                  )}

                  {error && (
                    <div className="bg-error-50 text-error-700 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <BaseButton
                    type="submit"
                    onClick={handleSendMagicLink}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Send Login Link
                      </>
                    )}
                  </BaseButton>
                </form>
              </div>
            </TabPanel>

            {/* OTP Tab */}
            <TabPanel value="otp">
              <div className="space-y-4">
                <p className="text-neutral-600">
                  {!otpSent
                    ? "Request a 6-digit code to be sent to your email address. This option is helpful if you have issues with email links."
                    : "Enter the 6-digit code sent to your email address."}
                </p>

                {!otpSent ? (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div>
                      <label
                        htmlFor="email-otp"
                        className="block text-sm font-medium mb-1"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email-otp"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your judge email"
                        required
                      />
                    </div>

                    {success && (
                      <div className="bg-success-50 text-success-700 p-3 rounded-md text-sm">
                        {success}
                      </div>
                    )}

                    {error && (
                      <div className="bg-error-50 text-error-700 p-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}

                    <BaseButton
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Key className="h-4 w-4" />
                          Send Access Code
                        </>
                      )}
                    </BaseButton>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium mb-1"
                      >
                        Access Code
                      </label>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        placeholder="Enter 6-digit code"
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-error-50 text-error-700 p-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <BaseButton
                        type="button"
                        variant="outline"
                        onClick={() => setOtpSent(false)}
                        className="flex-1"
                      >
                        Back
                      </BaseButton>
                      <BaseButton
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="flex-1 flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Verifying...
                          </>
                        ) : (
                          "Verify Code"
                        )}
                      </BaseButton>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={loading}
                        className="text-primary-600 hover:underline text-sm"
                      >
                        Didn't receive a code? Send again
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardContent>
      <CardFooter>
        <BaseButton
          type="button"
          variant="outline"
          onClick={() => (window.location.href = "/login")}
          className="w-full"
        >
          Return to Regular Login
        </BaseButton>
      </CardFooter>
    </Card>
  );
}

export default function JudgeAccessPage() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-neutral-50">
      <Suspense fallback={<div>Loading...</div>}>
        <JudgeAccessContent />
      </Suspense>
    </div>
  );
}
