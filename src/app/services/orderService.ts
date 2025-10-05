import axiosInstance from '../lib/axios';
import { AxiosError } from 'axios';

// Types for the order API
export interface CreateOrderRequest {
  label_id: string;
  variant: string;
  qty: number;
  cap_color: string;
  volume: number;
}

// ✅ Updated to match backend field names
export interface Order {
  order_id: string;
  company_id: string;
  label_url?: string;
  variant: string;
  qty: number;
  cap_color: string;
  volume: number;
  status: string;
  payment_url?: string;        // ✅ Changed from payment_screenshot_url
  invoice_url?: string;         // ✅ Added invoice_url
  created_at: string;
  updated_at: string;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export interface GetOrdersResponse {
  orders: Order[];
  total?: number;
  has_more?: boolean;
}

export interface GetOrderResponse {
  order: Order;
}

// Backend response for payment upload
export interface UploadPaymentScreenshotResponse {
  message: string;
  url: string;
}

interface ApiErrorResponse {
  error?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export class OrderService {
  static async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await axiosInstance.post<CreateOrderResponse>('/orders/create', orderData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || 'Failed to create order');
      }
      throw new Error('Failed to create order');
    }
  }

  static async getOrders(params?: PaginationParams): Promise<GetOrdersResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      if (params?.offset !== undefined) {
        queryParams.append('offset', params.offset.toString());
      }

      const url = `/orders/get-all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await axiosInstance.get<GetOrdersResponse>(url);
      
      const hasMore = response.data.orders.length === (params?.limit || 10);
      
      return {
        ...response.data,
        has_more: hasMore,
      };
    } catch (error) {
      console.error('❌ Order service error:', error instanceof AxiosError ? error.response : error);
      
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || 'Failed to fetch orders');
      }
      throw new Error('Failed to fetch orders');
    }
  }

  static async getOrder(orderId: string): Promise<GetOrderResponse> {
    try {
      const response = await axiosInstance.get<GetOrderResponse>(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || 'Failed to fetch order');
      }
      throw new Error('Failed to fetch order');
    }
  }

  static async uploadPaymentScreenshot(
    orderId: string, 
    file: File
  ): Promise<UploadPaymentScreenshotResponse> {
    try {
      const formData = new FormData();
      formData.append('screenshot', file);

      const response = await axiosInstance.post<UploadPaymentScreenshotResponse>(
        `/orders/${orderId}/payment-screenshot`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Payment screenshot upload error:', error instanceof AxiosError ? error.response : error);
      
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || 'Failed to upload payment screenshot');
      }
      throw new Error('Failed to upload payment screenshot');
    }
  }
}

export const orderService = OrderService;
