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
        
        // Log the complete URL for debugging
        console.log("Full URL:", window.location.href);
        
        // Check URL for specific patterns
        setDebugInfo({
          hasCode: window.location.href.includes("code="),
          hasToken: window.location.href.includes("token="),
          hasAccessToken: window.location.href.includes("access_token="),
          searchParams: Object.fromEntries(searchParams.entries())
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

        // Try the standard Supabase auth callback method first
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );
          
          if (exchangeError) {
            console.error("Exchange error:", exchangeError);
            setError(exchangeError.message);
            // Don't immediately redirect - continue to try other methods
          } else if (data?.session) {
            console.log("Session established via code exchange");
            router.push(next);
            return;
          }
        } catch (exchangeErr) {
          console.error("Error in exchangeCodeForSession:", exchangeErr);
        }

        // If we didn't successfully exchange code, try to get a session directly 
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Got session after attempt", session);
          router.push(next);
          return;
        }
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
        }

        // If no redirect happened yet and no error is set, something else went wrong
        if (!error) {
          setError("Failed to establish a session");
        }
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