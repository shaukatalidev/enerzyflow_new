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

export interface Order {
  order_id: string;
  company_id: string;
  label_url?: string;
  variant: string;
  qty: number;
  cap_color: string;
  volume: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export interface GetOrdersResponse {
  orders: Order[];
}

export interface GetOrderResponse {
  order: Order;
}

// ✅ Define error response type
interface ApiErrorResponse {
  error?: string;
}

export class OrderService {
  /**
   * Create a new order
   */
  static async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await axiosInstance.post<CreateOrderResponse>('/orders/create', orderData);
      return response.data;
    } catch (error) {
      // ✅ FIX 1: Removed `: any` and added proper error handling
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || 'Failed to create order');
      }
      throw new Error('Failed to create order');
    }
  }

  static async getOrders(): Promise<GetOrdersResponse> {
    try {
      const response = await axiosInstance.get<GetOrdersResponse>('/orders/get-all');
      return response.data;
    } catch (error) {
      // ✅ FIX 2: Removed `: any` and added proper error handling
      console.error('❌ Order service error:', error instanceof AxiosError ? error.response : error);
      
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || 'Failed to fetch orders');
      }
      throw new Error('Failed to fetch orders');
    }
  }

  /**
   * Get a specific order by ID
   */
  static async getOrder(orderId: string): Promise<GetOrderResponse> {
    try {
      const response = await axiosInstance.get<GetOrderResponse>(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      // ✅ FIX 3: Removed `: any` and added proper error handling
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || 'Failed to fetch order');
      }
      throw new Error('Failed to fetch order');
    }
  }
}

export const orderService = OrderService;
