'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Admin Route Protection
export function AdminRoute({ children }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (userRole !== 'admin') {
        router.push('/unauthorized');
      }
    }
  }, [user, userRole, loading, router]);

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

  if (!user || userRole !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

// Judge Route Protection
export function JudgeRoute({ children }: ProtectedRouteProps) {
  const { user, userRole, judgeStatus, loading } = useAuth();
  const router = useRouter();
  const pathname = window.location.pathname;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (userRole !== 'judge') {
        router.push('/unauthorized');
      } else if (judgeStatus === 'pending' && !pathname.includes('/judge/welcome')) {
        router.push('/judge/welcome');
      }
    }
  }, [user, userRole, judgeStatus, loading, router, pathname]);

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

  if (!user || userRole !== 'judge') {
    return null;
  }

  // Special case for welcome page
  if (judgeStatus === 'pending' && !pathname.includes('/judge/welcome')) {
    return null;
  }

  return <>{children}</>;
}

// Welcome Page Specific Protection
export function JudgeWelcomeRoute({ children }: ProtectedRouteProps) {
  const { user, userRole, judgeStatus, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (userRole !== 'judge') {
        router.push('/unauthorized');
      } else if (judgeStatus === 'active') {
        // Already active, redirect to dashboard
        router.push('/judge/dashboard');
      }
    }
  }, [user, userRole, judgeStatus, loading, router]);

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

  if (!user || userRole !== 'judge' || judgeStatus === 'active') {
    return null;
  }

  return <>{children}</>;
}