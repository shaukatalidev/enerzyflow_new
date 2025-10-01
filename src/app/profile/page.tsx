"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { profileService} from '@/app/services/profileService';
import MyProfile from '@/app/profile/components/MyProfile';

export default function ProfilePage() {
  const { user, loadProfile, profileLoaded } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load profile on mount and update context
  useEffect(() => {
    
    const initProfile = async () => {
      try {
        await loadProfile(); // ✅ This updates the AuthContext
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile data");
      }
    };

    initProfile();
  }, []); // Empty dependency - only run on mount

  // ✅ Watch for user changes from context
  useEffect(() => {
    if (user?.profile) {
      
      // Map the context data to profile format
      const mappedProfile = {
        name: user.profile.name,
        contactNo: user.profile.phone,
        email: user.email,
        designation: user.profile.designation,
        brandCompanyName: user.company?.name,
        businessAddress: user.company?.address,
        profilePhoto: user.profile.profile_url,
        logo: user.company?.logo, // ✅ This is the important one
        role: user.role as any,
        labels: user.labels?.map(l => ({
          name: l.name || '',
          url: l.label_url || ''
        })),
        outlets: user.company?.outlets?.map(o => ({
          name: o.name || '',
          address: o.address || ''
        })) || []
      };

      setProfileData(mappedProfile);
    }
  }, [user]); // Run whenever user changes

  // ✅ Handle profile update
  const handleProfileUpdate = async (
    updatedProfile: any,
    profileImageUrl?: string,
    logoUrl?: string,
    labelsData?: Array<{ name: string; url: string }>,
    outletsData?: Array<{ name: string; address: string }>
  ) => {
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

      // ✅ CRITICAL: Reload profile to update AuthContext and Header
      await loadProfile();
      
      return result;
    } catch (err: any) {
      console.error("❌ Failed to save profile:", err);
      setError(err.message || "Failed to update profile");
      throw err;
    }
  };

  const handleClearError = () => {
    setError(null);
  };

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
