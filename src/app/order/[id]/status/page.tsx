'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { orderService, Order } from '@/app/services/orderService';

interface OrderTimelineStep {
  status: string;
  label: string;
  description: string;
}

export default function OrderStatusPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string; 
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttempted = useRef(false);

  // ✅ Updated status flow to include payment_uploaded
  const statusFlow: OrderTimelineStep[] = [
    {
      status: 'placed',
      label: 'Order Placed',
      description: 'Your order has been received'
    },
    {
      status: 'payment_uploaded',
      label: 'Payment Uploaded',
      description: 'Payment screenshot has been uploaded'
    },
    {
      status: 'printing',
      label: 'Printing your label',
      description: 'Labels are being printed'
    },
    {
      status: 'processing',
      label: 'Processing your order',
      description: 'Order is being prepared for dispatch'
    },
    {
      status: 'dispatch', 
      label: 'Ready to dispatch',
      description: 'Order is ready for delivery'
    },
  ];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || fetchAttempted.current) return;
      
      fetchAttempted.current = true;
      
      try {
        const response = await orderService.getOrder(orderId);
        
        console.log('📦 Full order response:', response);
        console.log('📦 Order data:', response.order);
        console.log('🔍 Payment URL:', response.order.payment_url); // ✅ Changed
        
        setOrder(response.order);
        
        // ✅ Changed to payment_url
        if (!response.order.payment_url) {
          console.log('❌ No payment screenshot found, redirecting...');
          alert('Please upload payment screenshot before tracking your order');
          router.push(`/order/${orderId}/invoice`);
          return;
        }
        
        console.log('✅ Payment screenshot exists, allowing access');
      } catch (error) {
        console.error('Failed to fetch order:', error);
        fetchAttempted.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  // ✅ Updated to handle all status variations
  const isStepCompleted = (stepStatus: string): boolean => {
    if (!order) return false;
    
    const normalizeStatus = (status: string) => {
      if (status === 'dispatched' || status === 'dispatch') return 'dispatch';
      if (status === 'delivered') return 'dispatch';
      return status;
    };

    const currentStatusNormalized = normalizeStatus(order.status);
    const currentStatusIndex = statusFlow.findIndex(
      step => normalizeStatus(step.status) === currentStatusNormalized
    );
    const stepIndex = statusFlow.findIndex(
      step => normalizeStatus(step.status) === normalizeStatus(stepStatus)
    );
    
    return currentStatusIndex >= stepIndex;
  };

  const isCurrentStep = (stepStatus: string): boolean => {
    if (!order) return false;
    
    // Handle dispatch variations
    if ((stepStatus === 'dispatch' || stepStatus === 'dispatched') &&
        (order.status === 'dispatch' || order.status === 'dispatched')) {
      return true;
    }
    
    return order.status === stepStatus;
  };

  const getExpectedDeliveryDate = (orderDate: string): string => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 5);
    
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStepDate = (stepIndex: number, orderDate: string): string => {
    const date = new Date(orderDate);
    date.setHours(date.getHours() + (stepIndex * 2));
    
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getProductName = (order: Order) => {
    const variant = order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
    const capColor = order.cap_color.charAt(0).toUpperCase() + order.cap_color.slice(1).replace('_', ' ');
    return `${variant} Bottle ${capColor} Cap - ${order.volume}ml`;
  };

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="mr-3 sm:mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
              aria-label="Back to dashboard"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Order Status</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Product Card */}
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            {/* Product Image */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
              {order.label_url ? (
                <Image
                  src={order.label_url}
                  alt="Label"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-white text-sm sm:text-base font-bold">Label</span>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                {getProductName(order)}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Qty {order.qty.toLocaleString()} pcs
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="capitalize">{order.variant}</span> | {order.volume}ml
              </p>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected Delivery Date</span>
              <span className="text-sm font-medium text-gray-900">
                {getExpectedDeliveryDate(order.created_at)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Invoice No.</span>
              <span className="text-sm font-medium text-gray-900 font-mono break-all text-right">
                {order.order_id.slice(0, 13)}...
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Order Status</span>
              <span className={`text-sm font-medium px-2 py-1 rounded-full capitalize ${
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'payment_uploaded' ? 'bg-indigo-100 text-indigo-700' :
                order.status === 'processing' ? 'bg-orange-100 text-orange-700' :
                order.status === 'printing' ? 'bg-blue-100 text-blue-700' :
                order.status === 'dispatch' || order.status === 'dispatched' ? 'bg-cyan-100 text-cyan-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {order.status === 'payment_uploaded' ? 'Payment Uploaded' : order.status}
              </span>
            </div>
            {/* ✅ Payment status indicator */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment Status</span>
              <span className="text-sm font-medium text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
            Congrats your Order is Approved!
          </h2>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8">Order Status</h3>

          <div className="space-y-0">
            {statusFlow.map((step, index) => {
              const isCompleted = isStepCompleted(step.status);
              const isCurrent = isCurrentStep(step.status);
              
              return (
                <div key={index} className="flex items-start">
                  {/* Timeline Indicator */}
                  <div className="flex flex-col items-center mr-3 sm:mr-4">
                    {/* Circle with checkmark */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                    }`}>
                      <svg 
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${isCompleted ? 'text-white' : 'text-white'}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {/* Connector line */}
                    {index < statusFlow.length - 1 && (
                      <div className={`w-0.5 h-16 sm:h-20 transition-colors duration-300 ${
                        isStepCompleted(statusFlow[index + 1].status) ? 'bg-green-600' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div className={`flex-1 ${index < statusFlow.length - 1 ? 'pb-16 sm:pb-20' : 'pb-0'}`}>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`text-sm sm:text-base font-semibold mb-1 ${
                            isCompleted ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </h4>
                          {isCompleted && (
                            <p className="text-xs sm:text-sm text-gray-600">
                              {getStepDate(index, order.created_at)}
                            </p>
                          )}
                        </div>
                        {isCurrent && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-full font-medium whitespace-nowrap">
                            Current
                          </span>
                        )}
                      </div>
                      <p className={`text-xs sm:text-sm ${
                        isCompleted ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                      {index === statusFlow.length - 1 && (
                        <p className="text-xs text-gray-400 mt-1">
                          estimated arrival time {getExpectedDeliveryDate(order.created_at)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-900 font-medium py-3 px-4 sm:px-6 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base cursor-pointer"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push('/order')}
            className="flex-1 bg-[#4A90E2] hover:bg-[#357ABD] text-white font-medium py-3 px-4 sm:px-6 rounded-xl transition-colors text-sm sm:text-base cursor-pointer"
          >
            Create New Order
          </button>
        </div>
      </div>
    </div>
  );
}
