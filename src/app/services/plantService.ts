// app/services/plantService.ts

import axiosInstance from '../lib/axios';
import { adminService } from './adminService';
import type { 
  AllOrdersResponse, 
  OrderStatusUpdateResponse 
} from './adminService';

// ==================== Types ====================

export interface PlantUpdateStatusRequest {
  status: string; // Empty string - backend auto-detects next status
}

// ==================== Plant Service ====================

class PlantService {
  // ==================== Order Management ====================

  /**
   * Get all orders for plant role
   * ✅ Reuses adminService.getAllOrders() - backend filters by role
   */
  async getAllOrders(params: { limit: number; offset: number }): Promise<AllOrdersResponse> {
    return adminService.getAllOrders(params.limit, params.offset);
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

  // ✅ All these just delegate to adminService
  getStatusColorClass(status: string): string {
    return adminService.getStatusColorClass(status);
  }

  getStatusLabel(status: string): string {
    return adminService.formatOrderStatus(status);
  }

  formatDate(dateString: string): string {
    return adminService.formatDate(dateString);
  }

  getDaysUntilDelivery(expectedDelivery: string): number {
    const expected = new Date(expectedDelivery);
    const now = new Date();
    const diffTime = expected.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isOverdue(expectedDelivery: string): boolean {
    return adminService.isOrderOverdue(expectedDelivery);
  }

  getNextActionLabel(status: string): string {
    const actionMap: Record<string, string> = {
      ready_for_plant: 'Accept',
      plant_processing: 'Mark as Dispatched',
    };
    return actionMap[status] || 'Accept';
  }

  canTakeAction(status: string): boolean {
    return status === 'ready_for_plant' || status === 'plant_processing';
  }
}

// Export singleton instance
export const plantService = new PlantService();
export default plantService;
