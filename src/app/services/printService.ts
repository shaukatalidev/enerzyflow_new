import axiosInstance from '../lib/axios';
import { adminService, ORDER_STATUS } from './adminService';
import type {
  OrderStatusHistory,
  AllOrdersResponse,
  OrderStatusUpdateResponse,
  OrderComment,
  AddCommentResponse,
  GetCommentsResponse,
} from './adminService';

// ==================== Print Service Specific Types ====================

export interface GetOrderTrackingResponse {
  order_id: string;
  status: string;
  history: OrderStatusHistory[];
}

export interface UpdateOrderStatusRequest {
  status: string;
  reason?: string;
}

export interface OrderLabelDetails {
  no_of_sheets: number;
  cutting_type: string;
  labels_per_sheet: number;
  description: string;
}

export interface GetOrderLabelDetailsResponse {
  no_of_sheets: number;
  cutting_type: string;
  labels_per_sheet: number;
  description: string;
}


// ✅ OPTIMIZATION: Constants outside class with proper typing
const PRINT_STATUS_TRANSITIONS: Record<string, string[]> = {
  [ORDER_STATUS.PLACED]: [ORDER_STATUS.ACCEPTED, ORDER_STATUS.DECLINED],
  [ORDER_STATUS.ACCEPTED]: [ORDER_STATUS.PRINTING, ORDER_STATUS.DECLINED],
  [ORDER_STATUS.PRINTING]: [ORDER_STATUS.READY_FOR_PLANT, ORDER_STATUS.DECLINED],
  [ORDER_STATUS.DECLINED]: [],
  [ORDER_STATUS.READY_FOR_PLANT]: [],
};

const PLANT_STATUS_TRANSITIONS: Record<string, string[]> = {
  [ORDER_STATUS.READY_FOR_PLANT]: [ORDER_STATUS.PLANT_PROCESSING],
  [ORDER_STATUS.PLANT_PROCESSING]: [ORDER_STATUS.DISPATCHED],
  [ORDER_STATUS.DISPATCHED]: [ORDER_STATUS.COMPLETED],
};

// ✅ FIX: Define as string arrays to avoid TypeScript errors
const PRINT_ALLOWED_STATUSES: string[] = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PRINTING,
  ORDER_STATUS.DECLINED,
  ORDER_STATUS.READY_FOR_PLANT,
];

const PLANT_ALLOWED_STATUSES: string[] = [
  ORDER_STATUS.READY_FOR_PLANT,
  ORDER_STATUS.PLANT_PROCESSING,
  ORDER_STATUS.DISPATCHED,
];

const STATUS_DESCRIPTIONS: Record<string, string> = {
  [ORDER_STATUS.PLACED]: 'Order has been placed',
  [ORDER_STATUS.ACCEPTED]: 'Order has been accepted',
  [ORDER_STATUS.PRINTING]: 'Labels are being printed',
  [ORDER_STATUS.DECLINED]: 'Order has been declined',
  [ORDER_STATUS.READY_FOR_PLANT]: 'Printing complete, ready for plant processing',
  [ORDER_STATUS.PLANT_PROCESSING]: 'Order is being processed at the plant',
  [ORDER_STATUS.DISPATCHED]: 'Order has been dispatched',
  [ORDER_STATUS.COMPLETED]: 'Order has been completed',
};

const PRINT_ACTION_LABELS: Record<string, string> = {
  [ORDER_STATUS.PLACED]: 'Accept Order',
  [ORDER_STATUS.ACCEPTED]: 'Start Printing',
  [ORDER_STATUS.PRINTING]: 'Mark Ready for Plant',
};

// ==================== Print Service ====================

class PrintService {
  /**
   * Get order tracking history
   * Delegates to adminService (no duplication)
   */
  async getOrderTracking(orderId: string): Promise<GetOrderTrackingResponse> {
    try {
      return await adminService.getOrderTracking(orderId);
    } catch (error) {
      console.error('❌ [Print] Order tracking fetch error:', error);
      throw this.handleError(error, 'Failed to fetch order tracking');
    }
  }

  /**
   * Get all orders (for printing/plant role)
   * Delegates to adminService
   */
  async getAllOrders(limit: number = 100, offset: number = 0): Promise<AllOrdersResponse> {
    try {
      return await adminService.getAllOrders(limit, offset);
    } catch (error) {
      console.error('❌ [Print] Failed to fetch orders:', error);
      throw this.handleError(error, 'Failed to fetch orders');
    }
  }

  /**
   * Update order status
   * PUT /orders/:id/status
   */
  async updateOrderStatus(
    orderId: string,
    statusData: UpdateOrderStatusRequest
  ): Promise<OrderStatusUpdateResponse> {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      if (!statusData.status) {
        throw new Error('Status is required');
      }

      if (statusData.status === ORDER_STATUS.DECLINED && !statusData.reason) {
        throw new Error('Reason is required when declining an order');
      }

      return await adminService.updateOrderStatus(orderId, statusData.status, statusData.reason);
    } catch (error) {
      console.error('❌ [Print] Failed to update order status:', error);
      throw this.handleError(error, 'Failed to update order status');
    }
  }

  // ==================== Order Comments ====================

  /**
   * Add comment to an order (Print role)
   * POST /orders/:id/comment
   */
  async addOrderComment(
    orderId: string,
    comment: string
  ): Promise<AddCommentResponse> {
    try {
      return await adminService.addOrderComment(orderId, comment);
    } catch (error) {
      console.error('❌ [Print] Failed to add comment:', error);
      throw this.handleError(error, 'Failed to add comment');
    }
  }

  /**
   * Get all comments for an order (Print role)
   * GET /orders/:id/comment
   */
  async getOrderComments(orderId: string): Promise<GetCommentsResponse> {
    try {
      return await adminService.getOrderComments(orderId);
    } catch (error) {
      console.error('❌ [Print] Failed to fetch comments:', error);
      throw this.handleError(error, 'Failed to fetch comments');
    }
  }

  /**
 * Get order label details
 * GET /orders/:id/label
 */
async getOrderLabelDetails(orderId: string): Promise<GetOrderLabelDetailsResponse> {
  try {
    const response = await axiosInstance.get<GetOrderLabelDetailsResponse>(
      `/orders/${orderId}/label`
    );
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch label details:', error);
    throw this.handleError(error, 'Failed to fetch label details');
  }
}


  // ==================== Convenience Methods ====================

  /**
   * Accept order (moves from placed → accepted)
   */
  async acceptOrder(orderId: string): Promise<OrderStatusUpdateResponse> {
    return this.updateOrderStatus(orderId, { status: ORDER_STATUS.ACCEPTED });
  }

  /**
   * Move order to printing status
   */
  async startPrinting(orderId: string): Promise<OrderStatusUpdateResponse> {
    return this.updateOrderStatus(orderId, { status: ORDER_STATUS.PRINTING });
  }

  /**
   * Mark order as ready for plant
   */
  async markReadyForPlant(orderId: string): Promise<OrderStatusUpdateResponse> {
    return this.updateOrderStatus(orderId, { status: ORDER_STATUS.READY_FOR_PLANT });
  }

  /**
   * Decline order with reason
   */
  async declineOrder(orderId: string, reason: string): Promise<OrderStatusUpdateResponse> {
    if (!reason || !reason.trim()) {
      throw new Error('Reason is required when declining an order');
    }
    return this.updateOrderStatus(orderId, { status: ORDER_STATUS.DECLINED, reason });
  }

  /**
   * Start plant processing (for plant role)
   */
  async startPlantProcessing(orderId: string): Promise<OrderStatusUpdateResponse> {
    return this.updateOrderStatus(orderId, { status: ORDER_STATUS.PLANT_PROCESSING });
  }

  /**
   * Mark as dispatched (directly from plant_processing)
   */
  async markDispatched(orderId: string): Promise<OrderStatusUpdateResponse> {
    return this.updateOrderStatus(orderId, { status: ORDER_STATUS.DISPATCHED });
  }

  /**
   * Mark as completed
   */
  async markCompleted(orderId: string): Promise<OrderStatusUpdateResponse> {
    return this.updateOrderStatus(orderId, { status: ORDER_STATUS.COMPLETED });
  }

  // ==================== Helper Methods ====================

  /**
   * Handle API errors consistently
   */
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

      if (data.error) return new Error(data.error);
      if (data.message) return new Error(data.message);
    }

    if (error instanceof Error) return new Error(error.message);
    return new Error(defaultMessage);
  }

  // ✅ All formatting methods delegate to adminService

  /**
   * Get status color
   * @deprecated Use adminService.getStatusColorClass() directly
   */
  getStatusColor(status: string): string {
    // Convert class to color name for backwards compatibility
    const colorClass = adminService.getStatusColorClass(status);
    return colorClass.split('-')[1] || 'gray'; // Extract color from "bg-purple-100"
  }

  // Check if date is zero value
  isZeroDate(dateString: string): boolean {
    return adminService.isZeroDate(dateString);
  }

  // Format deadline with date and time
  formatDeadlineDateTime(deadlineString: string): string {
    return adminService.formatDeadlineDateTime(deadlineString);
  }

  /**
   * Get status label
   * @deprecated Use adminService.formatOrderStatus() directly
   */
  getStatusLabel(status: string): string {
    return adminService.formatOrderStatus(status);
  }

  /**
   * Get status description
   */
  getStatusDescription(status: string): string {
    return STATUS_DESCRIPTIONS[status] || '';
  }

  /**
   * Check if order can be updated by printing role
   * ✅ FIXED: Now works with string arrays
   */
  canUpdateOrderPrinting(status: string, paymentStatus: string): boolean {
    return adminService.isPaymentVerified(paymentStatus) &&
      PRINT_ALLOWED_STATUSES.includes(status);
  }

  /**
   * Check if order can be updated by plant role
   * ✅ FIXED: Now works with string arrays
   */
  canUpdateOrderPlant(status: string): boolean {
    return PLANT_ALLOWED_STATUSES.includes(status);
  }

  /**
   * Get next possible statuses for printing role
   * ✅ Uses pre-defined transitions map
   */
  getNextStatusesPrinting(currentStatus: string): string[] {
    return PRINT_STATUS_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Get next possible statuses for plant role
   * ✅ Uses pre-defined transitions map
   */
  getNextStatusesPlant(currentStatus: string): string[] {
    return PLANT_STATUS_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Check if payment is verified
   * @deprecated Use adminService.isPaymentVerified() directly
   */
  isPaymentVerified(paymentStatus: string): boolean {
    return adminService.isPaymentVerified(paymentStatus);
  }

  /**
   * Format date for display
   * @deprecated Use adminService.formatDate() directly
   */
  formatDate(dateString: string): string {
    return adminService.formatDate(dateString);
  }

  /**
   * Get status progress percentage
   * @deprecated Use adminService.getStatusProgress() directly
   */
  getStatusProgress(status: string): number {
    return adminService.getStatusProgress(status);
  }

  /**
   * Check if status is terminal
   * @deprecated Use adminService.isTerminalStatus() directly
   */
  isTerminalStatus(status: string): boolean {
    return adminService.isTerminalStatus(status);
  }

  /**
   * Format payment status
   * @deprecated Use adminService.formatPaymentStatus() directly
   */
  formatPaymentStatus(status: string): string {
    return adminService.formatPaymentStatus(status);
  }

  /**
   * Get status color class
   * @deprecated Use adminService.getStatusColorClass() directly
   */
  getStatusColorClass(status: string): string {
    return adminService.getStatusColorClass(status);
  }

  /**
   * Get payment status color class
   * @deprecated Use adminService.getPaymentStatusColorClass() directly
   */
  getPaymentStatusColorClass(paymentStatus: string): string {
    return adminService.getPaymentStatusColorClass(paymentStatus);
  }

  /**
   * Format comment timestamp
   * @deprecated Use adminService.formatCommentTime() directly
   */
  formatCommentTime(createdAt: string): string {
    return adminService.formatCommentTime(createdAt);
  }

  /**
   * Get role badge color
   * @deprecated Use adminService.getRoleBadgeColor() directly
   */
  getRoleBadgeColor(role: string): string {
    return adminService.getRoleBadgeColor(role);
  }

  // ✅ Print-specific helper methods

  /**
   * Check if printing role can accept order
   */
  canAcceptOrder(status: string, paymentStatus: string): boolean {
    return status === ORDER_STATUS.PLACED &&
      adminService.isPaymentVerified(paymentStatus);
  }

  /**
   * Check if printing role can decline order
   */
  canDeclineOrder(status: string): boolean {
    return status === ORDER_STATUS.PLACED || status === ORDER_STATUS.PRINTING;
  }

  /**
   * Get action label for printing role
   */
  getPrintActionLabel(status: string): string {
    return PRINT_ACTION_LABELS[status] || 'Update Status';
  }

  /**
   * Validate status transition for printing role
   */
  isValidPrintTransition(currentStatus: string, newStatus: string): boolean {
    const allowedNext = this.getNextStatusesPrinting(currentStatus);
    return allowedNext.includes(newStatus);
  }

  /**
   * Validate status transition for plant role
   */
  isValidPlantTransition(currentStatus: string, newStatus: string): boolean {
    const allowedNext = this.getNextStatusesPlant(currentStatus);
    return allowedNext.includes(newStatus);
  }

  /**
   * Check if order requires attention (payment verified but not processed)
   */
  requiresAttention(status: string, paymentStatus: string): boolean {
    return status === ORDER_STATUS.PLACED &&
      adminService.isPaymentVerified(paymentStatus);
  }

  /**
   * Get order age in days
   */
  getOrderAgeDays(createdAt: string): number {
    return adminService.getOrderAgeDays(createdAt);
  }

  /**
   * Check if order is overdue
   */
  isOrderOverdue(expectedDelivery: string): boolean {
    return adminService.isOrderOverdue(expectedDelivery);
  }

  /**
   * Get all print statuses
   */
  getPrintStatuses(): string[] {
    return [...PRINT_ALLOWED_STATUSES];
  }

  /**
   * Get all plant statuses
   */
  getPlantStatuses(): string[] {
    return [...PLANT_ALLOWED_STATUSES];
  }
}

export const printService = new PrintService();
export default printService;

// ✅ Re-export types for convenience
export type { OrderComment };
