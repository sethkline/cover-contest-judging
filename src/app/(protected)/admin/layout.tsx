'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const supabase = createClientComponentClient();

      // Check if the user is logged in
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      // Check if user is in admin_users table
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!adminData) {
        // Not an admin user
        router.push('/unauthorized');
        return;
      }

      // User is authenticated as admin
      setUserEmail(session.user.email);
      setLoading(false);
    };

    checkAdminAccess();
  }, [router]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
            {/* Logo/Brand section */}
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center font-medium text-gray-900">
                Admin Dashboard
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/admin/entries" className="px-3 py-2 text-gray-600 hover:text-gray-900">
                Entries
              </Link>
              <Link href="/admin/judges" className="px-3 py-2 text-gray-600 hover:text-gray-900">
                Judges
              </Link>
              <Link href="/admin/users" className="px-3 py-2 text-gray-600 hover:text-gray-900">
                Users
              </Link>
              <div className="ml-4 pl-4 border-l border-gray-200 flex items-center">
                <span className="text-gray-500 mr-4 truncate max-w-[200px]">{userEmail}</span>
                <SignOutButton />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <span className="text-gray-500 mr-4 truncate max-w-[150px]">{userEmail}</span>
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/admin/entries"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Entries
            </Link>
            <Link
              href="/admin/judges"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Judges
            </Link>
            <Link
              href="/admin/users"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Users
            </Link>
            <div className="px-3 py-2">
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
