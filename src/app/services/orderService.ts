import axiosInstance from '../lib/axios';

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
  total: number;
  limit: number;
  offset: number;
}

export interface GetOrderResponse {
  order: Order;
}

export class OrderService {
  /**
   * Create a new order
   */
  static async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await axiosInstance.post<CreateOrderResponse>('/orders', orderData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.error || 'Failed to create order'
      );
    }
  }

  /**
   * Get all orders with pagination
   */
  static async getOrders(limit: number = 10, offset: number = 0): Promise<GetOrdersResponse> {
    try {
      const response = await axiosInstance.get<GetOrdersResponse>('/orders', {
        params: { limit, offset },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.error || 'Failed to fetch orders'
      );
    }
  }

  /**
   * Get a specific order by ID
   */
  static async getOrder(orderId: string): Promise<GetOrderResponse> {
    try {
      const response = await axiosInstance.get<GetOrderResponse>(`/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.error || 'Failed to fetch order'
      );
    }
  }
}

export const orderService = OrderService;
