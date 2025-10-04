'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { orderService, Order } from '@/app/services/orderService';

export default function InvoiceDownloadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingPayment, setIsUploadingPayment] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // ✅ FIX: Add ref to track if fetch has been attempted
  const fetchAttempted = useRef(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      // ✅ Prevent multiple fetches
      if (!orderId || fetchAttempted.current) return;
      
      fetchAttempted.current = true;
      
      try {
        const response = await orderService.getOrder(orderId);
        setOrder(response.order);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        fetchAttempted.current = false; // ✅ Reset on error to allow retry
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]); // ✅ orderId is stable from searchParams

  // Calculate expected delivery date (order date + 5 days)
  const getExpectedDeliveryDate = (orderDate: string): string => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 5);
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get product name from order
  const getProductName = (order: Order) => {
    const variant = order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
    const capColor = order.cap_color.charAt(0).toUpperCase() + order.cap_color.slice(1).replace('_', ' ');
    return `${variant} Bottle ${capColor} Cap - ${order.volume}ml`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentFile(file);
    }
  };

  const handleUploadPayment = async () => {
    if (!paymentFile) return;

    setIsUploadingPayment(true);
    
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Replace with actual upload logic
      // const formData = new FormData();
      // formData.append('payment_screenshot', paymentFile);
      // formData.append('order_id', orderId);
      // await axiosInstance.post('/orders/upload-payment', formData);
      
      setUploadSuccess(true);
      
      // Redirect to order status after successful upload
      setTimeout(() => {
        router.push(`/order/status?orderId=${orderId}`);
      }, 1500);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploadingPayment(false);
    }
  };

  const handleDownloadInvoice = () => {
    // Implement invoice download logic
    // window.open(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/invoice`, '_blank');
    console.log('Downloading invoice for order:', orderId);
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
            className="mt-4 text-blue-600 hover:text-blue-700"
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Invoice Download</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                {order.label_url ? (
                  <Image
                    src={order.label_url}
                    alt="Label"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-white text-xs font-bold">Label</span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {getProductName(order)}
                </h2>
                <p className="text-sm text-gray-600">Qty: {order.qty.toLocaleString()} pcs</p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="capitalize">{order.variant}</span> | {order.volume}ml
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Order Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(order.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expected Delivery Date</span>
                <span className="text-sm font-medium text-green-600">
                  {getExpectedDeliveryDate(order.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Invoice No.</span>
                <span className="text-sm font-medium text-gray-900 font-mono">
                  {order.order_id.slice(0, 13)}...
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full capitalize ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'processing' ? 'bg-orange-100 text-orange-700' :
                  order.status === 'printing' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Info Banner */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Delivery Timeline</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Your order will be delivered within 5 business days from the order date.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="space-y-6">
            {/* Download Invoice Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Download your PI / Invoice</h3>
              <button
                onClick={handleDownloadInvoice}
                className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PI / Invoice
              </button>
            </div>

            {/* Upload Payment Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Upload payment screenshot</h3>
              
              {uploadSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-700 font-medium">Payment screenshot uploaded successfully!</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block w-full">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {paymentFile ? (
                          <p className="text-sm text-gray-900 font-medium">{paymentFile.name}</p>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600 mb-1">Click to upload payment screenshot</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={handleUploadPayment}
                    disabled={!paymentFile || isUploadingPayment}
                    className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingPayment ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      'Upload payment screenshot'
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Track Order Link */}
            <button
              onClick={() => router.push(`/order/status?orderId=${orderId}`)}
              className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 text-center"
            >
              Track your order now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
