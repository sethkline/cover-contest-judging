'use client';

import { AuthProvider } from '@/lib/authContext';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}