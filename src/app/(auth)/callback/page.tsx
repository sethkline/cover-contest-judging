"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, AlertCircle } from "lucide-react";

function CallbackHandler() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the next destination from query params
        const next = searchParams.get("next") || "/";
        console.log("Next destination:", next);

        // Log URL params for debugging
        const urlParams = Object.fromEntries(searchParams.entries());
        console.log("URL params:", urlParams);

        // Check hash params for tokens
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        console.log("Has access token in hash:", !!accessToken);

        setDebugInfo({
          urlParams,
          hasAccessTokenInHash: !!accessToken,
          hasRefreshTokenInHash: !!refreshToken,
          hash: window.location.hash
            ? window.location.hash.substring(0, 20) + "..."
            : "none",
        });

        // First check if we already have a session
        const {
          data: { session: existingSession },
        } = await supabase.auth.getSession();

        if (existingSession) {
          console.log("Session already exists, redirecting to:", next);
          router.push(next);
          return;
        }

        // If we have tokens in the hash, try setting the session directly
        if (accessToken && refreshToken) {
          try {
            const { data, error: setSessionError } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

            if (setSessionError) {
              console.error("Set session error:", setSessionError);
              setError(setSessionError.message);
            } else if (data?.session) {
              console.log("Session set successfully");
              router.push(next);
              return;
            }
          } catch (setSessionErr) {
            console.error("Error setting session:", setSessionErr);
          }
        }

        // If we're still here, check if we have a session now
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (session) {
          console.log("Session established");
          router.push(next);
          return;
        }

        // If we still don't have a session, show an error
        setError("Failed to establish a session. Please try logging in again.");
      } catch (err) {
        console.error("Callback error:", err);
        setError(err.message || "Authentication error");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="p-4 max-w-md mx-auto bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
          <div>
            <h3 className="text-red-800 font-medium">Authentication Error</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <div className="mt-4">
              <button
                onClick={() => router.push("/judge-access")}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Return to Sign In
              </button>
            </div>
            {debugInfo && (
              <div className="mt-4 text-xs border-t border-red-200 pt-2">
                <p className="font-medium">Debug Info:</p>
                <pre className="mt-1 overflow-auto p-2 bg-red-100 rounded">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
