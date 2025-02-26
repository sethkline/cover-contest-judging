// src/app/(protected)/admin/layout.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
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
              <span className="text-gray-500 mr-4">{session.user.email}</span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
