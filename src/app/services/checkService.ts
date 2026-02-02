import { axiosInstance } from '../lib/axios';

export interface CheckApplicationData {
  name: string;
  phone: string;
  city: string;
  experience: string;
}

export interface CheckApplicationResponse {
  success: boolean;
  message: string;
  data?: any;
}

class CheckService {
  /**
   * Submit check/interest form
   * POST /check
   */
  async submitCheck(
    data: CheckApplicationData
  ): Promise<CheckApplicationResponse> {
    try {
      const response = await axiosInstance.post<CheckApplicationResponse>(
        '/enquiry/check',
        data
      );

      console.log('Check service received response:', response); // Debug log

      // If backend returns response.data directly
      if (response.data) {
        return response.data;
      }

      // If backend doesn't return a structured response, create one
      return {
        success: true,
        message: 'Interest submitted successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('❌ Failed to submit interest:', error);
      throw new Error(
        error.response?.data?.message ||
        'Failed to submit interest. Please try again.'
      );
    }
  }
}

export const checkService = new CheckService();
