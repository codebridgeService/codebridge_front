'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/store/authService';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        authService.setSession(token, user, refreshToken);
        
        // Redirect based on role
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } catch (e) {
        console.error('Failed to parse user info', e);
        router.push('/login?error=invalid_user');
      }
    } else {
      router.push('/login?error=missing_info');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-[color:var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse italic">
          Authenticating with Google...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading app...</div>}>
      <AuthCallbackHandler />
    </Suspense>
  );
}
