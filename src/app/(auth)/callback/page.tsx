'use client';

import { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2, AlertCircle } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the next destination from query params
        const next = searchParams.get('next') || '/';
        console.log('Next destination:', next);

        // Log URL params for debugging
        const urlParams = Object.fromEntries(searchParams.entries());
        console.log('URL params:', urlParams);

        // Check hash params for tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        console.log('Has access token in hash:', !!accessToken);

        setDebugInfo({
          urlParams,
          hasAccessTokenInHash: !!accessToken,
          hasRefreshTokenInHash: !!refreshToken,
          hash: window.location.hash ? window.location.hash.substring(0, 20) + '...' : 'none',
          fullUrl: window.location.href
        });

        // First check if we already have a session
        const {
          data: { session: existingSession }
        } = await supabase.auth.getSession();

        if (existingSession) {
          console.log('Session already exists, redirecting to:', next);
          router.push(next);
          return;
        }

        // Try exchanging code for session (for magic links and recovery links)
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

          if (error) {
            console.log('Code exchange error:', error);
            // Don't return here, continue trying other methods
          } else if (data?.session) {
            console.log('Session established via code exchange');
            router.push(next);
            return;
          }
        } catch (exchangeErr) {
          console.log('Error in exchangeCodeForSession:', exchangeErr);
          // Continue to other auth methods
        }

        // If we have tokens in the hash, try setting the session directly
        if (accessToken && refreshToken) {
          try {
            const { data, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (setSessionError) {
              console.error('Set session error:', setSessionError);
              setError(setSessionError.message);
            } else if (data?.session) {
              console.log('Session set successfully');
              router.push(next);
              return;
            }
          } catch (setSessionErr) {
            console.error('Error setting session:', setSessionErr);
          }
        }

        // Last chance - check if we have a session now
        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession();

        if (session) {
          console.log('Session established');
          router.push(next);
          return;
        }

        // If we still don't have a session, show an error
        setError('Failed to establish a session. Please try logging in again.');
      } catch (err) {
        console.error('Callback error:', err);
        setError(err.message || 'Authentication error');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg border border-neutral-200">
        <div className="mb-4">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-error-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-neutral-900">Authentication Error</h3>
              <p className="mt-1 text-neutral-600">{error}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 pt-4 mt-4">
          <h4 className="font-medium mb-2">Would you like to:</h4>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/judge-access')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Try Again with Magic Link
            </button>
            
            <button
              onClick={() => router.push('/judge-access?tab=otp')}
              className="w-full flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
            >
              Use One-Time Access Code Instead
            </button>
          </div>
        </div>
        
        {debugInfo && (
          <div className="mt-6 text-xs border-t border-neutral-200 pt-3">
            <p className="font-medium text-neutral-500 mb-1">Debug Information</p>
            <div className="overflow-auto p-2 bg-neutral-50 rounded text-neutral-600 max-h-40">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    );
  }

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
