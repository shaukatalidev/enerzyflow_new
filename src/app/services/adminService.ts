import axiosInstance from '../lib/axios';

export const PAYMENT_STATUS = {
  PENDING: 'payment_pending',
  UPLOADED: 'payment_uploaded',
  VERIFIED: 'payment_verified',
  REJECTED: 'payment_rejected',
} as const;

export const ORDER_STATUS = {
  PLACED: 'placed',
  PRINTING: 'printing',
  DECLINED: 'declined',
  READY_FOR_PLANT: 'ready_for_plant',
  PLANT_PROCESSING: 'plant_processing',
  DISPATCHED: 'dispatched',
  COMPLETED: 'completed',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export interface User {
  UserID: string;
  Email: string;
  Name: string;
  Phone: string | null;
  Designation: string;
  Role: string;
  ProfileURL: string;
}

export interface AllUsersResponse {
  users: User[];
}

export interface CreateUserRequest {
  email: string;
  role: 'printing' | 'plant';
}

export interface CreateUserResponse {
  message: string;
  user: User;
}

export interface OrderStatusUpdateRequest {
  status: string;
  reason?: string;
}

export interface PaymentStatusUpdateRequest {
  status: 'payment_verified' | 'payment_rejected';
  reason?: string;
}

export interface OrderStatusUpdateResponse {
  message: string;
}

export interface PaymentStatusUpdateResponse {
  message: string;
}

export interface AllOrderModel {
  order_id: string;
  company_id: string;
  company_name: string;
  label_id: string;
  label_url: string;
  variant: string;
  qty: number;
  cap_color: string;
  volume: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  decline_reason: string;
  payment_url: string;
  invoice_url: string;
  expected_delivery: string;
  created_at: string;
  updated_at: string;
  user_name: string;
}

export interface AllOrdersResponse {
  orders: AllOrderModel[];
  count: number;
}

export interface OrderTrackingResponse {
  order_id: string;
  status: string;
  history: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  status: string;
  changed_at: string;
  changed_by?: string;
  reason?: string;
}

export interface UploadInvoiceResponse {
  message: string;
  url: string;
}

// ==================== Admin Service ====================

class AdminService {
  // ==================== User Management ====================

  /**
   * Get all users (Admin only)
   * GET /users/all
   */
  async getAllUsers(): Promise<AllUsersResponse> {
    try {
      const response = await axiosInstance.get<AllUsersResponse>('/users/all');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch all users:', error);
      throw this.handleError(error, 'Failed to load users');
    }
  }

  /**
   * Create a new user (Admin only)
   * POST /users/create
   */
  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      const response = await axiosInstance.post<CreateUserResponse>(
        '/users/create',
        data
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create user:', error);
      throw this.handleError(error, 'Failed to create user');
    }
  }

  // ==================== Order Management ====================

  /**
   * Get all orders across all users (Admin only)
   * GET /orders/get-all-orders?limit=10&offset=0
   */
  async getAllOrders(limit: number = 100, offset: number = 0): Promise<AllOrdersResponse> {
    try {
      const response = await axiosInstance.get<AllOrdersResponse>(
        '/orders/get-all-orders',
        {
          params: { limit, offset }
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch all orders:', error);
      throw this.handleError(error, 'Failed to load orders');
    }
  }

  /**
   * Update order status (Admin/Printing/Plant role)
   * PUT /orders/:id/status
   * 
   * ⚠️ IMPORTANT: If status is 'declined', the 'reason' field is REQUIRED
   */
  async updateOrderStatus(
    orderId: string,
    status: string,
    reason?: string
  ): Promise<OrderStatusUpdateResponse> {
    try {
      if (status === ORDER_STATUS.DECLINED && !reason) {
        throw new Error('Reason is required for declined status');
      }

      const requestData: OrderStatusUpdateRequest = { status };
      if (reason) {
        requestData.reason = reason;
      }

      const response = await axiosInstance.put<OrderStatusUpdateResponse>(
        `/orders/${orderId}/status`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update order status:', error);
      throw this.handleError(error, 'Failed to update order status');
    }
  }

  /**
   * Update payment status (Admin only)
   * PUT /orders/:id/payment
   * 
   * ⚠️ IMPORTANT: 
   * - Only accepts 'payment_verified' or 'payment_rejected'
   * - If status is 'payment_rejected', the 'reason' field is REQUIRED
   */
  async updatePaymentStatus(
    orderId: string,
    status: 'payment_verified' | 'payment_rejected',
    reason?: string
  ): Promise<PaymentStatusUpdateResponse> {
    try {
      if (status === 'payment_rejected' && !reason) {
        throw new Error('Reason is required for rejected payments');
      }

      if (status !== 'payment_verified' && status !== 'payment_rejected') {
        throw new Error('Invalid payment status. Must be either payment_verified or payment_rejected');
      }

      const requestData: PaymentStatusUpdateRequest = { status };
      if (reason) {
        requestData.reason = reason;
      }

      const response = await axiosInstance.put<PaymentStatusUpdateResponse>(
        `/orders/${orderId}/payment`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update payment status:', error);
      throw this.handleError(error, 'Failed to update payment status');
    }
  }

  /**
   * Get order tracking history
   * GET /orders/:id/tracking
   */
  async getOrderTracking(orderId: string): Promise<OrderTrackingResponse> {
    try {
      const response = await axiosInstance.get<OrderTrackingResponse>(
        `/orders/${orderId}/tracking`
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch order tracking:', error);
      throw this.handleError(error, 'Failed to load order tracking');
    }
  }

  /**
   * Upload invoice for order (Admin only)
   * POST /orders/:id/upload-invoice
   */
  async uploadInvoice(orderId: string, file: File): Promise<UploadInvoiceResponse> {
    try {
      const formData = new FormData();
      formData.append('invoice', file);

      const response = await axiosInstance.post<UploadInvoiceResponse>(
        `/orders/${orderId}/upload-invoice`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to upload invoice:', error);
      throw this.handleError(error, 'Failed to upload invoice');
    }
  }

  // ==================== Helper Methods ====================

  private handleError(error: unknown, defaultMessage: string): Error {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response
    ) {
      const data = error.response.data as { error?: string; message?: string };

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

  isAdmin(role: string): boolean {
    return role === 'admin';
  }

  canManageOrders(role: string): boolean {
    return role === 'admin' || role === 'printing';
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  requiresReason(status: string): boolean {
    return status === ORDER_STATUS.DECLINED || status === PAYMENT_STATUS.REJECTED;
  }

  /**
   * Format order status for display
   * ✅ Updated without ready_for_dispatch
   */
  formatOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      [ORDER_STATUS.PLACED]: 'Placed',
      [ORDER_STATUS.PRINTING]: 'Printing',
      [ORDER_STATUS.DECLINED]: 'Declined',
      [ORDER_STATUS.READY_FOR_PLANT]: 'Ready for Plant',
      [ORDER_STATUS.PLANT_PROCESSING]: 'Plant Processing',
      [ORDER_STATUS.DISPATCHED]: 'Dispatched',
      [ORDER_STATUS.COMPLETED]: 'Completed',
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }

  /**
   * Format payment status for display
   */
  formatPaymentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      [PAYMENT_STATUS.PENDING]: 'Payment Pending',
      [PAYMENT_STATUS.UPLOADED]: 'Payment Uploaded',
      [PAYMENT_STATUS.VERIFIED]: 'Payment Verified',
      [PAYMENT_STATUS.REJECTED]: 'Payment Rejected',
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }

  /**
   * Get status color class for UI
   * ✅ Updated without ready_for_dispatch
   */
  getStatusColorClass(status: string): string {
    const colorMap: Record<string, string> = {
      [ORDER_STATUS.PLACED]: 'bg-purple-100 text-purple-700',
      [ORDER_STATUS.PRINTING]: 'bg-blue-100 text-blue-700',
      [ORDER_STATUS.DECLINED]: 'bg-red-100 text-red-700',
      [ORDER_STATUS.READY_FOR_PLANT]: 'bg-yellow-100 text-yellow-700',
      [ORDER_STATUS.PLANT_PROCESSING]: 'bg-orange-100 text-orange-700',
      [ORDER_STATUS.DISPATCHED]: 'bg-cyan-100 text-cyan-700',
      [ORDER_STATUS.COMPLETED]: 'bg-green-100 text-green-700',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  }

  /**
   * Get payment status badge color
   */
  getPaymentStatusColorClass(paymentStatus: string): string {
    const colorMap: Record<string, string> = {
      [PAYMENT_STATUS.PENDING]: 'bg-amber-100 text-amber-700',
      [PAYMENT_STATUS.UPLOADED]: 'bg-indigo-100 text-indigo-700',
      [PAYMENT_STATUS.VERIFIED]: 'bg-teal-100 text-teal-700',
      [PAYMENT_STATUS.REJECTED]: 'bg-red-100 text-red-700',
    };
    return colorMap[paymentStatus] || 'bg-gray-100 text-gray-700';
  }

  /**
   * Validate order status transition
   * ✅ Updated flow: plant_processing → dispatched (no ready_for_dispatch)
   */
  isValidStatusTransition(currentStatus: string, newStatus: string, userRole: string): boolean {
    const allowedTransitions: Record<string, string[]> = {
      [ORDER_STATUS.PLACED]: [ORDER_STATUS.PRINTING, ORDER_STATUS.DECLINED],
      [ORDER_STATUS.PRINTING]: [ORDER_STATUS.DECLINED, ORDER_STATUS.READY_FOR_PLANT],
      [ORDER_STATUS.READY_FOR_PLANT]: [ORDER_STATUS.PLANT_PROCESSING],
      [ORDER_STATUS.PLANT_PROCESSING]: [ORDER_STATUS.DISPATCHED],
      [ORDER_STATUS.DISPATCHED]: [ORDER_STATUS.COMPLETED],
    };

    if (userRole === 'admin') {
      return true;
    }

    if (userRole === 'printing') {
      const allowed = allowedTransitions[currentStatus] || [];
      return allowed.includes(newStatus);
    }

    if (userRole === 'plant') {
      const allowed = allowedTransitions[currentStatus] || [];
      return allowed.includes(newStatus);
    }

    return false;
  }

  /**
   * Check if payment is verified
   */
  isPaymentVerified(paymentStatus: string): boolean {
    return paymentStatus === PAYMENT_STATUS.VERIFIED;
  }

  /**
   * Check if payment is pending
   */
  isPaymentPending(paymentStatus: string): boolean {
    return paymentStatus === PAYMENT_STATUS.PENDING || paymentStatus === PAYMENT_STATUS.UPLOADED;
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * Calculate order age in days
   */
  getOrderAgeDays(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if order is overdue
   */
  isOrderOverdue(expectedDelivery: string): boolean {
    const expected = new Date(expectedDelivery);
    const now = new Date();
    return now > expected;
  }

  /**
   * Get all valid order statuses as array
   */
  getAllOrderStatuses(): string[] {
    return Object.values(ORDER_STATUS);
  }

  /**
   * Get all valid payment statuses as array
   */
  getAllPaymentStatuses(): string[] {
    return Object.values(PAYMENT_STATUS);
  }

  /**
 * Check if status is a terminal state
 */
  isTerminalStatus(status: string): boolean {
    return status === ORDER_STATUS.COMPLETED || status === ORDER_STATUS.DECLINED;
  }


  /**
   * Get the next logical status in the workflow
   */
  getNextStatus(currentStatus: string, userRole: string): string | null {
    const transitions: Record<string, Record<string, string>> = {
      admin: {
        [ORDER_STATUS.PLACED]: ORDER_STATUS.PRINTING,
        [ORDER_STATUS.PRINTING]: ORDER_STATUS.READY_FOR_PLANT,
        [ORDER_STATUS.READY_FOR_PLANT]: ORDER_STATUS.PLANT_PROCESSING,
        [ORDER_STATUS.PLANT_PROCESSING]: ORDER_STATUS.DISPATCHED,
        [ORDER_STATUS.DISPATCHED]: ORDER_STATUS.COMPLETED,
      },
      printing: {
        [ORDER_STATUS.PLACED]: ORDER_STATUS.PRINTING,
        [ORDER_STATUS.PRINTING]: ORDER_STATUS.READY_FOR_PLANT,
      },
      plant: {
        [ORDER_STATUS.READY_FOR_PLANT]: ORDER_STATUS.PLANT_PROCESSING,
        [ORDER_STATUS.PLANT_PROCESSING]: ORDER_STATUS.DISPATCHED,
      },
    };

    return transitions[userRole]?.[currentStatus] || null;
  }

  /**
   * Get status progress percentage
   */
  getStatusProgress(status: string): number {
    const progressMap: Record<string, number> = {
      [ORDER_STATUS.PLACED]: 0,
      [ORDER_STATUS.PRINTING]: 20,
      [ORDER_STATUS.READY_FOR_PLANT]: 40,
      [ORDER_STATUS.PLANT_PROCESSING]: 60,
      [ORDER_STATUS.DISPATCHED]: 80,
      [ORDER_STATUS.COMPLETED]: 100,
      [ORDER_STATUS.DECLINED]: 0,
    };
    return progressMap[status] || 0;
  }
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;
