"use client";

import { useEffect, useState } from "react";
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
  role?: "user" | "plant" | "printing"; // ✅ FIX: Changed from string to specific union type
  labels?: Label[];
  outlets?: Outlet[];
}

// ✅ Define the return type matching MyProfile's expectation
interface ProfileUpdateResult {
  blocked_labels?: Array<{
    label_id: string;
    name: string;
  }>;
}

export default function ProfilePage() {
  const { user, loadProfile } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load profile on mount
  useEffect(() => {
    const initProfile = async () => {
      try {
        await loadProfile();
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile data");
      }
    };
    initProfile();
  }, [loadProfile]);

  // ✅ Watch for user changes
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
        role: user.role as "user" | "plant" | "printing" | undefined, // ✅ Type assertion
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

  // ✅ Handle profile update with proper return type
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

      await loadProfile(); // ✅ reload context
      
      // ✅ Return the result with blocked_labels
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

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <MyProfile
      userProfile={profileData}
      onProfileUpdate={handleProfileUpdate}
      error={error}
      onClearError={handleClearError}
    />
  );
}
