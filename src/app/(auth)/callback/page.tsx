"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";

// Component that uses the useSearchParams hook
function CallbackHandler() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the next destination from query params
        const next = searchParams.get("next") || "/";
        
        // Check if this is a judge invitation
        const isJudgeInvite = next.includes("/confirm-judge");

        // First check if we already have a session
        const {
          data: { session: existingSession },
        } = await supabase.auth.getSession();

        if (existingSession) {
          router.push(next);
          return;
        }

        // Get hash parameters
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );

        // If we have an access token in the hash, set the session
        if (hashParams.get("access_token")) {
          const {
            data: { session },
            error,
          } = await supabase.auth.setSession({
            access_token: hashParams.get("access_token")!,
            refresh_token: hashParams.get("refresh_token")!,
          });

          if (error) {
            if (isJudgeInvite) {
              router.push(`/judge-invitation-error?error=${encodeURIComponent(error.message)}`);
              return;
            }
            throw error;
          }

          if (session) {
            // Redirect to the next page
            router.push(next);
            return;
          }
        } else {
          // No hash params, try to refresh the session
          // This is useful for recovery links and magic links
          const {
            data: { session },
            error,
          } = await supabase.auth.refreshSession();

          if (error) {
            console.error("Auth refresh error:", error);
            
            // Handle judge invitation errors differently
            if (isJudgeInvite) {
              router.push(`/judge-invitation-error?error=${encodeURIComponent(error.message)}`);
              return;
            }
            
            router.push(`/login?error=${encodeURIComponent(error.message)}`);
            return;
          }

          if (session) {
            router.push(next);
            return;
          }
        }

        // If we get here without a session, something went wrong
        console.error("No session established");
        
        if (isJudgeInvite) {
          router.push("/judge-invitation-error?error=Failed%20to%20establish%20session");
        } else {
          router.push("/login?error=Failed%20to%20establish%20session");
        }
      } catch (error) {
        console.error("Callback error:", error);
        
        // Check if this is likely a judge invitation
        const next = searchParams.get("next") || "/";
        const isJudgeInvite = next.includes("/confirm-judge");
        
        if (isJudgeInvite) {
          const errorMessage = error instanceof Error ? error.message : "Authentication error";
          router.push(`/judge-invitation-error?error=${encodeURIComponent(errorMessage)}`);
        } else {
          router.push("/login?error=Authentication%20error");
        }
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return <div className="animate-pulse">Setting up your account...</div>;
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      <p>Preparing your account...</p>
    </div>
  );
}

// Main component with Suspense boundary
export default function CallbackPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Suspense fallback={<LoadingFallback />}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}