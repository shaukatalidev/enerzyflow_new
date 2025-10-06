'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';

const protectedPaths = ['/dashboard', '/profile', '/order'];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, profileLoaded, isProfileComplete } = useAuth(); // ✅ Added profileLoaded and isProfileComplete
  const router = useRouter();
  const redirectAttempted = useRef(false);

  const isProtectedRoute = useMemo(() => 
    protectedPaths.some(path => pathname.startsWith(path)), 
    [pathname]
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // ✅ Reset redirect flag when navigating away from login/signup
    if (redirectAttempted.current && pathname !== '/login' && pathname !== '/signup') {
      redirectAttempted.current = false;
    }

    if (redirectAttempted.current) {
      return;
    }

    // ✅ Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
      redirectAttempted.current = true;
      router.push('/login');
      return;
    }

    // ✅ Redirect authenticated users from login/signup
    if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
      
      // For printing users - always go to dashboard
      if (user?.role === 'printing') {
        redirectAttempted.current = true;
        router.push('/dashboard');
        return;
      }
      
      // For business owners - check profile completion
      // Wait for profile to load first
      if (!profileLoaded) {
        return;
      }
      
      if (isProfileComplete()) {
        redirectAttempted.current = true;
        router.push('/dashboard');
      } else {
        redirectAttempted.current = true;
        router.push('/profile');
      }
      return;
    }
  }, [isAuthenticated, isLoading, isProtectedRoute, pathname, router, user?.role, profileLoaded, isProfileComplete]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
