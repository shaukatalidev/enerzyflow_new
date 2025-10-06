'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MainDashboard from './components/MainDashboard';
import PrintDashboard from './components/PrintDashboard';
// import PlantDashboard from './components/PlantDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
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

    // Super admin doesn't need profile completion
    if (user?.role === 'admin') {
      return;
    }

    // Printing and plant roles don't need profile completion
    if (user?.role === 'printing' || user?.role === 'plant') {
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
  }, [isLoading, isAuthenticated, profileLoaded, isProfileComplete, user?.role, router]);

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

  // Skip profile loading check for admin, printing, and plant roles
  const skipProfileCheck = user?.role === 'admin' || user?.role === 'printing' || user?.role === 'plant';
  
  if (!skipProfileCheck && !profileLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!skipProfileCheck && !isProfileComplete()) {
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

  // Role-based dashboard rendering
  switch (userRole) {
    case 'admin':
      return <SuperAdminDashboard />;
    case 'printing':
      return <PrintDashboard />;
    // case 'plant':
    //   return <PlantDashboard />;
    case 'business_owner':
    default:
      return <MainDashboard />;
  }
}
