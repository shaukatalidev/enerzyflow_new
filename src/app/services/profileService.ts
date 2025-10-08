import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';

export interface UserProfile {
  name?: string;
  contactNo?: string;
  email?: string;
  designation?: string;
  brandCompanyName?: string;
  businessAddress?: string;
  profilePhoto?: string;
  logo?: string;
  role?: 'business_owner' | 'plant' | 'printing';
  labels?: Array<{label_id?: string; name: string; url: string}>;
  outlets?: Array<{id?: string; name: string; address: string}>;
}

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
  }> | null; 
  blocked_labels?: Array<{  
    label_id: string;
    name: string;
  }>;
}

// ✅ Define error response type
interface ApiErrorResponse {
  error?: string;
  message?: string;
  msg?: string;
}

// ✅ Define types for outlet and label data
interface OutletData {
  id?: string;
  name?: string;
  address?: string;
}

interface LabelData {
  label_id?: string;
  name?: string;
  label_url?: string;
}

class ProfileService {
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await axiosInstance.get<ProfileResponse>('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        const errorMessage = 
          errorData.error || 
          errorData.message || 
          errorData.msg || 
          'Failed to fetch profile';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch profile');
    }
  }

  async saveProfile(profileData: SaveProfileRequest): Promise<SaveProfileResponse> {
    try {
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
    } catch (error) {
      console.error('Error saving profile:', error);
      
      // ✅ IMPROVED: Better error extraction
      if (error instanceof AxiosError) {
        // Check if response has error data
        if (error.response?.data) {
          const errorData = error.response.data as ApiErrorResponse;
          
          // Try multiple common error field names
          const errorMessage = 
            errorData.error || 
            errorData.message || 
            errorData.msg || 
            'Failed to save profile';
          
          console.error('Backend error message:', errorMessage);
          throw new Error(errorMessage);
        }
        
        // If no response data, use axios error message
        if (error.message) {
          throw new Error(error.message);
        }
      }
      
      // If it's already an Error, re-throw it
      if (error instanceof Error) {
        throw error;
      }
      
      // Fallback
      throw new Error('Failed to save profile');
    }
  }

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
          id?: string;
          name?: string;
          address?: string;
        }>;
      };
    },
    profileImageUrl?: string,
    companyLogoUrl?: string,
    labelsData?: Array<{label_id?: string; name: string; url: string}>,
    outletsData?: Array<{id?: string; name: string; address: string}>
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
          outlets: outletsData?.map(outlet => {
            const outletData: OutletData = {
              name: outlet.name,
              address: outlet.address
            };
            // Include id only if it exists (for updates)
            if (outlet.id) {
              outletData.id = outlet.id;
            }
            return outletData;
          }) || baseProfileData.company?.outlets || [],
        },
        labels: labelsData?.map(label => {
          const labelData: LabelData = {
            name: label.name,
            label_url: label.url
          };
          // Include label_id only if it exists (for updates)
          if (label.label_id) {
            labelData.label_id = label.label_id;
          }
          return labelData;
        }) || [],
      };

      return await this.saveProfile(requestData);
    } catch (error) {
      // ✅ FIXED: Just log and re-throw - don't wrap in new Error
      console.error('Error saving profile with images:', error);
      
      // ✅ If saveProfile already threw a proper Error, just re-throw it
      if (error instanceof Error) {
        throw error;
      }
      
      // ✅ Only create new error if it's not already an Error
      throw new Error('Failed to save profile');
    }
  }

  validateCloudinaryUrl(url: string): boolean {
    return url.includes('res.cloudinary.com') && url.startsWith('https://');
  }
}

export const profileService = new ProfileService();
