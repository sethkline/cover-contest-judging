'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';

// Component that uses the useSearchParams hook
function CallbackHandler() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the next destination from query params
        const next = searchParams.get('next') || '/';

        // First check if we already have a session
        const {
          data: { session: existingSession }
        } = await supabase.auth.getSession();

        if (existingSession) {
          // If we have a session, simply redirect to the next page
          router.push(next);
          return;
        }

        // Check for tokens in the URL or hash
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        // Handle magic link tokens
        if (token && (type === 'magiclink' || type === 'recovery')) {
          try {
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: type
            });

            if (error) {
              console.error('Token verification error:', error);
              router.push(`/judge-access?error=${encodeURIComponent(error.message)}`);
              return;
            }

            // Check if we have a session after verification
            const {
              data: { session }
            } = await supabase.auth.getSession();

            if (session) {
              router.push(next);
              return;
            }
          } catch (error) {
            console.error('Token verification error:', error);
            router.push(`/judge-access?error=${encodeURIComponent(error.message)}`);
            return;
          }
        }

        // Handle access token in hash (for other auth flows)
        if (hashParams.get('access_token')) {
          // Your existing access token handling code
        }

        // Attempt to refresh session as last resort
        const {
          data: { session },
          error
        } = await supabase.auth.refreshSession();

        if (error) {
          console.error('Auth refresh error:', error);
          router.push(`/judge-access?error=${encodeURIComponent(error.message)}`);
          return;
        }

        if (session) {
          router.push(next);
          return;
        }

        // If we get here without a session, something went wrong
        router.push('/judge-access?error=Failed%20to%20establish%20session');
      } catch (error) {
        console.error('Callback error:', error);
        router.push('/judge-access?error=Authentication%20error');
      }
    };

    handleCallback();
  }, [router, searchParams]);

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
