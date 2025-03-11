'use client';

import { useRouter } from 'next/navigation';
import { ShieldX, ArrowLeft, LogIn } from 'lucide-react';
import { BaseButton } from '@/components/ui/BaseButton';

export default function UnauthorizedPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-neutral-800 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <ShieldX size={64} className="text-error-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">
          Access Denied
        </h1>
        
        <p className="mb-6 text-neutral-600 dark:text-neutral-300">
          You don't have permission to access this page. Please log in with an account that has the necessary permissions or return to the home page.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton 
            onClick={() => router.push('/')}
            variant="outline"
            leftIcon={<ArrowLeft size={16} />}
          >
            Go Home
          </BaseButton>
          
          <BaseButton 
            onClick={() => router.push('/login')}
            leftIcon={<LogIn size={16} />}
          >
            Log In
          </BaseButton>
        </div>
      </div>
    </div>
  );
}