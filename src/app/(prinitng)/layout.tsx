'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

export default function PrintingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Don't check until auth is loaded
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }

    // Check if user has printing role
    if (user?.role !== 'printing') {
      toast.error('Access denied. Only printing users can access this area.');
      router.push('/');
    }
  }, [user, isLoading, isAuthenticated, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or wrong role
  if (!isAuthenticated || user?.role !== 'printing') {
    return null;
  }

  return <>{children}</>;
}
