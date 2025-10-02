'use client';

import { useState, useEffect } from 'react';
import ProfileCompletion from './components/ProfileCompletion';
import MainDashboard from './components/MainDashboard';

import { profileService, ProfileResponse } from '../services/profileService'; 

interface UserProfile {
  name?: string;
  contactNo?: string;
  email?: string;
  designation?: string;
  brandCompanyName?: string;
  businessAddress?: string;
  profilePhoto?: string;
  labelName?: string;
  logo?: string;
  role?: 'user' | 'plant' | 'printing';
}

const requiredProfileFields: (keyof UserProfile)[] = [
  'name',
  'contactNo',
  'email',
  'designation',
  'brandCompanyName',
  'businessAddress',
];

// Helper to check completeness with proper typing
const isProfileCompleteCheck = (profile: UserProfile): boolean => {
  return requiredProfileFields.every((field) => {
    const value = profile[field];
    return typeof value === 'string' ? value.trim().length > 0 : !!value;
  });
};

// Helper to map backend ProfileResponse to UserProfile shape
const mapProfileResponseToUserProfile = (data: ProfileResponse): UserProfile => {
  return {
    name: data.user?.name,
    contactNo: data.user?.phone,
    email: data.user?.email,
    designation: data.user?.designation,
    brandCompanyName: data.company?.name,
    businessAddress: data.company?.address,
    profilePhoto: data.user?.profile_url,
    logo: data.company?.logo,
    role: data.user?.role as UserProfile['role'], 
    labelName: data.labels && data.labels.length > 0 ? data.labels[0].name : undefined,
  };
};

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await profileService.getProfile();
        
        const mappedProfile = mapProfileResponseToUserProfile(profileData);
        const complete = isProfileCompleteCheck(mappedProfile);

        setUserProfile(mappedProfile);
        setIsProfileComplete(complete);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setFetchError('Failed to load user profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileComplete = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setIsProfileComplete(true);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{fetchError}</p>
      </div>
    );
  }

  if (!isProfileComplete) {
    return <ProfileCompletion onProfileComplete={handleProfileComplete} userProfile={userProfile} />;
  }

  const RenderDashboard = () => {
    return <MainDashboard/>
  };

  return <RenderDashboard />;
}
