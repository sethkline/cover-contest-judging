"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";

function CallbackHandler() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the next destination from query params
        const next = searchParams.get("next") || "/";
        console.log("Next destination:", next);

        // First check if we already have a session
        const {
          data: { session: existingSession },
        } = await supabase.auth.getSession();

        if (existingSession) {
          console.log("Session already exists, redirecting to:", next);
          router.push(next);
          return;
        }

        // For magic links, Supabase handles most of the flow automatically
        // We just need to exchange the URL parameters for a session
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );

        if (error) {
          console.error("Auth error:", error);
          router.push(
            `/judge-access?error=${encodeURIComponent(error.message)}`
          );
          return;
        }

        // After exchanging code for session, check if we have a session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log("Session established, redirecting to:", next);
          router.push(next);
          return;
        }

        // If we get here without a session, something went wrong
        console.error("No session after code exchange");
        router.push("/judge-access?error=Failed%20to%20establish%20session");
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/judge-access?error=Authentication%20error");
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