import { axiosInstance } from '../lib/axios';

export interface UserProfile {
  name?: string;
  contactNo?: string;
  email?: string;
  designation?: string;
  brandCompanyName?: string;
  businessAddress?: string;
  profilePhoto?: string;
  logo?: string;
  role?: 'user' | 'plant' | 'printing';
  labels?: Array<{name: string, url: string}>;
  outlets?: Array<{name: string, address: string}>; // ✅ Added outlets
}

// ✅ Updated to match backend struct tags
export interface SaveProfileRequest {
  profile: {
    name?: string;
    phone?: string;
    designation?: string;
    profile_url?: string;
  };
  company: {
    name?: string;
    address?: string;
    logo_url?: string;
    outlets?: Array<{
      name?: string;
      address?: string;
    }>;
  };
  labels?: Array<{
    name?: string;
    label_url?: string;
  }>;
}

// ✅ Updated to match backend response tags
export interface ProfileResponse {
  user?: {
    user_id?: string;
    email?: string;
    name?: string;
    phone?: string;
    designation?: string;
    role?: string;
    profile_url?: string;
  };
  company?: {
    company_id?: string;
    name?: string;
    address?: string;
    logo?: string;
    outlets?: Array<{
      id?: string;
      name?: string;
      address?: string;
    }>;
  };
  labels?: Array<{
    label_id?: string;
    name?: string;
    label_url?: string;
  }>;
}

export interface SaveProfileResponse {
  message: string;
  user: {
    user_id?: string;
    email?: string;
    name?: string;
    phone?: string;
    designation?: string;
    role?: string;
    profile_url?: string;
  };
  company: {
    company_id?: string;
    name?: string;
    address?: string;
    logo?: string;
    outlets?: Array<{
      id?: string;
      name?: string;
      address?: string;
    }>;
  };
  labels?: Array<{
    label_id?: string;
    name?: string;
    label_url?: string;
  }>;
}

class ProfileService {
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await axiosInstance.get<ProfileResponse>('/users/profile');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  }

  async saveProfile(profileData: SaveProfileRequest): Promise<SaveProfileResponse> {
    try {
      console.log('Sending payload:', JSON.stringify(profileData, null, 2));
      
      const response = await axiosInstance.post<SaveProfileResponse>(
        '/users/profile', 
        profileData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error saving profile:', error);
      throw new Error(error.response?.data?.error || 'Failed to save profile');
    }
  }

  // ✅ Updated to include outlets
  async saveProfileWithImages(
    baseProfileData: {
      profile?: {
        name?: string;
        phone?: string;
        designation?: string;
      };
      company?: {
        name?: string;
        address?: string;
        outlets?: Array<{
          name?: string;
          address?: string;
        }>;
      };
    },
    profileImageUrl?: string,
    companyLogoUrl?: string,
    labelsData?: Array<{name: string, url: string}>,
    outletsData?: Array<{name: string, address: string}> // ✅ Added outlets parameter
  ): Promise<SaveProfileResponse> {
    try {
      const requestData: SaveProfileRequest = {
        profile: {
          ...baseProfileData.profile,
          profile_url: profileImageUrl,
        },
        company: {
          ...baseProfileData.company,
          logo_url: companyLogoUrl,
          outlets: outletsData || baseProfileData.company?.outlets || [],
        },
        labels: labelsData?.map(label => ({
          name: label.name,
          label_url: label.url
        })) || [],
      };

      return await this.saveProfile(requestData);
    } catch (error: any) {
      console.error('Error saving profile with images:', error);
      throw new Error(error.response?.data?.error || 'Failed to save profile');
    }
  }

  validateCloudinaryUrl(url: string): boolean {
    return url.includes('res.cloudinary.com') && url.startsWith('https://');
  }
}

export const profileService = new ProfileService();
