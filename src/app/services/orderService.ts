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
  total?: number;
  has_more?: boolean;
}

export interface GetOrderResponse {
  order: Order;
}

interface ApiErrorResponse {
  error?: string;
}

// ✅ Add pagination parameters interface
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

  // ✅ Updated to accept pagination parameters
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
      
      // ✅ Check if there are more orders (backend returns limit number, if less then no more)
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
}

export const orderService = OrderService;
