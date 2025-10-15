// app/services/plantService.ts

import axiosInstance from '../lib/axios';
import { adminService, ORDER_STATUS } from './adminService';
import type {
  AllOrdersResponse,
  OrderStatusUpdateResponse,

  AddCommentResponse,
  GetCommentsResponse
} from './adminService';


// ==================== Types ====================


export interface PlantUpdateStatusRequest {
  status: string; // Empty string - backend auto-detects next status
}


// ✅ OPTIMIZATION: Constants outside class
const MS_PER_DAY = 1000 * 60 * 60 * 24;


const PLANT_ACTION_LABELS: Record<string, string> = {
  [ORDER_STATUS.READY_FOR_PLANT]: 'Start Processing',
  [ORDER_STATUS.PLANT_PROCESSING]: 'Mark as Dispatched',
};


// ==================== Plant Service ====================


class PlantService {
  // ==================== Order Management ====================


  async addOrderComment(
    orderId: string,
    comment: string
  ): Promise<AddCommentResponse> {
    try {
      return await adminService.addOrderComment(orderId, comment);
    } catch (error) {
      console.error('❌ [Plant] Failed to add comment:', error);
      throw this.handleError(error, 'Failed to add comment');
    }
  }


  async getOrderComments(orderId: string): Promise<GetCommentsResponse> {
    try {
      return await adminService.getOrderComments(orderId);
    } catch (error) {
      console.error('❌ [Plant] Failed to fetch comments:', error);
      throw this.handleError(error, 'Failed to fetch comments');
    }
  }


  formatCommentTime(createdAt: string): string {
    return adminService.formatCommentTime(createdAt);
  }


  getRoleBadgeColor(role: string): string {
    return adminService.getRoleBadgeColor(role);
  }


  async getAllOrders(limit: number = 100, offset: number = 0): Promise<AllOrdersResponse> {
    try {
      return await adminService.getAllOrders(limit, offset);
    } catch (error) {
      console.error('❌ [Plant] Failed to fetch orders:', error);
      throw this.handleError(error, 'Failed to fetch orders');
    }
  }


  async updateOrderStatus(orderId: string): Promise<OrderStatusUpdateResponse> {
    try {
      const requestData: PlantUpdateStatusRequest = {
        status: "" // Empty string - backend handles progression
      };


      const response = await axiosInstance.put<OrderStatusUpdateResponse>(
        `/orders/${orderId}/status`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error('❌ [Plant] Failed to update order status:', error);
      throw this.handleError(error, 'Failed to update order status');
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


      if (data.error) return new Error(data.error);
      if (data.message) return new Error(data.message);
    }


    if (error instanceof Error) return new Error(error.message);
    return new Error(defaultMessage);
  }


  // ✅ Delegate formatting to adminService
  getStatusColorClass(status: string): string {
    return adminService.getStatusColorClass(status);
  }


  getStatusLabel(status: string): string {
    return adminService.formatOrderStatus(status);
  }


  formatDate(dateString: string): string {
    return adminService.formatDate(dateString);
  }


  // ✅ NEW: Zero date handling
  isZeroDate(dateString: string): boolean {
    return adminService.isZeroDate(dateString);
  }


  // ✅ NEW: Safe date formatting
  formatDateSafe(dateString: string): string {
    return adminService.formatDateSafe(dateString);
  }


  // ✅ NEW: Format expected delivery
  formatExpectedDelivery(dateString: string): string {
    return adminService.formatExpectedDelivery(dateString);
  }


  // ✅ Format deadline with date and time only
  formatDeadlineDateTime(deadlineString: string): string {
    return adminService.formatDeadlineDateTime(deadlineString);
  }



  // ✅ UPDATED: Safe overdue check
  isOverdue(expectedDelivery: string): boolean {
    return adminService.isOrderOverdue(expectedDelivery);
  }


  // ✅ UPDATED: Calculate days until delivery (handles zero dates)
  getDaysUntilDelivery(expectedDelivery: string): number {
    if (!expectedDelivery || this.isZeroDate(expectedDelivery)) {
      return 0;
    }

    const expected = new Date(expectedDelivery);
    const now = new Date();
    const diffTime = expected.getTime() - now.getTime();
    return Math.ceil(diffTime / MS_PER_DAY);
  }


  getNextActionLabel(status: string): string {
    return PLANT_ACTION_LABELS[status] || 'Process Order';
  }


  canTakeAction(status: string): boolean {
    return status === ORDER_STATUS.READY_FOR_PLANT ||
      status === ORDER_STATUS.PLANT_PROCESSING;
  }


  isPlantOrder(status: string): boolean {
    return status === ORDER_STATUS.READY_FOR_PLANT ||
      status === ORDER_STATUS.PLANT_PROCESSING ||
      status === ORDER_STATUS.DISPATCHED;
  }


  getPlantProgress(status: string): number {
    const plantProgressMap: Record<string, number> = {
      [ORDER_STATUS.READY_FOR_PLANT]: 40,
      [ORDER_STATUS.PLANT_PROCESSING]: 60,
      [ORDER_STATUS.DISPATCHED]: 80,
      [ORDER_STATUS.COMPLETED]: 100,
    };
    return plantProgressMap[status] || 0;
  }

  // ✅ NEW: Format deadline with date and time
  formatDeadlineWithDateTime(deadlineString: string): string {
    return adminService.formatDeadlineWithDateTime(deadlineString);
  }

  // ✅ NEW: Get deadline status
  getDeadlineStatus(deadlineString: string): { text: string; color: string } {
    return adminService.getDeadlineStatus(deadlineString);
  }



  getStageDescription(status: string): string {
    const stageMap: Record<string, string> = {
      [ORDER_STATUS.READY_FOR_PLANT]: 'Ready to start processing',
      [ORDER_STATUS.PLANT_PROCESSING]: 'Currently being processed',
      [ORDER_STATUS.DISPATCHED]: 'Dispatched to customer',
      [ORDER_STATUS.COMPLETED]: 'Order completed',
    };
    return stageMap[status] || 'Waiting for processing';
  }


  canProcessOrder(status: string, paymentStatus: string): boolean {
    const isCorrectStatus = status === ORDER_STATUS.READY_FOR_PLANT;
    const isPaymentVerified = adminService.isPaymentVerified(paymentStatus);
    return isCorrectStatus && isPaymentVerified;
  }
}


// Export singleton instance
export const plantService = new PlantService();
export default plantService;


// ✅ Re-export ORDER_STATUS for convenience
export { ORDER_STATUS };
