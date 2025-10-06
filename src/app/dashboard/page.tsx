'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MainDashboard from './components/MainDashboard';
import PrintDashboard from './components/PrintDashboard';
import { useAuth } from '@/app/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated, profileLoaded, isProfileComplete, user } = useAuth();
  
  const redirectAttempted = useRef(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (redirectAttempted.current) {
      return;
    }

    if (!isAuthenticated) {
      redirectAttempted.current = true;
      router.push('/login');
      return;
    }

    if (user?.role === "printing") {
      return;
    }

    if (!profileLoaded) {
      return;
    }

    if (!isProfileComplete()) {
      redirectAttempted.current = true;
      router.push('/profile');
      return;
    }
  }, [isLoading, isAuthenticated, profileLoaded, isProfileComplete, user?.role, user?.email, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== "printing" && !profileLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== "printing" && !isProfileComplete()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to profile...</p>
        </div>
      </div>
    );
  }

  const userRole = user?.role || 'business_owner';

  switch (userRole) {
    case 'printing':
      return <PrintDashboard />;
    case 'business_owner':
    default:
      return <MainDashboard />;
  }
}
