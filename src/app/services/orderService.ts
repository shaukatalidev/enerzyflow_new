import axiosInstance from '../lib/axios';
import { AxiosError } from 'axios';

// ✅ Import shared constants and utilities from adminService
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  type OrderStatus,
  type PaymentStatus,
  adminService, // Import to reuse helper methods
} from './adminService';

// ==================== Order-Specific Types ====================

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
  history: OrderHistoryItem[];
}

// ✅ OPTIMIZATION: Constants for time calculations
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// ==================== Order Service ====================

class OrderService {
  /**
   * Get order tracking history
   * GET /orders/:id/tracking
   */
  async getOrderTracking(orderId: string): Promise<GetOrderTrackingResponse> {
    try {
      const response = await axiosInstance.get<GetOrderTrackingResponse>(
        `/orders/${orderId}/tracking`
      );
      return response.data;
    } catch (error) {
      console.error('❌ Order tracking fetch error:', error instanceof AxiosError ? error.response : error);
      throw this.handleError(error, 'Failed to fetch order tracking');
    }
  }

  /**
   * Create a new order
   * POST /orders/create
   */
  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await axiosInstance.post<CreateOrderResponse>('/orders/create', orderData);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create order:', error);
      throw this.handleError(error, 'Failed to create order');
    }
  }

  /**
 * Get all orders for the logged-in user's company
 * GET /orders/get-all?limit=10&offset=0
 */
  async getOrders(limit: number, offset: number): Promise<GetOrdersResponse>;
  async getOrders(params: PaginationParams): Promise<GetOrdersResponse>;
  async getOrders(
    limitOrParams: number | PaginationParams,
    offset?: number
  ): Promise<GetOrdersResponse> {
    try {
      let finalLimit: number;
      let finalOffset: number;

      if (typeof limitOrParams === 'object') {
        finalLimit = limitOrParams.limit || 10;
        finalOffset = limitOrParams.offset || 0;
      } else {
        finalLimit = limitOrParams;
        finalOffset = offset || 0;
      }

      const response = await axiosInstance.get<GetOrdersResponse>('/orders/get-all', {
        params: { limit: finalLimit, offset: finalOffset },
      });

      return response.data;
    } catch (error) {
      console.error('❌ Order service error:', error instanceof AxiosError ? error.response : error);
      throw this.handleError(error, 'Failed to fetch orders');
    }
  }

  /**
   * Get a single order by ID
   * GET /orders/:id
   */
  async getOrder(orderId: string): Promise<GetOrderResponse> {
    try {
      const response = await axiosInstance.get<GetOrderResponse>(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch order:', error);
      throw this.handleError(error, 'Failed to fetch order');
    }
  }

  /**
   * Upload payment screenshot for an order
   * POST /orders/:id/payment-screenshot
   */
  async uploadPaymentScreenshot(
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
      throw this.handleError(error, 'Failed to upload payment screenshot');
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Handle API errors consistently
   */
  private handleError(error: unknown, defaultMessage: string): Error {
    if (error instanceof AxiosError && error.response?.data) {
      const data = error.response.data as ApiErrorResponse;
      if (data.error) {
        return new Error(data.error);
      }
      if (data.message) {
        return new Error(data.message);
      }
    }

    if (error instanceof Error) {
      return new Error(error.message);
    }

    return new Error(defaultMessage);
  }

  // ✅ REMOVED DUPLICATION: Delegate to adminService for all formatting methods

  /**
   * Format order status for display
   * @deprecated Use adminService.formatOrderStatus() instead
   */
  formatOrderStatus(status: string): string {
    return adminService.formatOrderStatus(status);
  }

  /**
   * Format payment status for display
   * @deprecated Use adminService.formatPaymentStatus() instead
   */
  formatPaymentStatus(status: string): string {
    return adminService.formatPaymentStatus(status);
  }

  /**
   * Get order status color class
   * @deprecated Use adminService.getStatusColorClass() instead
   */
  getOrderStatusColor(status: string): string {
    return adminService.getStatusColorClass(status);
  }

  /**
   * Get payment status color class
   * @deprecated Use adminService.getPaymentStatusColorClass() instead
   */
  getPaymentStatusColor(status: string): string {
    return adminService.getPaymentStatusColorClass(status);
  }

  /**
   * Check if payment is verified
   * @deprecated Use adminService.isPaymentVerified() instead
   */
  isPaymentVerified(paymentStatus: string): boolean {
    return adminService.isPaymentVerified(paymentStatus);
  }

  /**
   * Check if payment is pending action
   * @deprecated Use adminService.isPaymentPending() instead
   */
  isPaymentPending(paymentStatus: string): boolean {
    return adminService.isPaymentPending(paymentStatus);
  }

  /**
   * Format date for display
   * @deprecated Use adminService.formatDate() instead
   */
  formatDate(dateString: string): string {
    return adminService.formatDate(dateString);
  }

  /**
   * Check if order is overdue
   * @deprecated Use adminService.isOrderOverdue() instead
   */
  isOrderOverdue(expectedDelivery: string): boolean {
    return adminService.isOrderOverdue(expectedDelivery);
  }

  /**
   * Get status progress percentage
   * @deprecated Use adminService.getStatusProgress() instead
   */
  getStatusProgress(status: string): number {
    return adminService.getStatusProgress(status);
  }

  // ✅ Order-specific methods (not in adminService)

  /**
   * Check if order can be edited (only placed orders)
   */
  canEditOrder(status: string): boolean {
    return status === ORDER_STATUS.PLACED;
  }

  /**
   * Check if payment can be uploaded
   */
  canUploadPayment(paymentStatus: string): boolean {
    return paymentStatus === PAYMENT_STATUS.PENDING;
  }

  /**
   * Calculate days until expected delivery
   */
  getDaysUntilDelivery(expectedDelivery: string): number {
    const expected = new Date(expectedDelivery);
    const now = new Date();
    const diffTime = expected.getTime() - now.getTime();
    return Math.ceil(diffTime / MS_PER_DAY);
  }

  /**
   * Check if order can be cancelled
   */
  canCancelOrder(status: string): boolean {
    return status === ORDER_STATUS.PLACED || status === ORDER_STATUS.PRINTING;
  }

  /**
   * Check if order is in terminal state
   */
  isTerminalStatus(status: string): boolean {
    return adminService.isTerminalStatus(status);
  }

  /**
   * Get order status badge color (alias for consistency)
   */
  getStatusBadgeColor(status: string): string {
    return this.getOrderStatusColor(status);
  }

  /**
   * Get payment status badge color (alias for consistency)
   */
  getPaymentBadgeColor(paymentStatus: string): string {
    return this.getPaymentStatusColor(paymentStatus);
  }
}

// ✅ Export singleton instance
export const orderService = new OrderService();
export default orderService;

// ✅ Re-export constants from adminService for convenience
export { ORDER_STATUS, PAYMENT_STATUS };
