'use client';

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { orderService } from '@/app/services/orderService';
import type { Order } from '@/app/services/orderService';

// ✅ Constants outside component
const VALID_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ✅ Helper functions outside component
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
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

// ✅ Memoized LoadingSpinner
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading order details...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// ✅ Memoized OrderDetailsCard
const OrderDetailsCard = memo(({ order }: { order: Order }) => (
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
        <h2 className="text-lg font-semibold text-gray-900">{getProductName(order)}</h2>
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
        <span className="text-sm font-medium text-gray-900">{formatDate(order.created_at)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Expected Delivery</span>
        <span className="text-sm font-medium text-green-600">{formatDate(order.expected_delivery)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Order ID</span>
        <span className="text-sm font-medium text-gray-900 font-mono">
          {order.order_id.slice(0, 13)}...
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Order Status</span>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          orderService.getOrderStatusColor(order.status)
        }`}>
          {orderService.formatOrderStatus(order.status)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Payment Status</span>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          orderService.getPaymentStatusColor(order.payment_status)
        }`}>
          {orderService.formatPaymentStatus(order.payment_status)}
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
          <p className="text-sm font-semibold text-blue-900">Important</p>
          <p className="text-sm text-blue-700 mt-1">
            Please upload payment screenshot to proceed with order processing.
          </p>
        </div>
      </div>
    </div>
  </div>
));

OrderDetailsCard.displayName = 'OrderDetailsCard';

// ✅ Memoized InvoiceSection
const InvoiceSection = memo(({ 
  invoiceUrl, 
  onDownload 
}: { 
  invoiceUrl?: string; 
  onDownload: () => void;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="font-semibold text-gray-900 mb-4">Invoice</h3>
    
    {invoiceUrl ? (
      <button
        onClick={onDownload}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download Invoice
      </button>
    ) : (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm text-gray-600 mb-1 font-medium">No invoice available yet</p>
        <p className="text-xs text-gray-500">Invoice will be generated after order confirmation</p>
      </div>
    )}
  </div>
));

InvoiceSection.displayName = 'InvoiceSection';

// ✅ NEW: Memoized PISection
const PISection = memo(({ 
  piUrl, 
  onDownload 
}: { 
  piUrl?: string; 
  onDownload: () => void;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="font-semibold text-gray-900 mb-4">Proforma Invoice (PI)</h3>
    
    {piUrl ? (
      <button
        onClick={onDownload}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download PI
      </button>
    ) : (
      <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center bg-purple-50">
        <svg className="w-12 h-12 mx-auto text-purple-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm text-purple-600 mb-1 font-medium">No PI available yet</p>
        <p className="text-xs text-purple-500">PI will be generated after order confirmation</p>
      </div>
    )}
  </div>
));

PISection.displayName = 'PISection';

// ✅ Memoized PaymentUploadSection
const PaymentUploadSection = memo(({
  uploadSuccess,
  paymentUrl,
  paymentFile,
  uploadError,
  isUploadingPayment,
  onFileChange,
  onUpload
}: {
  uploadSuccess: boolean;
  paymentUrl?: string;
  paymentFile: File | null;
  uploadError: string | null;
  isUploadingPayment: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="font-semibold text-gray-900 mb-4">
      Upload payment screenshot {uploadSuccess && '✓'}
    </h3>
    
    {uploadSuccess ? (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-700 font-medium">Payment screenshot uploaded successfully!</span>
        </div>
        {paymentUrl && (
          <div className="mt-3">
            <Image
              src={paymentUrl}
              alt="Payment Screenshot"
              width={200}
              height={200}
              className="rounded-lg border border-green-200"
              unoptimized
            />
          </div>
        )}
      </div>
    ) : (
      <>
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-800">
              <strong>Required:</strong> You must upload payment screenshot to track your order
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block w-full">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
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

        {uploadError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        )}

        <button
          onClick={onUpload}
          disabled={!paymentFile || isUploadingPayment}
          className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
));

PaymentUploadSection.displayName = 'PaymentUploadSection';

export default function InvoiceDownloadPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingPayment, setIsUploadingPayment] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchAttempted = useRef(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || fetchAttempted.current) return;
      
      fetchAttempted.current = true;
      
      try {
        const response = await orderService.getOrder(orderId);
        setOrder(response.order);
        
        if (response.order.payment_status === 'payment_uploaded' || 
            response.order.payment_status === 'payment_verified') {
          setUploadSuccess(true);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        fetchAttempted.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!VALID_FILE_TYPES.includes(file.type)) {
        setUploadError('Please upload a valid image file (JPG, PNG)');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setUploadError('File size must be less than 10MB');
        return;
      }

      setPaymentFile(file);
      setUploadError(null);
    }
  }, []);

  const handleUploadPayment = useCallback(async () => {
    if (!paymentFile) return;

    setIsUploadingPayment(true);
    setUploadError(null);
    
    try {
      const response = await orderService.uploadPaymentScreenshot(orderId, paymentFile);
      setUploadSuccess(true);
      
      if (order) {
        setOrder({
          ...order,
          payment_status: 'payment_uploaded',
          payment_url: response.url
        });
      }
      
      setTimeout(() => {
        router.push(`/order/${orderId}/status`);
      }, 1500);
    } catch (error) {
      console.error('❌ Upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload payment screenshot');
    } finally {
      setIsUploadingPayment(false);
    }
  }, [paymentFile, orderId, order, router]);

  const handleDownloadInvoice = useCallback(() => {
    if (!order?.invoice_url) {
      alert('No invoice available yet. Invoice will be generated after order confirmation.');
      return;
    }
    window.open(order.invoice_url, '_blank', 'noopener,noreferrer');
  }, [order]);

  // ✅ NEW: Handler for downloading PI
  const handleDownloadPI = useCallback(() => {
    if (!order?.pi_url) {
      alert('No Proforma Invoice available yet. PI will be generated after order confirmation.');
      return;
    }
    window.open(order.pi_url, '_blank', 'noopener,noreferrer');
  }, [order]);

  const handleTrackOrder = useCallback(() => {
    if (!uploadSuccess && order?.payment_status === 'payment_pending') {
      alert('Please upload payment screenshot before tracking your order');
      return;
    }
    router.push(`/order/${orderId}/status`);
  }, [uploadSuccess, order, orderId, router]);

  const handleBack = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  // ✅ Memoized computed values
  const canTrackOrder = useMemo(
    () => uploadSuccess || order?.payment_status !== 'payment_pending',
    [uploadSuccess, order?.payment_status]
  );

  if (isLoading) return <LoadingSpinner />;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <button
            onClick={handleBack}
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Invoice & Payment</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderDetailsCard order={order} />

          {/* Actions Column */}
          <div className="space-y-6">
            {/* ✅ Documents Section - Stacked vertically */}
            <InvoiceSection 
              invoiceUrl={order.invoice_url} 
              onDownload={handleDownloadInvoice} 
            />

            <PISection 
              piUrl={order.pi_url} 
              onDownload={handleDownloadPI} 
            />

            <PaymentUploadSection
              uploadSuccess={uploadSuccess}
              paymentUrl={order.payment_url}
              paymentFile={paymentFile}
              uploadError={uploadError}
              isUploadingPayment={isUploadingPayment}
              onFileChange={handleFileChange}
              onUpload={handleUploadPayment}
            />

            {/* Track Order Button */}
            <button
              onClick={handleTrackOrder}
              disabled={!canTrackOrder}
              className={`w-full font-medium py-2 text-center cursor-pointer rounded-xl transition-colors ${
                canTrackOrder
                  ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {canTrackOrder ? 'Track your order now →' : '🔒 Upload payment to track order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
