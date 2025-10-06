import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';

// ✅ Updated to include payment-pending with hyphen
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
  status: 'placed' | 'payment-pending' | 'payment_uploaded' | 'printing' | 'processing' | 'dispatch' | 'declined' | 'cancelled';
  decline_reason?: string;
  payment_url?: string;
  invoice_url?: string; 
  created_at: string;
  updated_at: string;
  user_name: string;
}

export interface OrderHistoryItem {
  status: string;
  changed_at: string;
  changed_by: string;
  reason?: string;
}

export interface GetOrderTrackingResponse {
  history: OrderHistoryItem[];
}

export interface GetAllOrdersResponse {
  orders: Order[];
}

export interface GetAllOrdersParams {
  limit?: number;
  offset?: number;
}

export interface UpdateOrderStatusRequest {
  status: 'accepted' | 'declined';
  reason?: string;
}

export interface UpdateOrderStatusResponse {
  message: string;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

class PrintService {
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
        throw new Error(errorData.error || 'Failed to fetch order tracking');
      }
      throw new Error('Failed to fetch order tracking');
    }
  }

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

  async acceptOrder(orderId: string): Promise<UpdateOrderStatusResponse> {
    return this.updateOrderStatus(orderId, { status: 'accepted' });
  }

  async declineOrder(orderId: string, reason: string): Promise<UpdateOrderStatusResponse> {
    if (!reason || !reason.trim()) {
      throw new Error('Reason is required when declining an order');
    }
    return this.updateOrderStatus(orderId, { status: 'declined', reason });
  }

  // ✅ Updated to include payment-pending
  getStatusColor(status: Order['status']): string {
    const colors: Record<Order['status'], string> = {
      placed: 'blue',
      'payment-pending': 'yellow',
      payment_uploaded: 'indigo',
      printing: 'purple',
      processing: 'orange',
      dispatch: 'green',
      declined: 'red',
      cancelled: 'gray',
    };
    return colors[status] || 'gray';
  }

  getStatusLabel(status: Order['status']): string {
    const labels: Record<Order['status'], string> = {
      placed: 'Order Placed',
      'payment-pending': 'Payment Pending',
      payment_uploaded: 'Payment Uploaded',
      printing: 'Printing Label',
      processing: 'Processing Order',
      dispatch: 'Ready to Dispatch',
      declined: 'Declined',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  }

  getStatusDescription(status: Order['status']): string {
    const descriptions: Record<Order['status'], string> = {
      placed: 'Your order has been received',
      'payment-pending': 'Payment verification pending',
      payment_uploaded: 'Payment screenshot uploaded',
      printing: 'Labels are being printed',
      processing: 'Order is being prepared for dispatch',
      dispatch: 'Order is ready for dispatch',
      declined: 'Order has been declined',
      cancelled: 'Order has been cancelled',
    };
    return descriptions[status] || '';
  }

  canUpdateOrder(status: Order['status']): boolean {
    return status === 'placed';
  }
}

export const printService = new PrintService();
