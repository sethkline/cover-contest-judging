"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";

export function withJudgeAuth(Component: React.ComponentType<any>) {
  return function JudgeAuthComponent(props: any) {
    const router = useRouter();
    const pathname = usePathname(); // Get current path
    const supabase = createClientComponentClient();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function checkAuth() {
        try {
          // Check if user is logged in
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session) {
            router.push("/login");
            return;
          }

          // Check if user is a judge
          const { data: judgeData, error: judgeError } = await supabase
            .from("judges")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (judgeError || !judgeData) {
            router.push("/unauthorized");
            return;
          }

          // Check if this is a first-time judge (status is pending)
          if (
            judgeData.status === "pending" &&
            !pathname.includes("/judge/welcome")
          ) {
            // Don't update status here - we'll do that in the welcome page
            // Just redirect to welcome
            router.push("/judge/welcome");
            return;
          }

          setIsAuthorized(true);
        } catch (error) {
          console.error("Authentication error:", error);
          router.push("/login");
        } finally {
          setLoading(false);
        }
      }

      checkAuth();
    }, [router, supabase, pathname]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthorized) return null;

    return <Component {...props} />;
  };
}
