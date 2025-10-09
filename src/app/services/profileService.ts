import axiosInstance from '../lib/axios';
import { AxiosError } from 'axios';

// ==================== Types ====================

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

interface ApiErrorResponse {
  error?: string;
  message?: string;
  msg?: string;
}

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

// ==================== Profile Service ====================

class ProfileService {
  /**
   * Get user profile
   * GET /users/profile
   */
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await axiosInstance.get<ProfileResponse>('/users/profile');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch profile:', error);
      throw this.handleError(error, 'Failed to fetch profile');
    }
  }

  /**
   * Save user profile
   * POST /users/profile
   */
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
      console.error('❌ Failed to save profile:', error);
      throw this.handleError(error, 'Failed to save profile');
    }
  }

  /**
   * Save profile with image URLs and label/outlet data
   * Convenience method that combines all profile data
   */
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
          outlets: this.mapOutletsData(outletsData, baseProfileData.company?.outlets),
        },
        labels: this.mapLabelsData(labelsData),
      };

      return await this.saveProfile(requestData);
    } catch (error) {
      console.error('❌ Failed to save profile with images:', error);
      // Re-throw the error as-is (already handled by saveProfile)
      throw error;
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Handle API errors consistently (same pattern as other services)
   */
  private handleError(error: unknown, defaultMessage: string): Error {
    if (error instanceof AxiosError && error.response?.data) {
      const data = error.response.data as ApiErrorResponse;

      // Try multiple common error field names
      if (data.error) return new Error(data.error);
      if (data.message) return new Error(data.message);
      if (data.msg) return new Error(data.msg);
    }

    if (error instanceof Error) {
      return new Error(error.message);
    }

    return new Error(defaultMessage);
  }

  /**
   * Map outlets data for API request
   */
  private mapOutletsData(
    outletsData?: Array<{id?: string; name: string; address: string}>,
    fallbackOutlets?: Array<{id?: string; name?: string; address?: string}>
  ): Array<OutletData> {
    if (outletsData) {
      return outletsData.map(outlet => {
        const outletData: OutletData = {
          name: outlet.name,
          address: outlet.address,
        };
        // Include id only if it exists (for updates)
        if (outlet.id) {
          outletData.id = outlet.id;
        }
        return outletData;
      });
    }
    return fallbackOutlets || [];
  }

  /**
   * Map labels data for API request
   */
  private mapLabelsData(
    labelsData?: Array<{label_id?: string; name: string; url: string}>
  ): Array<LabelData> {
    if (!labelsData) return [];

    return labelsData.map(label => {
      const labelData: LabelData = {
        name: label.name,
        label_url: label.url,
      };
      // Include label_id only if it exists (for updates)
      if (label.label_id) {
        labelData.label_id = label.label_id;
      }
      return labelData;
    });
  }

  /**
   * Validate Cloudinary URL format
   */
  validateCloudinaryUrl(url: string): boolean {
    return url.includes('res.cloudinary.com') && url.startsWith('https://');
  }

  /**
   * Validate profile data before submission
   */
  validateProfileData(data: SaveProfileRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate profile
    if (!data.profile?.name?.trim()) {
      errors.push('Name is required');
    }
    if (!data.profile?.phone?.trim()) {
      errors.push('Phone number is required');
    }

    // Validate company
    if (!data.company?.name?.trim()) {
      errors.push('Company name is required');
    }
    if (!data.company?.address?.trim()) {
      errors.push('Company address is required');
    }

    // Validate labels
    if (data.labels) {
      data.labels.forEach((label, index) => {
        if (!label.name?.trim()) {
          errors.push(`Label ${index + 1}: Name is required`);
        }
        if (!label.label_url?.trim()) {
          errors.push(`Label ${index + 1}: Image URL is required`);
        }
      });
    }

    // Validate outlets
    if (data.company?.outlets) {
      data.company.outlets.forEach((outlet, index) => {
        if (!outlet.name?.trim()) {
          errors.push(`Outlet ${index + 1}: Name is required`);
        }
        if (!outlet.address?.trim()) {
          errors.push(`Outlet ${index + 1}: Address is required`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if profile has image URLs
   */
  hasProfileImage(profile?: ProfileResponse): boolean {
    return !!(profile?.user?.profile_url && profile.user.profile_url.trim());
  }

  /**
   * Check if company has logo
   */
  hasCompanyLogo(profile?: ProfileResponse): boolean {
    return !!(profile?.company?.logo && profile.company.logo.trim());
  }

  /**
   * Get label count
   */
  getLabelCount(profile?: ProfileResponse): number {
    return profile?.labels?.length || 0;
  }

  /**
   * Get outlet count
   */
  getOutletCount(profile?: ProfileResponse): number {
    return profile?.company?.outlets?.length || 0;
  }

  /**
   * Check if profile is complete
   */
  isProfileComplete(profile?: ProfileResponse): boolean {
    if (!profile) return false;

    const hasBasicInfo = !!(
      profile.user?.name &&
      profile.user?.phone &&
      profile.company?.name &&
      profile.company?.address
    );

    return hasBasicInfo;
  }
}

// ✅ Export singleton instance
export const profileService = new ProfileService();
export default profileService;
