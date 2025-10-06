// app/services/adminService.ts

import axiosInstance from '../lib/axios';

// ==================== Types (Fixed to match backend response) ====================

export interface User {
  UserID: string;        // ✅ Changed from user_id
  Email: string;         // ✅ Changed from email
  Name: string;          // ✅ Changed from name
  Phone: string | null;  // ✅ Changed from phone?
  Designation: string;   // ✅ Changed from designation
  Role: string;          // ✅ Changed from role
  ProfileURL: string;    // ✅ Changed from profile_url
}

export interface AllUsersResponse {
  users: User[];
}

export interface CreateUserRequest {
  email: string;  // ✅ Request body is lowercase
  role: 'printing' | 'plant';
}

export interface CreateUserResponse {
  message: string;
  user: User;  // ✅ Response contains PascalCase User
}

export interface OrderStatusUpdateRequest {
  status: string;
  reason?: string;  // ✅ Required when status is 'declined' or 'payment_rejected'
}

export interface OrderStatusUpdateResponse {
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
  status: string;
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
  tracking_history: OrderStatusHistory[];
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
      console.log('👥 Fetching all users...');
      const response = await axiosInstance.get<AllUsersResponse>('/users/all');
      console.log('✅ Fetched users:', response.data.users?.length || 0);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch all users:', error);
      throw this.handleError(error, 'Failed to load users');
    }
  }

  /**
   * Create a new user (Admin only)
   * POST /users/create
   * 
   * Request: { email: string, role: 'printing' | 'plant' }
   * Response: { message: string, user: User }
   */
  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      console.log('➕ Creating new user:', data.email);
      const response = await axiosInstance.post<CreateUserResponse>(
        '/users/create',
        data
      );
      console.log('✅ User created successfully:', response.data.user.UserID);
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
      console.log('📦 Fetching all orders (limit:', limit, 'offset:', offset, ')');
      const response = await axiosInstance.get<AllOrdersResponse>(
        '/orders/get-all-orders',
        {
          params: { limit, offset }
        }
      );
      console.log('✅ Fetched orders:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch all orders:', error);
      throw this.handleError(error, 'Failed to load orders');
    }
  }

  /**
   * Update order status (Admin/Printing role)
   * PUT /orders/:id/status
   * 
   * ⚠️ IMPORTANT: If status is 'declined' or 'payment_rejected', 
   * the 'reason' field is REQUIRED
   * 
   * Request: { status: string, reason?: string }
   * Response: { message: string }
   */
  async updateOrderStatus(
    orderId: string,
    status: string,
    reason?: string
  ): Promise<OrderStatusUpdateResponse> {
    try {
      // ✅ Validate required reason for declined/payment_rejected
      if ((status === 'declined' || status === 'payment_rejected') && !reason) {
        throw new Error('Reason is required for declined or payment rejected status');
      }

      console.log('🔄 Updating order status:', orderId, '→', status);
      
      const requestData: OrderStatusUpdateRequest = { status };
      if (reason) {
        requestData.reason = reason;
      }

      const response = await axiosInstance.put<OrderStatusUpdateResponse>(
        `/orders/${orderId}/status`,
        requestData
      );
      console.log('✅ Order status updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update order status:', error);
      throw this.handleError(error, 'Failed to update order status');
    }
  }

  /**
   * Get order tracking history
   * GET /orders/:id/tracking
   */
  async getOrderTracking(orderId: string): Promise<OrderTrackingResponse> {
    try {
      console.log('📍 Fetching order tracking for:', orderId);
      const response = await axiosInstance.get<OrderTrackingResponse>(
        `/orders/${orderId}/tracking`
      );
      console.log('✅ Order tracking fetched');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch order tracking:', error);
      throw this.handleError(error, 'Failed to load order tracking');
    }
  }

  /**
   * Upload invoice for order (Admin only)
   * POST /orders/:id/upload-invoice
   * 
   * FormData with key: 'invoice'
   * Response: { message: string, url: string }
   */
  async uploadInvoice(orderId: string, file: File): Promise<UploadInvoiceResponse> {
    try {
      console.log('📄 Uploading invoice for order:', orderId);
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
      console.log('✅ Invoice uploaded successfully:', response.data.url);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to upload invoice:', error);
      throw this.handleError(error, 'Failed to upload invoice');
    }
  }

  // ==================== Helper Methods ====================

  private handleError(error: unknown, defaultMessage: string): Error {
  // Check if error is an axios error with response data
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

  // Check if error is a standard Error object
  if (error instanceof Error) {
    return new Error(error.message);
  }

  return new Error(defaultMessage);
}

  /**
   * Check if user has admin role
   */
  isAdmin(role: string): boolean {
    return role === 'admin';
  }

  /**
   * Check if user can manage orders
   */
  canManageOrders(role: string): boolean {
    return role === 'admin' || role === 'printing';
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if status requires reason field
   */
  requiresReason(status: string): boolean {
    return status === 'declined' || status === 'payment_rejected';
  }

  /**
   * Format order status for display
   */
  formatOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'placed': 'Placed',
      'payment_uploaded': 'Payment Uploaded',
      'payment_verified': 'Payment Verified',
      'processing': 'Processing',
      'printing': 'Printing',
      'dispatch': 'Dispatched',
      'dispatched': 'Dispatched',
      'delivered': 'Delivered',
      'declined': 'Declined',
      'cancelled': 'Cancelled',
      'payment_rejected': 'Payment Rejected',
    };
    return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1);
  }

  /**
   * Get status color class for UI
   */
  getStatusColorClass(status: string): string {
    const colorMap: Record<string, string> = {
      'placed': 'bg-purple-100 text-purple-700',
      'payment_uploaded': 'bg-indigo-100 text-indigo-700',
      'payment_verified': 'bg-teal-100 text-teal-700',
      'processing': 'bg-orange-100 text-orange-700',
      'printing': 'bg-blue-100 text-blue-700',
      'dispatch': 'bg-cyan-100 text-cyan-700',
      'dispatched': 'bg-cyan-100 text-cyan-700',
      'delivered': 'bg-green-100 text-green-700',
      'declined': 'bg-red-100 text-red-700',
      'cancelled': 'bg-gray-100 text-gray-700',
      'payment_rejected': 'bg-red-100 text-red-700',
    };
    return colorMap[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
  }

  /**
   * Validate order status transition
   */
  isValidStatusTransition(currentStatus: string, newStatus: string, userRole: string): boolean {
    const allowedTransitions: Record<string, string[]> = {
      'placed': ['payment_uploaded', 'processing', 'declined'],
      'payment_uploaded': ['payment_verified', 'processing', 'declined', 'payment_rejected'],
      'payment_verified': ['processing'],
      'processing': ['printing', 'declined'],
      'printing': ['dispatched', 'dispatch'],
      'dispatched': ['delivered'],
      'dispatch': ['delivered'],
    };

    // Admin can do any transition
    if (userRole === 'admin') {
      return true;
    }

    // Printing role has limited transitions
    if (userRole === 'printing') {
      const allowed = allowedTransitions[currentStatus.toLowerCase()] || [];
      return allowed.includes(newStatus.toLowerCase());
    }

    return false;
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
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;
