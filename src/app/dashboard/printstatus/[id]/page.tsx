'use client';

import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { printService } from '@/app/services/printService';
import type { AllOrderModel, OrderStatusHistory } from '@/app/services/adminService';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderTimelineStep {
  status: string;
  label: string;
  date?: string;
  estimatedArrival?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

// ✅ Constants outside component
const STATUS_ORDER = [
  'placed',
  'printing',
  'ready_for_plant',
  'plant_processing',
  'dispatched',
  'completed'
] as const;

const STATUS_LABELS: Record<string, string> = {
  'placed': 'Order Placed',
  'printing': 'Printing your label',
  'ready_for_plant': 'Ready for Plant',
  'plant_processing': 'Processing your order',
  'dispatched': 'Dispatched',
  'completed': 'Completed',
};

// ✅ Helper functions outside component
const normalizeStatus = (status: string) => 
  status.toLowerCase().replace(/[-_]/g, '_');

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getProductName = (order: AllOrderModel) => {
  const variant = order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
  const capColor = order.cap_color.charAt(0).toUpperCase() + 
    order.cap_color.slice(1).replace('_', ' ');
  return `${variant} Bottle ${capColor} Cap - ${order.volume}ml`;
};

// ✅ Memoized Loading component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading order details...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// ✅ Memoized Product Card
const ProductCard = memo(({ order }: { order: AllOrderModel }) => (
  <div className="bg-gray-50 rounded-2xl p-4 mb-6">
    <div className="flex items-start gap-4">
      <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden">
        {order.label_url ? (
          <Image
            src={order.label_url}
            alt="Product"
            width={80}
            height={80}
            className="object-contain"
            unoptimized
          />
        ) : (
          <span className="text-2xl font-bold text-gray-900">Label</span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-base font-medium text-gray-900 mb-1">
          {getProductName(order)}
        </h3>
        <p className="text-sm text-gray-600 mb-1">Qty {order.qty.toLocaleString()} pcs</p>
        <p className="text-sm text-gray-600">
          <span className="capitalize">{order.variant}</span> | {order.volume}ml
        </p>
      </div>
    </div>
  </div>
));

ProductCard.displayName = 'ProductCard';

// ✅ Memoized Order Details Card
const OrderDetailsCard = memo(({ order }: { order: AllOrderModel }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
    <h2 className="text-base font-semibold text-gray-900 mb-4">Order Details</h2>

    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Expected Delivery Date</span>
        <span className="text-sm font-medium text-gray-900">
          {formatDate(order.expected_delivery)}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Work order</span>
        <span className="text-sm font-medium text-blue-600 font-mono">
          {order.order_id.slice(0, 13)}...
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Order Status</span>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          printService.getStatusColorClass(order.status)
        }`}>
          {printService.getStatusLabel(order.status)}
        </span>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <span className="text-sm text-gray-600">Company</span>
        <span className="text-sm font-medium text-gray-900">{order.company_name}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Ordered By</span>
        <span className="text-sm font-medium text-gray-900">{order.user_name}</span>
      </div>
    </div>
  </div>
));

OrderDetailsCard.displayName = 'OrderDetailsCard';

// ✅ Memoized Timeline Step
const TimelineStep = memo(({ 
  step, 
  isLast 
}: { 
  step: OrderTimelineStep; 
  isLast: boolean;
}) => (
  <div className="relative flex gap-4">
    {!isLast && (
      <div
        className={`absolute left-[15px] top-8 w-0.5 h-[calc(100%+0.5rem)] ${
          step.isCompleted ? 'bg-green-500' : 'bg-gray-300'
        }`}
      />
    )}

    <div className="flex-shrink-0 z-10">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          step.isCompleted ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        {step.isCompleted && (
          <CheckCircle className="w-5 h-5 text-white fill-current" />
        )}
      </div>
    </div>

    <div className="flex-1 pb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className={`text-base font-medium mb-1 ${
            step.isCompleted ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {step.label}
          </h3>
          {step.date && (
            <p className="text-sm text-gray-600">{step.date}</p>
          )}
          {step.estimatedArrival && (
            <p className="text-xs text-gray-400 mt-1">{step.estimatedArrival}</p>
          )}
        </div>
        {step.isCurrent && (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium whitespace-nowrap">
            Current
          </span>
        )}
      </div>
    </div>
  </div>
));

TimelineStep.displayName = 'TimelineStep';

export default function PrintingOrderStatusPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<AllOrderModel | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        toast.error('Invalid order ID');
        router.push('/dashboard');
        return;
      }

      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        
        const response = await printService.getAllOrders(100, 0);
        const foundOrder = response.orders.find((o) => o.order_id === orderId);

        if (!foundOrder) {
          toast.error('Order not found');
          router.push('/dashboard');
          return;
        }

        setOrder(foundOrder);

        try {
          const trackingResponse = await printService.getOrderTracking(orderId);
          setOrderHistory(trackingResponse.history || []);
        } catch (trackingError) {
          console.error('Failed to fetch tracking history:', trackingError);
          toast.error('Could not load tracking history');
        }

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [orderId, router]);

  // ✅ Memoized timeline calculation - only recalculate when order or history changes
  const timeline = useMemo((): OrderTimelineStep[] => {
    if (!order) return [];

    const currentStatusIndex = STATUS_ORDER.findIndex(
      s => normalizeStatus(s) === normalizeStatus(order.status)
    );

    return STATUS_ORDER.map((status, index) => {
      const historyItem = orderHistory.find(
        (item) => normalizeStatus(item.status) === normalizeStatus(status)
      );
      
      const isCompleted = !!historyItem || currentStatusIndex > index;
      const isCurrent = normalizeStatus(order.status) === normalizeStatus(status);

      return {
        status,
        label: STATUS_LABELS[status] || status,
        date: historyItem ? formatDateTime(historyItem.changed_at) : undefined,
        estimatedArrival:
          status === 'dispatched' && isCurrent && order.expected_delivery
            ? `Estimated arrival ${formatDate(order.expected_delivery)}`
            : undefined,
        isCompleted,
        isCurrent,
      };
    });
  }, [order, orderHistory]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 sticky top-0 z-10 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Order Status</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <ProductCard order={order} />
        <OrderDetailsCard order={order} />

        {/* Order Status Timeline */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Order Status</h2>

          <div className="space-y-8">
            {timeline.map((step, index) => (
              <TimelineStep
                key={step.status}
                step={step}
                isLast={index === timeline.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
