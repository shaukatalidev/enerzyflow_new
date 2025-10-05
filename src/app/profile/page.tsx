"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { profileService } from "@/app/services/profileService";
import MyProfile from "@/app/profile/components/MyProfile";
import toast from "react-hot-toast";

interface Label {
  label_id?: string;
  name: string;
  url: string;
}

interface Outlet {
  id?: string;
  name: string;
  address: string;
}

interface UserProfile {
  name?: string;
  contactNo?: string;
  email?: string;
  designation?: string;
  brandCompanyName?: string;
  businessAddress?: string;
  profilePhoto?: string;
  logo?: string;
  role?: "user" | "plant" | "printing";
  labels?: Label[];
  outlets?: Outlet[];
}

interface ProfileUpdateResult {
  blocked_labels?: Array<{
    label_id: string;
    name: string;
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loadProfile, profileLoaded, profileLoading, isAuthenticated } =
    useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAttempted = useRef(false);

  // ✅ Role-based access control
useEffect(() => {
  // Wait for auth to fully load
  if (profileLoading) return;

  // Only redirect if explicitly not authenticated (not during loading)
  if (!profileLoading && !isAuthenticated && !user) {
    router.push("/login");
    return;
  }

  // Check role only if authenticated
  if (isAuthenticated && user && user.role !== "business_owner") {
    toast.error("Access denied. Only business owners can access this page.");
    router.push("/");
  }
}, [user, profileLoading, isAuthenticated, router]);


  // ✅ Load profile only if not already loaded and not currently loading
  useEffect(() => {
    const initProfile = async () => {
      if (profileLoaded || profileLoading || loadAttempted.current) {
        return;
      }

      // Only load if user has correct role
      if (user?.role !== "business_owner") {
        return;
      }

      loadAttempted.current = true;

      try {
        await loadProfile();
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile data");
        loadAttempted.current = false;
      }
    };

    initProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  // ✅ Map user data to profile format
  useEffect(() => {
    if (user?.profile) {
      const mappedProfile: UserProfile = {
        name: user.profile.name,
        contactNo: user.profile.phone,
        email: user.email,
        designation: user.profile.designation,
        brandCompanyName: user.company?.name,
        businessAddress: user.company?.address,
        profilePhoto: user.profile.profile_url,
        logo: user.company?.logo,
        role: user.role as "user" | "plant" | "printing" | undefined,
        labels: user.labels?.map((l) => ({
          label_id: l.label_id,
          name: l.name || "",
          url: l.label_url || "",
        })),
        outlets:
          user.company?.outlets?.map((o) => ({
            id: o.id,
            name: o.name || "",
            address: o.address || "",
          })) || [],
      };
      setProfileData(mappedProfile);
    }
  }, [user]);

  const handleProfileUpdate = async (
    updatedProfile: UserProfile,
    profileImageUrl?: string,
    logoUrl?: string,
    labelsData?: Label[],
    outletsData?: Outlet[]
  ): Promise<ProfileUpdateResult> => {
    try {
      const result = await profileService.saveProfileWithImages(
        {
          profile: {
            name: updatedProfile.name,
            phone: updatedProfile.contactNo,
            designation: updatedProfile.designation,
          },
          company: {
            name: updatedProfile.brandCompanyName,
            address: updatedProfile.businessAddress,
            outlets: outletsData,
          },
        },
        profileImageUrl,
        logoUrl,
        labelsData,
        outletsData
      );

      await loadProfile(true);

      return {
        blocked_labels: result.blocked_labels || [],
      };
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update profile");
      }
      throw err;
    }
  };

  const handleClearError = () => setError(null);

  // ✅ Don't render anything if wrong role (will redirect)
  if (user && user.role !== "business_owner") {
    return null;
  }

  // ✅ Show loading state
  if (profileLoading || (!profileData && !error && !profileLoaded)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ✅ Show error state
  if (error && !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700 font-semibold mb-2">
              Failed to Load Profile
            </p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                loadAttempted.current = false;
                loadProfile();
              }}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MyProfile
      userProfile={profileData!}
      onProfileUpdate={handleProfileUpdate}
      error={error}
      onClearError={handleClearError}
    />
  );
}
