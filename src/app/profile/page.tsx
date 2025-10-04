"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { profileService } from "@/app/services/profileService";
import MyProfile from "@/app/profile/components/MyProfile";

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
  const { user, loadProfile, profileLoaded, profileLoading } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ FIX: Use ref to track if we've attempted to load
  const loadAttempted = useRef(false);

  // ✅ FIX: Load profile only if not already loaded and not currently loading
  useEffect(() => {
    const initProfile = async () => {
      if (profileLoaded || profileLoading || loadAttempted.current) {
        return;
      }

      loadAttempted.current = true;

      try {
        await loadProfile();
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile data");
        loadAttempted.current = false; // Allow retry on error
      }
    };

    initProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Run only once on mount

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
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadAttempted.current = false;
              loadProfile();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Retry
          </button>
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
