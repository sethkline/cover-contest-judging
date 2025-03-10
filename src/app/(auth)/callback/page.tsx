"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function CallbackPage() {
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
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          console.log("Session already exists, redirecting to:", next);
          router.push(next);
          return;
        }
        
        // Get hash parameters
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        
        console.log("Hash params:", Object.fromEntries(hashParams));
        
        // If we have an access token in the hash, set the session
        if (hashParams.get("access_token")) {
          const {
            data: { session },
            error,
          } = await supabase.auth.setSession({
            access_token: hashParams.get("access_token")!,
            refresh_token: hashParams.get("refresh_token")!,
          });
          
          console.log("Set session result:", { session, error });
          
          if (error) throw error;
          
          if (session) {
            // Redirect to the next page
            router.push(next);
            return;
          }
        } else {
          // No hash params, try to refresh the session
          // This is useful for recovery links and magic links
          const { data: { session }, error } = await supabase.auth.refreshSession();
          
          console.log("Refresh session result:", { session, error });
          
          if (error) {
            console.error("Auth refresh error:", error);
            router.push("/login?error=Authentication%20failed");
            return;
          }
          
          if (session) {
            router.push(next);
            return;
          }
        }
        
        // If we get here without a session, something went wrong
        console.error("No session established");
        router.push("/login?error=Failed%20to%20establish%20session");
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/login?error=Authentication%20error");
      }
    };
    
    handleCallback();
  }, [router, searchParams]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse">Setting up your account...</div>
    </div>
  );
}