"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Home, LogOut, Award, BookOpen } from "lucide-react";

export default function JudgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show navigation on main judge pages, not on welcome/instructions
  const showNavigation = !pathname.includes("/judge/welcome");

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavigation && (
        <nav className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="font-bold text-xl text-blue-600">
                    Contest Judge Portal
                  </span>
                </div>
                <div className="ml-6 flex space-x-4">
                  <Link
                    href="/judge/dashboard"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === "/judge/dashboard"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Home className="mr-1.5 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/judge/welcome"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === "/judge/welcome"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <BookOpen className="mr-1.5 h-4 w-4" />
                    Instructions
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50"
                >
                  <LogOut className="mr-1.5 h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="py-6">{children}</main>

      {showNavigation && (
        <footer className="bg-white border-t py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              Thank you for helping judge our contest entries.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
