'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { orderService, Order } from '@/app/services/orderService';

interface OrderStatus {
  status: string;
  timestamp: string;
  description?: string;
}

export default function OrderStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      try {
        const response = await orderService.getOrder(orderId);
        setOrder(response.order);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Mock timeline data - replace with actual data from your order
  const orderTimeline: OrderStatus[] = [
    {
      status: 'Order Placed',
      timestamp: '07 Feb 2025 9:00 AM',
      description: 'Your order has been received'
    },
    {
      status: 'Printing your label',
      timestamp: '08 Feb 2025 11:00 AM',
      description: 'Labels are being printed'
    },
    {
      status: 'Processing your order',
      timestamp: '09 Feb 2025 01:00 AM',
      description: 'Order is being prepared for dispatch'
    },
    {
      status: 'ready to dispatch',
      timestamp: '09 Feb 2025 04:00 AM',
      description: 'Estimated arrival time 10 Feb 2025 by 11 AM'
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Order Status</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">spicy</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Energyflow Conical Bottle
                </h2>
                <p className="text-sm text-gray-600">Qty: 100 pcs</p>
                <p className="text-lg font-bold text-gray-900 mt-1">$100</p>
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expected Delivery Date</span>
                <span className="text-sm font-medium text-gray-900">10 Feb 2025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Invoice No.</span>
                <span className="text-sm font-medium text-gray-900">{orderId}</span>
              </div>
            </div>

            {/* Success Banner */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-900">Congrats your Order is Approved!</p>
                  <p className="text-sm text-green-700 mt-1">Your order is being processed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Order Status</h3>

            <div className="space-y-6">
              {orderTimeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  {/* Timeline Indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === orderTimeline.length - 1
                        ? 'bg-green-100'
                        : 'bg-gray-100'
                    }`}>
                      <svg 
                        className={`w-6 h-6 ${
                          index === orderTimeline.length - 1 
                            ? 'text-green-600' 
                            : 'text-gray-400'
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {index < orderTimeline.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 my-2"></div>
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div className="flex-1 pb-6">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.status}</h4>
                    <p className="text-sm text-gray-600 mb-1">{item.timestamp}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-900 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push('/order')}
            className="flex-1 bg-[#4A90E2] hover:bg-[#357ABD] text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Create New Order
          </button>
        </div>
      </div>
    </div>
  );
}
