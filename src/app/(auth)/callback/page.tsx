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

        // Check if this is a judge invitation
        const isJudgeInvite = next.includes('/confirm-judge');
        // Check if this is a password reset
        const isPasswordReset = next.includes('/reset-password/update');

        // First check if we already have a session
        const {
          data: { session: existingSession }
        } = await supabase.auth.getSession();

        if (existingSession) {
          router.push(next);
          return;
        }

        // Check for recovery token in URL parameters
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        // Specifically handle recovery (password reset) flows
        if (token && type === 'recovery') {
          console.log('Found recovery token in URL params');

          try {
            // For recovery flows, exchange token for session
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery'
            });

            if (error) {
              console.error('Recovery verification error:', error);

              if (isJudgeInvite) {
                router.push(`/judge-invitation-error?error=${encodeURIComponent(error.message)}`);
              } else {
                router.push(`/login?error=${encodeURIComponent(error.message)}`);
              }
              return;
            }

            // Check if we have a session after verification
            const {
              data: { session }
            } = await supabase.auth.getSession();

            if (session) {
              console.log('Session established after recovery verification');

              // If this was a judge invite with recovery token, send to confirm-judge
              if (isJudgeInvite) {
                router.push('/confirm-judge');
              } else if (isPasswordReset) {
                // For regular password resets, redirect to update password page
                router.push('/reset-password/update');
              } else {
                router.push(next);
              }
              return;
            }
          } catch (error) {
            console.error('Recovery verification error:', error);
            router.push(`/login?error=${encodeURIComponent(error.message || 'Failed to process recovery token')}`);
            return;
          }
        }

        // Get hash parameters for other auth flows
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        // If we have an access token in the hash, set the session
        if (hashParams.get('access_token')) {
          // Rest of your existing code for access tokens...
        } else {
          // No hash params, try to refresh the session
          // Rest of your existing code for session refresh...
        }

        // Rest of your existing code...
      } catch (error) {
        // Rest of your existing error handling...
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
