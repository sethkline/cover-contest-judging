"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";
import { JudgeNavigation } from "./components/JudgeNavigation";
import { JudgeFooter } from "./components/JudgeFooter";
import { Spinner } from "@/components/ui/progress-loading";

interface JudgeLayoutFeatureProps {
  children: React.ReactNode;
}

export const JudgeLayoutFeature = ({ children }: JudgeLayoutFeatureProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Verify user is a judge
      const { data: judgeData, error } = await supabase
        .from("judges")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !judgeData) {
        router.push("/unauthorized");
        return;
      }

      setUser(user);
      setLoading(false);
    }

    getUser();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" variant="primary" className="mx-auto mb-4" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show navigation on main judge pages, not on welcome/instructions
  const showNavigation = !pathname.includes("/judge/welcome");

  return (
    <div className="min-h-screen bg-neutral-50">
      {showNavigation && (
        <JudgeNavigation pathname={pathname} onSignOut={handleSignOut} />
      )}

      <main className="py-6">{children}</main>

      {showNavigation && <JudgeFooter />}
    </div>
  );
};
