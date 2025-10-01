'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const noAuthRequiredPaths = ['/login', '/signup'];
const protectedPaths = ['/dashboard', '/profile', '/order', '/products'];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const isNoAuthPath = useMemo(() => noAuthRequiredPaths.includes(pathname), [pathname]);
  const isProtectedRoute = useMemo(() => protectedPaths.includes(pathname), [pathname]);

  const showHeader = !isNoAuthPath;
  const showFooter = !isNoAuthPath;

  useEffect(() => {
    if (!isLoading) {
      if (isProtectedRoute && !isAuthenticated) {
        router.push('/login');
      } else if (isAuthenticated && isNoAuthPath) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, isProtectedRoute, isNoAuthPath, router]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showHeader && <Header />}
      <main className="min-h-screen">{children}</main>
      {showFooter && <Footer />}
    </>
  );
}
