'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MainDashboard from './components/MainDashboard';
import PrintDashboard from './components/PrintDashboard';
// import PlantDashboard from './components/PlantDashboard';
import { useAuth } from '@/app/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated, profileLoaded, isProfileComplete, user } = useAuth();
  
  const redirectAttempted = useRef(false);

  useEffect(() => {
    // ✅ Don't redirect if still loading or profile not loaded
    if (isLoading || !profileLoaded) {
      return;
    }

    // ✅ Prevent multiple redirects
    if (redirectAttempted.current) {
      return;
    }

    // ✅ Check authentication first
    if (!isAuthenticated) {
      redirectAttempted.current = true;
      router.push('/login');
      return;
    }

    // ✅ Then check profile completion
    if (!isProfileComplete()) {
      redirectAttempted.current = true;
      router.push('/profile');
      return;
    }

    // ✅ Reset redirect flag if user is properly authenticated and has complete profile
    redirectAttempted.current = false;
    
  }, [isLoading, isAuthenticated, profileLoaded, isProfileComplete, router]);

  // ✅ Show loading while checking authentication
  if (isLoading || !profileLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ✅ Return null while redirecting
  if (!isAuthenticated || !isProfileComplete()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // ✅ Get user role with proper fallback
  const userRole = user?.role || 'business_owner';

  // ✅ Render appropriate dashboard based on role
  switch (userRole) {
    case 'printing':
      return <PrintDashboard />;
    // case 'plant':
    //   return <PlantDashboard />;
    case 'business_owner':
    default:
      return <MainDashboard />;
  }
}
