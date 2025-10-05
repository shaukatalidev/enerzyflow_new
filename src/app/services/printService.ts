import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';

// ✅ Order status in the system (read-only for printing company)
export interface Order {
  order_id: string;
  company_id: string;
  company_name: string;
  label_id: string;
  label_url: string;
  variant: string;
  qty: number;
  cap_color: string;
  volume: string;
  status: 'placed' | 'printing' | 'processing' | 'dispatch' | 'declined' | 'cancelled';
  decline_reason?: string;
  created_at: string;
  updated_at: string;
  user_name: string;
}

// ✅ Response for get all orders (with pagination)
export interface GetAllOrdersResponse {
  orders: Order[];
}

// ✅ Pagination parameters for getAllOrders
export interface GetAllOrdersParams {
  limit?: number;
  offset?: number;
}

// ✅ Printing company can only accept or decline orders
export interface UpdateOrderStatusRequest {
  status: 'accepted' | 'declined';
  reason?: string; // Required for declined status
}

// ✅ Response for updating order status
export interface UpdateOrderStatusResponse {
  message: string;
}

// ✅ Define error response type
interface ApiErrorResponse {
  error?: string;
  message?: string;
}

class PrintService {
  /**
   * Get all orders for printing company (role: printing)
   * Endpoint: GET /orders/get-all-orders
   * Auth: Required (Bearer token)
   * 
   * @param params - Pagination parameters
   * @param params.limit - Number of orders to fetch (default: 10)
   * @param params.offset - Number of orders to skip (default: 0)
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
   * Update order status (role: printing)
   * Endpoint: PUT /orders/:id/status
   * Auth: Required (Bearer token)
   * 
   * Printing company can only accept or decline orders:
   * - Accept: { "status": "accepted" }
   * - Decline: { "status": "declined", "reason": "service unavailable" }
   * 
   * Backend response: { "message": "order status updated successfully" }
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

      // Validate that reason is provided for declined status
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
   * Accept an order
   * Sends: { "status": "accepted" }
   */
  async acceptOrder(orderId: string): Promise<UpdateOrderStatusResponse> {
    return this.updateOrderStatus(orderId, { status: 'accepted' });
  }

  /**
   * Decline an order with reason
   * Sends: { "status": "declined", "reason": "your reason" }
   */
  async declineOrder(orderId: string, reason: string): Promise<UpdateOrderStatusResponse> {
    if (!reason || !reason.trim()) {
      throw new Error('Reason is required when declining an order');
    }
    return this.updateOrderStatus(orderId, { status: 'declined', reason });
  }

  /**
   * Helper to get status color for UI
   */
  getStatusColor(status: Order['status']): string {
    const colors: Record<Order['status'], string> = {
      placed: 'blue',
      printing: 'purple',
      processing: 'yellow',
      dispatch: 'green',
      declined: 'red',
      cancelled: 'gray',
    };
    return colors[status] || 'gray';
  }

  /**
   * Helper to get status label
   */
  getStatusLabel(status: Order['status']): string {
    const labels: Record<Order['status'], string> = {
      placed: 'Order Placed',
      printing: 'Printing Label',
      processing: 'Processing Order',
      dispatch: 'Ready to Dispatch',
      declined: 'Declined',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  }

  /**
   * Helper to get status description
   */
  getStatusDescription(status: Order['status']): string {
    const descriptions: Record<Order['status'], string> = {
      placed: 'Your order has been received',
      printing: 'Labels are being printed',
      processing: 'Order is being prepared for dispatch',
      dispatch: 'Order is ready for dispatch',
      declined: 'Order has been declined',
      cancelled: 'Order has been cancelled',
    };
    return descriptions[status] || '';
  }

  /**
   * Check if order can be accepted/declined
   * Only 'placed' orders can be accepted or declined
   */
  canUpdateOrder(status: Order['status']): boolean {
    return status === 'placed';
  }
}

export const printService = new PrintService();
