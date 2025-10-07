// app/services/orderService.ts

import axiosInstance from '../lib/axios';
import { AxiosError } from 'axios';
// ✅ Import shared types and constants from adminService
import type { 
  OrderStatus,
  PaymentStatus 
} from './adminService';

// ==================== Order-Specific Types ====================

export interface CreateOrderRequest {
  label_id: string;
  variant: string;
  qty: number;
  cap_color: string;
  volume: number;
}

// ✅ Updated to match backend response exactly
export interface Order {
  order_id: string;
  company_id: string;
  label_url: string;
  variant: string;
  qty: number;
  cap_color: string;
  volume: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  decline_reason: string;
  payment_url: string;
  invoice_url: string;
  expected_delivery: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export interface GetOrdersResponse {
  orders: Order[];
  count: number;      
  has_more: boolean;  
}


export interface GetOrderResponse {
  order: Order;
}

export interface UploadPaymentScreenshotResponse {
  message: string;
  url: string;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface OrderHistoryItem {
  status: string;
  changed_at: string;
  changed_by?: string;
  reason?: string;
}

export interface GetOrderTrackingResponse {
  order_id: string;
  status: string;
  tracking_history: OrderHistoryItem[];
}

// ==================== Order Service ====================

export class OrderService {
  /**
   * Get order tracking history
   * GET /orders/:id/tracking
   */
  static async getOrderTracking(orderId: string): Promise<GetOrderTrackingResponse> {
    try {
      const response = await axiosInstance.get<GetOrderTrackingResponse>(
        `/orders/${orderId}/tracking`
      );
      return response.data;
    } catch (error) {
      console.error('❌ Order tracking fetch error:', error instanceof AxiosError ? error.response : error);

      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || errorData.message || 'Failed to fetch order tracking');
      }
      throw new Error('Failed to fetch order tracking');
    }
  }

  /**
   * Create a new order
   * POST /orders/create
   */
  static async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await axiosInstance.post<CreateOrderResponse>('/orders/create', orderData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || errorData.message || 'Failed to create order');
      }
      throw new Error('Failed to create order');
    }
  }

  /**
   * Get all orders for the logged-in user's company
   * GET /orders/get-all?limit=10&offset=0
   */
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

      return response.data;
    } catch (error) {
      console.error('❌ Order service error:', error instanceof AxiosError ? error.response : error);

      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || errorData.message || 'Failed to fetch orders');
      }
      throw new Error('Failed to fetch orders');
    }
  }

  /**
   * Get a single order by ID
   * GET /orders/:id
   */
  static async getOrder(orderId: string): Promise<GetOrderResponse> {
    try {
      const response = await axiosInstance.get<GetOrderResponse>(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || errorData.message || 'Failed to fetch order');
      }
      throw new Error('Failed to fetch order');
    }
  }

  /**
   * Upload payment screenshot for an order
   * POST /orders/:id/payment-screenshot
   */
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
        throw new Error(errorData.error || errorData.message || 'Failed to upload payment screenshot');
      }
      throw new Error('Failed to upload payment screenshot');
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Format order status for display
   */
  static formatOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      placed: 'Placed',
      printing: 'Printing',
      declined: 'Declined',
      ready_for_plant: 'Ready for Plant',
      plant_processing: 'Plant Processing',
      dispatched: 'Dispatched',
      completed: 'Completed',
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }

  /**
   * Format payment status for display
   */
  static formatPaymentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      payment_pending: 'Payment Pending',
      payment_uploaded: 'Payment Uploaded',
      payment_verified: 'Payment Verified',
      payment_rejected: 'Payment Rejected',
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }

  /**
   * Get order status color class
   */
  static getOrderStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      placed: 'bg-purple-100 text-purple-700',
      printing: 'bg-blue-100 text-blue-700',
      declined: 'bg-red-100 text-red-700',
      ready_for_plant: 'bg-yellow-100 text-yellow-700',
      plant_processing: 'bg-orange-100 text-orange-700',
      dispatched: 'bg-cyan-100 text-cyan-700',
      completed: 'bg-green-100 text-green-700',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  }

  /**
   * Get payment status color class
   */
  static getPaymentStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      payment_pending: 'bg-amber-100 text-amber-700',
      payment_uploaded: 'bg-indigo-100 text-indigo-700',
      payment_verified: 'bg-teal-100 text-teal-700',
      payment_rejected: 'bg-red-100 text-red-700',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  }

  /**
   * Check if payment is verified
   */
  static isPaymentVerified(paymentStatus: string): boolean {
    return paymentStatus === 'payment_verified';
  }

  /**
   * Check if payment is pending action
   */
  static isPaymentPending(paymentStatus: string): boolean {
    return paymentStatus === 'payment_pending' || paymentStatus === 'payment_uploaded';
  }

  /**
   * Check if order can be edited
   */
  static canEditOrder(status: string): boolean {
    return status === 'placed';
  }

  /**
   * Check if payment can be uploaded
   */
  static canUploadPayment(paymentStatus: string): boolean {
    return paymentStatus === 'payment_pending';
  }

  /**
   * Format date for display
   */
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * Calculate days until expected delivery
   */
  static getDaysUntilDelivery(expectedDelivery: string): number {
    const expected = new Date(expectedDelivery);
    const now = new Date();
    const diffTime = expected.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if order is overdue
   */
  static isOrderOverdue(expectedDelivery: string): boolean {
    const expected = new Date(expectedDelivery);
    const now = new Date();
    return now > expected;
  }

  /**
   * Get status progress percentage (for progress bars)
   */
  static getStatusProgress(status: string): number {
    const progressMap: Record<string, number> = {
      placed: 0,
      printing: 20,
      ready_for_plant: 40,
      plant_processing: 60,
      dispatched: 80,
      completed: 100,
      declined: 0,
    };
    return progressMap[status] || 0;
  }
}

export const orderService = OrderService;
