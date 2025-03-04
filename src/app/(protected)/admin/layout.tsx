"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkAdminAccess = async () => {
      const supabase = createClientComponentClient();

      // Check if the user is logged in
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      // Check if user is in admin_users table
      const { data: adminData } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!adminData) {
        // Not an admin user
        router.push("/unauthorized");
        return;
      }

      // User is authenticated as admin
      setUserEmail(session.user.email);
      setLoading(false);
    };

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/admin"
                className="flex items-center px-4 text-gray-900 font-medium"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/admin/entries"
                className="flex items-center px-4 text-gray-600 hover:text-gray-900"
              >
                Entries
              </Link>
              <Link
                href="/admin/judges"
                className="flex items-center px-4 text-gray-600 hover:text-gray-900"
              >
                Judges
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center px-4 text-gray-600 hover:text-gray-900"
              >
                Users
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 mr-4">{userEmail}</span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
