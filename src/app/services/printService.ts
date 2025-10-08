// app/services/printService.ts

import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';
import type {
  OrderStatusHistory,
  AllOrderModel
} from './adminService';

// ==================== Print Service Specific Types ====================

export interface GetOrderTrackingResponse {
  order_id: string;
  status: string;
  history: OrderStatusHistory[];  
}


export interface GetAllOrdersResponse {
  orders: AllOrderModel[];
  count: number;
}

export interface GetAllOrdersParams {
  limit?: number;
  offset?: number;
}

export interface UpdateOrderStatusRequest {
  status: string;
  reason?: string;
}

export interface UpdateOrderStatusResponse {
  message: string;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// ==================== Print Service ====================

class PrintService {
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
      console.error('❌ Order tracking fetch error:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || errorData.message || 'Failed to fetch order tracking');
      }
      throw new Error('Failed to fetch order tracking');
    }
  }

  /**
   * Get all orders (for printing/plant role)
   * GET /orders/get-all-orders?limit=10&offset=0
   */
  async getAllOrders(params?: GetAllOrdersParams): Promise<GetAllOrdersResponse> {
    try {
      const queryParams = {
        limit: params?.limit || 10,
        offset: params?.offset || 0,
      };

      const response = await axiosInstance.get<GetAllOrdersResponse>(
        '/orders/get-all-orders',
        { params: queryParams }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || errorData.message || 'Failed to fetch orders');
      }
      throw new Error('Failed to fetch orders');
    }
  }

  /**
   * Update order status
   * PUT /orders/:id/status
   * 
   * ⚠️ Accepts any valid order status based on user role
   * - Printing role: printing, declined, ready_for_plant
   * - Plant role: plant_processing, dispatched (no ready_for_dispatch)
   */
  async updateOrderStatus(
    orderId: string,
    statusData: UpdateOrderStatusRequest
  ): Promise<UpdateOrderStatusResponse> {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      if (!statusData.status) {
        throw new Error('Status is required');
      }

      if (statusData.status === 'declined' && !statusData.reason) {
        throw new Error('Reason is required when declining an order');
      }

      const response = await axiosInstance.put<UpdateOrderStatusResponse>(
        `/orders/${orderId}/status`,
        statusData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        throw new Error(errorData.error || errorData.message || 'Failed to update order status');
      }
      throw new Error('Failed to update order status');
    }
  }

  /**
   * Move order to printing status
   */
  async startPrinting(orderId: string): Promise<UpdateOrderStatusResponse> {
    return this.updateOrderStatus(orderId, { status: 'accepted' });
  }

  /**
   * Mark order as ready for plant
   */
  async markReadyForPlant(orderId: string): Promise<UpdateOrderStatusResponse> {
    return this.updateOrderStatus(orderId, { status: 'ready_for_plant' });
  }

  /**
   * Decline order with reason
   */
  async declineOrder(orderId: string, reason: string): Promise<UpdateOrderStatusResponse> {
    if (!reason || !reason.trim()) {
      throw new Error('Reason is required when declining an order');
    }
    return this.updateOrderStatus(orderId, { status: 'declined', reason });
  }

  /**
   * Start plant processing (for plant role)
   */
  async startPlantProcessing(orderId: string): Promise<UpdateOrderStatusResponse> {
    return this.updateOrderStatus(orderId, { status: 'plant_processing' });
  }

  // ✅ REMOVED markReadyForDispatch - doesn't exist in backend

  /**
   * Mark as dispatched (directly from plant_processing)
   */
  async markDispatched(orderId: string): Promise<UpdateOrderStatusResponse> {
    return this.updateOrderStatus(orderId, { status: 'dispatched' });
  }

  /**
   * Mark as completed
   */
  async markCompleted(orderId: string): Promise<UpdateOrderStatusResponse> {
    return this.updateOrderStatus(orderId, { status: 'completed' });
  }

  // ==================== Helper Methods ====================

  /**
   * Get status color based on actual backend statuses
   * ✅ Removed ready_for_dispatch
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      // Order statuses (7 total)
      placed: 'purple',
      printing: 'blue',
      declined: 'red',
      ready_for_plant: 'yellow',
      plant_processing: 'orange',
      dispatched: 'cyan',
      completed: 'green',
      
      // Payment statuses
      payment_pending: 'amber',
      payment_uploaded: 'indigo',
      payment_verified: 'teal',
      payment_rejected: 'red',
    };
    return colors[status] || 'gray';
  }

  /**
   * Get status label with correct names
   * ✅ Removed ready_for_dispatch
   */
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      // Order statuses
      placed: 'Order Placed',
      printing: 'Printing',
      declined: 'Declined',
      ready_for_plant: 'Ready for Plant',
      plant_processing: 'Plant Processing',
      dispatched: 'Dispatched',
      completed: 'Completed',
      
      // Payment statuses
      payment_pending: 'Payment Pending',
      payment_uploaded: 'Payment Uploaded',
      payment_verified: 'Payment Verified',
      payment_rejected: 'Payment Rejected',
    };
    return labels[status] || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Get status description
   * ✅ Removed ready_for_dispatch
   */
  getStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
      placed: 'Order has been placed',
      printing: 'Labels are being printed',
      declined: 'Order has been declined',
      ready_for_plant: 'Printing complete, ready for plant processing',
      plant_processing: 'Order is being processed at the plant',
      dispatched: 'Order has been dispatched',
      completed: 'Order has been completed',
      
      // Payment statuses
      payment_pending: 'Payment verification pending',
      payment_uploaded: 'Payment screenshot uploaded',
      payment_verified: 'Payment has been verified',
      payment_rejected: 'Payment has been rejected',
    };
    return descriptions[status] || '';
  }

  /**
   * Check if order can be updated by printing role
   */
  canUpdateOrderPrinting(status: string, paymentStatus: string): boolean {
    return paymentStatus === 'payment_verified' && 
           ['placed', 'printing', 'declined', 'ready_for_plant'].includes(status);
  }

  /**
   * Check if order can be updated by plant role
   * ✅ Updated: plant_processing can now go directly to dispatched
   */
  canUpdateOrderPlant(status: string): boolean {
    return ['ready_for_plant', 'plant_processing', 'dispatched'].includes(status);
  }

  /**
   * Get next possible statuses for printing role
   */
  getNextStatusesPrinting(currentStatus: string): string[] {
    const transitions: Record<string, string[]> = {
      placed: ['printing', 'declined'],
      printing: ['ready_for_plant', 'declined'],
      declined: [],
      ready_for_plant: [],
    };
    return transitions[currentStatus] || [];
  }

  /**
   * Get next possible statuses for plant role
   * ✅ Updated: plant_processing → dispatched (no ready_for_dispatch)
   */
  getNextStatusesPlant(currentStatus: string): string[] {
    const transitions: Record<string, string[]> = {
      ready_for_plant: ['plant_processing'],
      plant_processing: ['dispatched'],
      dispatched: ['completed'],
    };
    return transitions[currentStatus] || [];
  }

  /**
   * Check if payment is verified
   */
  isPaymentVerified(paymentStatus: string): boolean {
    return paymentStatus === 'payment_verified';
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
   * Get status progress percentage
   * ✅ Removed ready_for_dispatch
   */
  getStatusProgress(status: string): number {
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

  /**
   * Check if status is terminal (no further updates)
   */
  isTerminalStatus(status: string): boolean {
    return status === 'completed' || status === 'declined';
  }

  formatPaymentStatus(status: string): string {
  const labels: Record<string, string> = {
    payment_pending: 'Payment Pending',
    payment_uploaded: 'Payment Uploaded',
    payment_verified: 'Payment Verified',
    payment_rejected: 'Payment Rejected',
  };
  return labels[status] || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

  /**
   * Get Tailwind CSS color classes for status badges
   */
  getStatusColorClass(status: string): string {
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
   * Get Tailwind CSS color classes for payment status badges
   */
  getPaymentStatusColorClass(paymentStatus: string): string {
    const colorMap: Record<string, string> = {
      payment_pending: 'bg-amber-100 text-amber-700',
      payment_uploaded: 'bg-indigo-100 text-indigo-700',
      payment_verified: 'bg-teal-100 text-teal-700',
      payment_rejected: 'bg-red-100 text-red-700',
    };
    return colorMap[paymentStatus] || 'bg-gray-100 text-gray-700';
  }
}

export const printService = new PrintService();
