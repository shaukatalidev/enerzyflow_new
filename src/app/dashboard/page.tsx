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
    if (redirectAttempted.current || isLoading || !profileLoaded) {
      return;
    }

    redirectAttempted.current = true;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isProfileComplete()) {
      router.push('/profile');
      return;
    }
  }, [isLoading, isAuthenticated, profileLoaded, isProfileComplete, router]);

  if (isLoading || !profileLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isProfileComplete()) {
    return null;
  }

  const userRole = user?.role || 'business_owner';

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
