import axiosInstance from '../lib/axios';

// ✅ Constants remain the same
export const PAYMENT_STATUS = {
  PENDING: 'payment_pending',
  UPLOADED: 'payment_uploaded',
  VERIFIED: 'payment_verified',
  REJECTED: 'payment_rejected',
} as const;

export const ORDER_STATUS = {
  PLACED: 'placed',
  ACCEPTED: 'accepted',
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

// ✅ Label Details nested structure
export interface OrderLabelDetails {
  id: number;
  order_id: string;
  no_of_sheets: number;
  cutting_type: string;
  labels_per_sheet: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}

// ✅ Assignment structure
export interface OrderAssignment {
  order_id: string;
  user_id: string;
  role: string;
  assigned_at: string;
  deadline: string;
  completed_at: {
    Time: string;
    Valid: boolean;
  };
}

// ✅ Comment interfaces
export interface OrderComment {
  id: number;
  order_id: string;
  user_id: string;
  role: string;
  comment: string;
  created_at: string;
}

// ✅ UPDATED: AllOrderModel with optional nested data
export interface AllOrderModel {
  order_id: string;
  user_id: string;
  company_id?: string;
  company_name?: string;
  label_id: string;
  label_url?: string;
  variant: string;
  qty: number;
  cap_color: string;
  volume: number | string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  decline_reason: string;
  payment_url: string;
  invoice_url?: string;
  pi_url?: string;
  expected_delivery: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  user_name: string;

  // ✅ Optional nested data
  label_details?: OrderLabelDetails | null;
  assignments?: OrderAssignment[];
  comments?: OrderComment[];
}

// ✅ NEW: Complete order detail response (from admin endpoint)
export interface OrderDetailResponse {
  order_id: string;
  user_id: string;
  label_url: string;
  variant: string;
  qty: number;
  cap_color: string;
  volume: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_url: string;
  invoice_url: string;
  pi_url: string;
  decline_reason: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  expected_delivery: string;
  label_details: OrderLabelDetails | null;
  assignments: OrderAssignment[];
  comments: OrderComment[];
}

export interface GetOrderDetailResponse {
  order: OrderDetailResponse;
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
  urls: {
    invoice_url: string;
    pi_url: string;
  };
}

export interface AddCommentRequest {
  comment: string;
}

export interface AddCommentResponse {
  message: string;
}

export interface GetCommentsResponse {
  comments: OrderComment[];
}

// ✅ Label Details request/response interfaces
export interface SaveLabelDetailsRequest {
  no_of_sheets: number;
  cutting_type: string;
  labels_per_sheet: number;
  description: string;
}

export interface SaveLabelDetailsResponse {
  message: string;
}


// ✅ OPTIMIZATION: Move constant maps outside class
const STATUS_DISPLAY_MAP: Record<string, string> = {
  [ORDER_STATUS.PLACED]: 'Placed',
  [ORDER_STATUS.ACCEPTED]: 'Accepted',
  [ORDER_STATUS.PRINTING]: 'Printing',
  [ORDER_STATUS.DECLINED]: 'Declined',
  [ORDER_STATUS.READY_FOR_PLANT]: 'Ready for Plant',
  [ORDER_STATUS.PLANT_PROCESSING]: 'Plant Processing',
  [ORDER_STATUS.DISPATCHED]: 'Dispatched',
  [ORDER_STATUS.COMPLETED]: 'Completed',
};

const PAYMENT_DISPLAY_MAP: Record<string, string> = {
  [PAYMENT_STATUS.PENDING]: 'Payment Pending',
  [PAYMENT_STATUS.UPLOADED]: 'Payment Uploaded',
  [PAYMENT_STATUS.VERIFIED]: 'Payment Verified',
  [PAYMENT_STATUS.REJECTED]: 'Payment Rejected',
};

const STATUS_COLOR_MAP: Record<string, string> = {
  [ORDER_STATUS.PLACED]: 'bg-purple-100 text-purple-700',
  [ORDER_STATUS.ACCEPTED]: 'bg-green-100 text-green-700',
  [ORDER_STATUS.PRINTING]: 'bg-blue-100 text-blue-700',
  [ORDER_STATUS.DECLINED]: 'bg-red-100 text-red-700',
  [ORDER_STATUS.READY_FOR_PLANT]: 'bg-yellow-100 text-yellow-700',
  [ORDER_STATUS.PLANT_PROCESSING]: 'bg-orange-100 text-orange-700',
  [ORDER_STATUS.DISPATCHED]: 'bg-cyan-100 text-cyan-700',
  [ORDER_STATUS.COMPLETED]: 'bg-green-100 text-green-700',
};

const PAYMENT_COLOR_MAP: Record<string, string> = {
  [PAYMENT_STATUS.PENDING]: 'bg-amber-100 text-amber-700',
  [PAYMENT_STATUS.UPLOADED]: 'bg-indigo-100 text-indigo-700',
  [PAYMENT_STATUS.VERIFIED]: 'bg-teal-100 text-teal-700',
  [PAYMENT_STATUS.REJECTED]: 'bg-red-100 text-red-700',
};

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  [ORDER_STATUS.PLACED]: [ORDER_STATUS.ACCEPTED, ORDER_STATUS.DECLINED],
  [ORDER_STATUS.ACCEPTED]: [ORDER_STATUS.PRINTING, ORDER_STATUS.DECLINED],
  [ORDER_STATUS.PRINTING]: [ORDER_STATUS.DECLINED, ORDER_STATUS.READY_FOR_PLANT],
  [ORDER_STATUS.READY_FOR_PLANT]: [ORDER_STATUS.PLANT_PROCESSING],
  [ORDER_STATUS.PLANT_PROCESSING]: [ORDER_STATUS.DISPATCHED],
  [ORDER_STATUS.DISPATCHED]: [ORDER_STATUS.COMPLETED],
};

// ✅ UPDATED: Admin can only update dispatched, completed, declined
const ROLE_TRANSITIONS: Record<string, Record<string, string>> = {
  printing: {
    [ORDER_STATUS.PLACED]: ORDER_STATUS.ACCEPTED,
    [ORDER_STATUS.ACCEPTED]: ORDER_STATUS.PRINTING,
    [ORDER_STATUS.PRINTING]: ORDER_STATUS.READY_FOR_PLANT,
  },
  plant: {
    [ORDER_STATUS.READY_FOR_PLANT]: ORDER_STATUS.PLANT_PROCESSING,
    [ORDER_STATUS.PLANT_PROCESSING]: ORDER_STATUS.DISPATCHED,
  },
};

const STATUS_PROGRESS_MAP: Record<string, number> = {
  [ORDER_STATUS.PLACED]: 0,
  [ORDER_STATUS.ACCEPTED]: 10,
  [ORDER_STATUS.PRINTING]: 20,
  [ORDER_STATUS.READY_FOR_PLANT]: 40,
  [ORDER_STATUS.PLANT_PROCESSING]: 60,
  [ORDER_STATUS.DISPATCHED]: 80,
  [ORDER_STATUS.COMPLETED]: 100,
  [ORDER_STATUS.DECLINED]: 0,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

class AdminService {
  // ==================== User Management ====================

  async getAllUsers(): Promise<AllUsersResponse> {
    try {
      const response = await axiosInstance.get<AllUsersResponse>('/users/all');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch all users:', error);
      throw this.handleError(error, 'Failed to load users');
    }
  }

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      const response = await axiosInstance.post<CreateUserResponse>('/users/create', data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create user:', error);
      throw this.handleError(error, 'Failed to create user');
    }
  }

  // ==================== Order Management ====================

  async getAllOrders(limit: number = 100, offset: number = 0): Promise<AllOrdersResponse> {
    try {
      const response = await axiosInstance.get<AllOrdersResponse>('/orders/get-all-orders', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch all orders:', error);
      throw this.handleError(error, 'Failed to load orders');
    }
  }

  /**
   * ✅ NEW: Get complete order details (admin only)
   * GET /orders/:id/detail
   * This endpoint returns everything in one call:
   * - Order details
   * - Label details
   * - Assignments
   * - Comments
   */
  async getOrderDetail(orderId: string): Promise<OrderDetailResponse> {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      const response = await axiosInstance.get<GetOrderDetailResponse>(
        `/orders/${orderId}/detail`
      );
      return response.data.order;
    } catch (error) {
      console.error('❌ Failed to fetch order detail:', error);
      throw this.handleError(error, 'Failed to fetch order details');
    }
  }

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

  async getOrderTracking(orderId: string): Promise<OrderTrackingResponse> {
    try {
      const response = await axiosInstance.get<OrderTrackingResponse>(`/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch order tracking:', error);
      throw this.handleError(error, 'Failed to load order tracking');
    }
  }

  async uploadInvoiceAndPI(
    orderId: string,
    invoiceFile: File,
    piFile: File
  ): Promise<UploadInvoiceResponse> {
    try {
      const formData = new FormData();
      formData.append('invoice', invoiceFile);
      formData.append('pi', piFile);

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
      console.error('❌ Failed to upload invoice and PI:', error);
      throw this.handleError(error, 'Failed to upload documents');
    }
  }

  async uploadInvoiceOnly(orderId: string, invoiceFile: File): Promise<UploadInvoiceResponse> {
    try {
      const formData = new FormData();
      formData.append('invoice', invoiceFile);

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

  async uploadPIOnly(orderId: string, piFile: File): Promise<UploadInvoiceResponse> {
    try {
      const formData = new FormData();
      formData.append('pi', piFile);

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
      console.error('❌ Failed to upload PI:', error);
      throw this.handleError(error, 'Failed to upload proforma invoice');
    }
  }

  // ==================== Order Comments ====================

  async addOrderComment(
    orderId: string,
    comment: string
  ): Promise<AddCommentResponse> {
    try {
      if (!comment || !comment.trim()) {
        throw new Error('Comment cannot be empty');
      }

      const requestData: AddCommentRequest = { comment };

      const response = await axiosInstance.post<AddCommentResponse>(
        `/orders/${orderId}/comment`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to add comment:', error);
      throw this.handleError(error, 'Failed to add comment');
    }
  }

  async getOrderComments(orderId: string): Promise<GetCommentsResponse> {
    try {
      const response = await axiosInstance.get<GetCommentsResponse>(
        `/orders/${orderId}/comment`
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch comments:', error);
      throw this.handleError(error, 'Failed to fetch comments');
    }
  }

  // ==================== Order Label Details ====================

  async saveOrderLabelDetails(
    orderId: string,
    labelDetails: SaveLabelDetailsRequest
  ): Promise<SaveLabelDetailsResponse> {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      if (!labelDetails.no_of_sheets || labelDetails.no_of_sheets <= 0) {
        throw new Error('Number of sheets must be greater than 0');
      }

      if (!labelDetails.cutting_type || !labelDetails.cutting_type.trim()) {
        throw new Error('Cutting type is required');
      }

      if (!labelDetails.labels_per_sheet || labelDetails.labels_per_sheet <= 0) {
        throw new Error('Labels per sheet must be greater than 0');
      }

      const response = await axiosInstance.post<SaveLabelDetailsResponse>(
        `/orders/${orderId}/label`,
        labelDetails
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to save label details:', error);
      throw this.handleError(error, 'Failed to save label details');
    }
  }

  async getOrderLabelDetails(orderId: string): Promise<OrderLabelDetails | null> {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      const response = await axiosInstance.get<OrderLabelDetails>(
        `/orders/${orderId}/label`
      );
      return response.data;
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response &&
        error.response.status === 404
      ) {
        return null;
      }

      console.error('❌ Failed to fetch label details:', error);
      throw this.handleError(error, 'Failed to fetch label details');
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
    return EMAIL_REGEX.test(email);
  }

  requiresReason(status: string): boolean {
    return status === ORDER_STATUS.DECLINED || status === PAYMENT_STATUS.REJECTED;
  }

  formatOrderStatus(status: string): string {
    return STATUS_DISPLAY_MAP[status] ||
      status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }

  formatPaymentStatus(status: string): string {
    return PAYMENT_DISPLAY_MAP[status] ||
      status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }

  getStatusColorClass(status: string): string {
    return STATUS_COLOR_MAP[status] || 'bg-gray-100 text-gray-700';
  }

  getPaymentStatusColorClass(paymentStatus: string): string {
    return PAYMENT_COLOR_MAP[paymentStatus] || 'bg-gray-100 text-gray-700';
  }

  // ✅ Format deadline with date and time
  formatDeadlineWithDateTime(deadlineString: string): string {
    if (!deadlineString || this.isZeroDate(deadlineString)) {
      return 'No deadline set';
    }

    const deadline = new Date(deadlineString);

    const dateStr = deadline.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const timeStr = deadline.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${dateStr}, ${timeStr}`;
  }

  // ✅ Get days remaining text for deadline
  getDeadlineStatus(deadlineString: string): { text: string; color: string } {
    if (!deadlineString || this.isZeroDate(deadlineString)) {
      return { text: '', color: '' };
    }

    const deadline = new Date(deadlineString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / MS_PER_DAY);

    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)} days`,
        color: 'text-red-600'
      };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-600' };
    } else if (diffDays === 1) {
      return { text: '1 day remaining', color: 'text-orange-600' };
    } else if (diffDays <= 3) {
      return { text: `${diffDays} days remaining`, color: 'text-red-600' };
    } else {
      return { text: `${diffDays} days remaining`, color: 'text-gray-600' };
    }
  }

  // ✅ UPDATED: Admin can only update dispatched, completed, declined
  isValidStatusTransition(currentStatus: string, newStatus: string, userRole: string): boolean {
    if (userRole === 'admin') {
      const adminAllowedStatuses: string[] = [
        ORDER_STATUS.DISPATCHED,
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.DECLINED
      ];
      return adminAllowedStatuses.includes(newStatus);
    }

    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    return allowed.includes(newStatus);
  }

  // ✅ Get allowed next statuses for a role
  getAllowedNextStatuses(currentStatus: string, userRole: string): string[] {
    if (userRole === 'admin') {
      return [
        ORDER_STATUS.DISPATCHED,
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.DECLINED
      ];
    }

    return ALLOWED_TRANSITIONS[currentStatus] || [];
  }

  // ✅ Check if admin can update this order
  canAdminUpdate(status: string): boolean {
    return status !== ORDER_STATUS.COMPLETED && status !== ORDER_STATUS.DECLINED;
  }

  isPaymentVerified(paymentStatus: string): boolean {
    return paymentStatus === PAYMENT_STATUS.VERIFIED;
  }

  isPaymentPending(paymentStatus: string): boolean {
    return paymentStatus === PAYMENT_STATUS.PENDING || paymentStatus === PAYMENT_STATUS.UPLOADED;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', DATE_FORMAT_OPTIONS);
  }

  // ✅ Format date with time
  formatDateWithTime(dateString: string): string {
    if (!dateString || this.isZeroDate(dateString)) {
      return 'Not set';
    }

    const date = new Date(dateString);

    const dateStr = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${dateStr}, ${timeStr}`;
  }

  // ✅ Check if date is Go's zero value
  isZeroDate(dateString: string): boolean {
    if (!dateString) return true;
    return dateString.startsWith('0001-01-01');
  }

  // ✅ Format date safely, handling zero values
  formatDateSafe(dateString: string): string {
    if (!dateString || this.isZeroDate(dateString)) {
      return 'Not set';
    }
    return this.formatDate(dateString);
  }

  // ✅ Format expected delivery with proper handling
  formatExpectedDelivery(dateString: string): string {
    if (!dateString || this.isZeroDate(dateString)) {
      return 'To be determined';
    }
    return this.formatDate(dateString);
  }

  // ✅ Format deadline with just date and time (no days remaining)
  formatDeadlineDateTime(deadlineString: string): string {
    if (!deadlineString || this.isZeroDate(deadlineString)) {
      return '';
    }

    const deadline = new Date(deadlineString);

    const dateStr = deadline.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const timeStr = deadline.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${dateStr}, ${timeStr}`;
  }

  // ✅ UPDATED: Safe overdue check
  isOrderOverdue(expectedDelivery: string): boolean {
    if (!expectedDelivery || this.isZeroDate(expectedDelivery)) {
      return false;
    }
    return new Date() > new Date(expectedDelivery);
  }

  getOrderAgeDays(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / MS_PER_DAY);
  }

  getAllOrderStatuses(): string[] {
    return Object.values(ORDER_STATUS);
  }

  getAllPaymentStatuses(): string[] {
    return Object.values(PAYMENT_STATUS);
  }

  isTerminalStatus(status: string): boolean {
    return status === ORDER_STATUS.COMPLETED || status === ORDER_STATUS.DECLINED;
  }

  getNextStatus(currentStatus: string, userRole: string): string | null {
    return ROLE_TRANSITIONS[userRole]?.[currentStatus] || null;
  }

  getStatusProgress(status: string): number {
    return STATUS_PROGRESS_MAP[status] || 0;
  }

  hasPIUrl(order: AllOrderModel): boolean {
    return !!order.pi_url && order.pi_url.trim().length > 0;
  }

  hasInvoiceUrl(order: AllOrderModel): boolean {
    return !!order.invoice_url && order.invoice_url.trim().length > 0;
  }

  hasAllDocuments(order: AllOrderModel): boolean {
    return this.hasInvoiceUrl(order) && this.hasPIUrl(order);
  }

  hasLabelDetailsNested(order: AllOrderModel): boolean {
    return !!order.label_details && order.label_details.id > 0;
  }

  getAssignedUsers(order: AllOrderModel, role?: string): OrderAssignment[] {
    if (!order.assignments) return [];
    if (role) {
      return order.assignments.filter(a => a.role === role);
    }
    return order.assignments;
  }

  formatCommentTime(createdAt: string): string {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return this.formatDate(createdAt);
  }

  getRoleBadgeColor(role: string): string {
    const roleColors: Record<string, string> = {
      admin: 'bg-red-100 text-red-700',
      printing: 'bg-blue-100 text-blue-700',
      plant: 'bg-green-100 text-green-700',
      user: 'bg-gray-100 text-gray-700',
    };
    return roleColors[role] || 'bg-gray-100 text-gray-700';
  }

  validateLabelDetails(details: SaveLabelDetailsRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!details.no_of_sheets || details.no_of_sheets <= 0) {
      errors.push('Number of sheets must be greater than 0');
    }

    if (!details.cutting_type || !details.cutting_type.trim()) {
      errors.push('Cutting type is required');
    }

    if (!details.labels_per_sheet || details.labels_per_sheet <= 0) {
      errors.push('Labels per sheet must be greater than 0');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async hasLabelDetails(orderId: string): Promise<boolean> {
    try {
      const details = await this.getOrderLabelDetails(orderId);
      return details !== null;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;
