// app/services/plantService.ts

import axiosInstance from '../lib/axios';
import { adminService, ORDER_STATUS } from './adminService';
import type { 
  AllOrdersResponse, 
  OrderStatusUpdateResponse 
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

  /**
   * Get all orders for plant role
   * ✅ Reuses adminService.getAllOrders() - backend filters by role
   */
  async getAllOrders(limit: number = 100, offset: number = 0): Promise<AllOrdersResponse> {
    try {
      return await adminService.getAllOrders(limit, offset);
    } catch (error) {
      console.error('❌ [Plant] Failed to fetch orders:', error);
      throw this.handleError(error, 'Failed to fetch orders');
    }
  }

  /**
   * Update order status (Plant role)
   * PUT /orders/:id/status
   * { "status": "" } - backend auto-detects next status
   */
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

  /**
   * Handle API errors consistently (same as adminService)
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
   * Get status color class
   * @deprecated Use adminService.getStatusColorClass() directly
   */
  getStatusColorClass(status: string): string {
    return adminService.getStatusColorClass(status);
  }

  /**
   * Get formatted status label
   * @deprecated Use adminService.formatOrderStatus() directly
   */
  getStatusLabel(status: string): string {
    return adminService.formatOrderStatus(status);
  }

  /**
   * Format date for display
   * @deprecated Use adminService.formatDate() directly
   */
  formatDate(dateString: string): string {
    return adminService.formatDate(dateString);
  }

  /**
   * Check if order is overdue
   * @deprecated Use adminService.isOrderOverdue() directly
   */
  isOverdue(expectedDelivery: string): boolean {
    return adminService.isOrderOverdue(expectedDelivery);
  }

  // ✅ Plant-specific business logic

  /**
   * Calculate days until expected delivery
   * ✅ OPTIMIZED: Uses constant for time calculation
   */
  getDaysUntilDelivery(expectedDelivery: string): number {
    const expected = new Date(expectedDelivery);
    const now = new Date();
    const diffTime = expected.getTime() - now.getTime();
    return Math.ceil(diffTime / MS_PER_DAY);
  }

  /**
   * Get action button label based on current status
   * ✅ OPTIMIZED: Uses pre-defined map
   */
  getNextActionLabel(status: string): string {
    return PLANT_ACTION_LABELS[status] || 'Process Order';
  }

  /**
   * Check if plant can take action on this order
   * Plant can only act on: ready_for_plant, plant_processing
   */
  canTakeAction(status: string): boolean {
    return status === ORDER_STATUS.READY_FOR_PLANT || 
           status === ORDER_STATUS.PLANT_PROCESSING;
  }

  /**
   * Check if order is in plant's responsibility
   */
  isPlantOrder(status: string): boolean {
    return status === ORDER_STATUS.READY_FOR_PLANT || 
           status === ORDER_STATUS.PLANT_PROCESSING ||
           status === ORDER_STATUS.DISPATCHED;
  }

  /**
   * Get order progress percentage for plant view
   * ready_for_plant = 40%, plant_processing = 60%, dispatched = 80%
   */
  getPlantProgress(status: string): number {
    const plantProgressMap: Record<string, number> = {
      [ORDER_STATUS.READY_FOR_PLANT]: 40,
      [ORDER_STATUS.PLANT_PROCESSING]: 60,
      [ORDER_STATUS.DISPATCHED]: 80,
      [ORDER_STATUS.COMPLETED]: 100,
    };
    return plantProgressMap[status] || 0;
  }

  /**
   * Get current stage description for plant
   */
  getStageDescription(status: string): string {
    const stageMap: Record<string, string> = {
      [ORDER_STATUS.READY_FOR_PLANT]: 'Ready to start processing',
      [ORDER_STATUS.PLANT_PROCESSING]: 'Currently being processed',
      [ORDER_STATUS.DISPATCHED]: 'Dispatched to customer',
      [ORDER_STATUS.COMPLETED]: 'Order completed',
    };
    return stageMap[status] || 'Waiting for processing';
  }

  /**
   * Validate if order can be processed by plant
   */
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
