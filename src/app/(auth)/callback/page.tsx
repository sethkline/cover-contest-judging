"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function CallbackPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleCallback = async () => {
      try {
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
            // Verify the session is set before redirecting
            const {
              data: { session: verifiedSession },
            } = await supabase.auth.getSession();
            if (verifiedSession) {
              router.push("/confirm-judge");
              return;
            }
          }
        }

        // If we get here without a session, something went wrong
        console.error("No session established");
        router.push("/error?message=Failed to establish session");
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/error");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse">Setting up your account...</div>
    </div>
  );
}
