import { axiosInstance } from '../lib/axios';

export interface FranchiseApplicationData {
  name: string;
  phone: string;
  city: string;
  logistic_supports: string;
}

export interface FranchiseApplicationResponse {
  success: boolean;
  message: string;
  data?: any;
}

class FranchiseService {
  /**
   * Submit franchise application
   * POST /franchise/apply or /api/franchise/apply
   */
  async submitApplication(
    data: FranchiseApplicationData
  ): Promise<FranchiseApplicationResponse> {
    try {
      const response = await axiosInstance.post<FranchiseApplicationResponse>(
        '/enquiry/submit', // Update this endpoint according to your backend API
        data
      );

      console.log('Service received response:', response); // Debug log

      // If backend returns response.data directly
      if (response.data) {
        return response.data;
      }

      // If backend doesn't return a structured response, create one
      return {
        success: true,
        message: 'Application submitted successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('❌ Failed to submit franchise application:', error);
      throw new Error(
        error.response?.data?.message ||
        'Failed to submit application. Please try again.'
      );
    }
  }
}

export const franchiseService = new FranchiseService();
