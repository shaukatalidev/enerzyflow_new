"use client";

import { useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

// ✅ Dynamic imports for code splitting - lazy load dashboards
const MainDashboard = lazy(() => import("../../components/MainDashboard"));
const PrintDashboard = lazy(() => import("../../components/PrintDashboard"));
const PlantDashboard = lazy(() => import("../../components/PlantDashboard"));
const SuperAdminDashboard = lazy(
  () => import("../../components/SuperAdminDashboard")
);

// ✅ Reusable loading component
const LoadingSpinner = ({
  message = "Loading dashboard...",
}: {
  message?: string;
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated, profileLoaded, isProfileComplete, user } =
    useAuth();

  const redirectAttempted = useRef(false);

  // ✅ Memoize role checks to prevent recalculation
  const roleChecks = useMemo(() => {
    const role = user?.role;
    const skipProfileCheck =
      role === "admin" || role === "printing" || role === "plant";

    return {
      role: role || "business_owner",
      skipProfileCheck,
      needsProfile: !skipProfileCheck && profileLoaded && !isProfileComplete(),
    };
  }, [user?.role, profileLoaded, isProfileComplete]);

  // ✅ Optimized useEffect with primitive dependencies
  useEffect(() => {
    // Skip if already loading or already redirected
    if (isLoading || redirectAttempted.current) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      redirectAttempted.current = true;
      router.push("/login");
      return;
    }

    // Skip profile completion check for admin, printing, and plant roles
    if (roleChecks.skipProfileCheck) {
      return;
    }

    // Wait for profile to load before checking completion
    if (!profileLoaded) {
      return;
    }

    // Redirect to profile if incomplete
    if (roleChecks.needsProfile) {
      redirectAttempted.current = true;
      router.push("/profile");
    }
  }, [
    isLoading,
    isAuthenticated,
    profileLoaded,
    roleChecks.skipProfileCheck,
    roleChecks.needsProfile,
    router,
  ]);

  // ✅ Early returns for loading states
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoadingSpinner message="Redirecting to login..." />;
  }

  if (!roleChecks.skipProfileCheck) {
    if (!profileLoaded) {
      return <LoadingSpinner message="Loading your profile..." />;
    }

    if (roleChecks.needsProfile) {
      return <LoadingSpinner message="Redirecting to profile..." />;
    }
  }

  // ✅ Role-based dashboard rendering with Suspense for code splitting
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardRenderer role={roleChecks.role} />
    </Suspense>
  );
}

// ✅ Separate component for dashboard rendering (prevents re-render of parent)
function DashboardRenderer({ role }: { role: string }) {
  switch (role) {
    case "admin":
      return <SuperAdminDashboard />;
    case "printing":
      return <PrintDashboard />;
    case "plant":
      return <PlantDashboard />;
    case "business_owner":
    default:
      return <MainDashboard />;
  }
}
