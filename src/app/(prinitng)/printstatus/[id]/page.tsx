'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { printService, Order } from '@/app/services/printService';
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

export default function PrintingOrderStatusPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        toast.error('Invalid order ID');
        router.push('/dashboard');
        return;
      }

      try {
        setLoading(true);
        const response = await printService.getAllOrders({ limit: 100, offset: 0 });
        const foundOrder = response.orders.find((o) => o.order_id === orderId);

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          toast.error('Order not found');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  const getOrderTimeline = (): OrderTimelineStep[] => {
    if (!order) return [];

    const statusOrder = ['placed', 'printing', 'processing', 'dispatch'];
    const currentStatusIndex = statusOrder.indexOf(order.status);

    return [
      {
        status: 'placed',
        label: 'Order Placed',
        date: formatDateTime(order.created_at),
        isCompleted: true,
        isCurrent: currentStatusIndex === 0,
      },
      {
        status: 'printing',
        label: 'Printing your label',
        date: currentStatusIndex >= 1 ? formatDateTime(order.updated_at) : undefined,
        isCompleted: currentStatusIndex >= 1,
        isCurrent: currentStatusIndex === 1,
      },
      {
        status: 'processing',
        label: 'Processing your order',
        date: currentStatusIndex >= 2 ? formatDateTime(order.updated_at) : undefined,
        isCompleted: currentStatusIndex >= 2,
        isCurrent: currentStatusIndex === 2,
      },
      {
        status: 'dispatch',
        label: 'ready to dispatch',
        date: currentStatusIndex >= 3 ? formatDateTime(order.updated_at) : undefined,
        estimatedArrival:
          currentStatusIndex === 3
            ? `estimated arrival time ${formatDate(new Date(order.updated_at).setDate(new Date(order.updated_at).getDate() + 7))} by 11 AM`
            : undefined,
        isCompleted: currentStatusIndex >= 3,
        isCurrent: currentStatusIndex === 3,
      },
    ];
  };

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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getProductName = () => {
    if (!order) return '';
    const variant = order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
    return `Enerzyflow ${variant} Bottle`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  const timeline = getOrderTimeline();
  const expectedDeliveryDate = formatDate(
    new Date(order.created_at).setDate(new Date(order.created_at).getDate() + 5)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 sticky top-0 z-10 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-1"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Order Status</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Product Card */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg flex items-center justify-center">
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
                <span className="text-2xl font-bold text-gray-900">spicy</span>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                {getProductName()}
              </h3>
              <p className="text-sm text-gray-600 mb-1">Qty {order.qty} pcs</p>
              <p className="text-base font-semibold text-gray-900">${order.qty * 1}</p>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Order Details</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected Delivery Date</span>
              <span className="text-sm font-medium text-gray-900">{expectedDeliveryDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Work order</span>
              <span className="text-sm font-medium text-blue-600">
                {order.order_id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-6">Order Status</h2>

          <div className="space-y-8">
            {timeline.map((step, index) => (
              <div key={step.status} className="relative flex gap-4">
                {/* Timeline Line */}
                {index < timeline.length - 1 && (
                  <div
                    className={`absolute left-[15px] top-8 w-0.5 h-[calc(100%+0.5rem)] ${
                      step.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}

                {/* Status Icon */}
                <div className="flex-shrink-0 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    {step.isCompleted && (
                      <CheckCircle className="w-5 h-5 text-white fill-current" />
                    )}
                  </div>
                </div>

                {/* Status Info */}
                <div className="flex-1 pb-2">
                  <h3 className="text-base font-medium text-gray-900 capitalize">
                    {step.label}
                  </h3>
                  {step.date && (
                    <p className="text-sm text-gray-500 mt-0.5">{step.date}</p>
                  )}
                  {step.estimatedArrival && (
                    <p className="text-xs text-gray-400 mt-1">{step.estimatedArrival}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
