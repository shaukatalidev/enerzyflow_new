"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { orderService } from "@/app/services/orderService";
import type { Order } from "@/app/services/orderService";
import type { OrderStatusHistory } from "@/app/services/adminService";

interface OrderTimelineStep {
  status: string;
  label: string;
  description: string;
}

// ✅ Constants outside component
const STATUS_FLOW: OrderTimelineStep[] = [
  {
    status: "placed",
    label: "Order Placed",
    description: "Your order has been received",
  },
  {
    status: "printing",
    label: "Printing your label",
    description: "Labels are being printed",
  },
  {
    status: "ready_for_plant",
    label: "Ready for Plant",
    description: "Printing complete, ready for processing",
  },
  {
    status: "plant_processing",
    label: "Processing your order",
    description: "Order is being prepared at the plant",
  },
  {
    status: "dispatched",
    label: "Dispatched",
    description: "Order has been dispatched",
  },
  {
    status: "completed",
    label: "Delivered",
    description: "Order has been completed",
  },
];

// ✅ Helper functions outside component
const normalizeStatus = (status: string) =>
  status.toLowerCase().replace(/[-_]/g, "_");

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getProductName = (order: Order) => {
  const variant =
    order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
  const capColor =
    order.cap_color.charAt(0).toUpperCase() +
    order.cap_color.slice(1).replace("_", " ");
  return `${variant} Bottle ${capColor} Cap - ${order.volume}ml`;
};

// ✅ Memoized Loading component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading order details...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

// ✅ Memoized Product Card
const ProductCard = memo(({ order }: { order: Order }) => (
  <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
    <div className="flex items-start space-x-3 sm:space-x-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
        {order.label_url ? (
          <div className="relative w-full h-full">
            <Image
              src={order.label_url}
              alt="Label"
              fill
              className="object-contain p-1"
              sizes="(max-width: 640px) 64px, 80px"
              unoptimized
            />
          </div>
        ) : (
          <span className="text-white text-sm sm:text-base font-bold">
            Label
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2">
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
));

ProductCard.displayName = "ProductCard";

// ✅ Memoized Order Details Card
const OrderDetailsCard = memo(({ order }: { order: Order }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
      Order Details
    </h3>

    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Expected Delivery Date</span>
        <span className="text-sm font-medium text-gray-900">
          {formatDate(order.expected_delivery)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Order ID</span>
        <span className="text-sm font-medium text-gray-900 font-mono break-all text-right">
          {order.order_id.slice(0, 13)}...
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Order Status</span>
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${orderService.getOrderStatusColor(
            order.status
          )}`}
        >
          {orderService.formatOrderStatus(order.status)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Payment Status</span>
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full flex items-center ${orderService.getPaymentStatusColor(
            order.payment_status
          )}`}
        >
          {order.payment_status === "payment_verified" && (
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {orderService.formatPaymentStatus(order.payment_status)}
        </span>
      </div>
    </div>
  </div>
));

OrderDetailsCard.displayName = "OrderDetailsCard";

// ✅ Memoized Invoice Section
const InvoiceSection = memo(
  ({
    invoiceUrl,
    onDownload,
  }: {
    invoiceUrl?: string;
    onDownload: () => void;
  }) => (
    <div className="mb-4 sm:mb-6">
      {invoiceUrl ? (
        <button
          onClick={onDownload}
          className="w-full bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 sm:px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download Invoice
        </button>
      ) : (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm text-gray-600 font-medium mb-1">
            No invoice available yet
          </p>
          <p className="text-xs text-gray-500">
            Invoice will be generated after order confirmation
          </p>
        </div>
      )}
    </div>
  )
);

InvoiceSection.displayName = "InvoiceSection";

// ✅ Add this new memoized component after InvoiceSection

// ✅ Memoized PI Section
const PISection = memo(
  ({ piUrl, onDownload }: { piUrl?: string; onDownload: () => void }) => (
    <div className="mb-4 sm:mb-6">
      {piUrl ? (
        <button
          onClick={onDownload}
          className="w-full bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 font-medium py-3 px-4 sm:px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download Proforma Invoice (PI)
        </button>
      ) : (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center">
          <svg
            className="w-12 h-12 mx-auto text-purple-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm text-purple-600 font-medium mb-1">
            No Proforma Invoice available yet
          </p>
          <p className="text-xs text-purple-500">
            PI will be generated after order confirmation
          </p>
        </div>
      )}
    </div>
  )
);

PISection.displayName = "PISection";

// ✅ Memoized Timeline Step
const TimelineStep = memo(
  ({
    step,
    isCompleted,
    isCurrent,
    stepDate,
    isLastStep,
    nextStepCompleted,
    expectedDelivery,
  }: {
    step: OrderTimelineStep;
    index: number;
    isCompleted: boolean;
    isCurrent: boolean;
    stepDate: string | null;
    isLastStep: boolean;
    nextStepCompleted: boolean;
    expectedDelivery?: string;
  }) => (
    <div className="flex items-start">
      <div className="flex flex-col items-center mr-3 sm:mr-4">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isCompleted ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {!isLastStep && (
          <div
            className={`w-0.5 h-16 sm:h-20 transition-colors duration-300 ${
              nextStepCompleted ? "bg-green-600" : "bg-gray-300"
            }`}
          ></div>
        )}
      </div>

      <div className={`flex-1 ${!isLastStep ? "pb-16 sm:pb-20" : "pb-0"}`}>
        <div className="flex flex-col space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4
                className={`text-sm sm:text-base font-semibold mb-1 ${
                  isCompleted ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.label}
              </h4>
              {isCompleted && stepDate && (
                <p className="text-xs sm:text-sm text-gray-600">{stepDate}</p>
              )}
            </div>
            {isCurrent && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-full font-medium whitespace-nowrap">
                Current
              </span>
            )}
          </div>
          <p
            className={`text-xs sm:text-sm ${
              isCompleted ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {step.description}
          </p>
          {isLastStep && expectedDelivery && (
            <p className="text-xs text-gray-400 mt-1">
              Estimated arrival: {formatDate(expectedDelivery)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
);

TimelineStep.displayName = "TimelineStep";

export default function OrderStatusPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderStatusHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttempted = useRef(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || fetchAttempted.current) return;

      fetchAttempted.current = true;

      try {
        const orderResponse = await orderService.getOrder(orderId);
        setOrder(orderResponse.order);

        if (orderResponse.order.payment_status === "payment_pending") {
          alert("Please upload payment screenshot before tracking your order");
          router.push(`/dashboard/order/${orderId}/invoice`);
          return;
        }

        try {
          const trackingResponse = await orderService.getOrderTracking(orderId);
          setOrderHistory(trackingResponse.history || []);
        } catch (trackingError) {
          console.error("Failed to fetch tracking history:", trackingError);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
        fetchAttempted.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  // ✅ Memoized step completion check
  const isStepCompleted = useCallback(
    (stepStatus: string): boolean => {
      if (!order) return false;

      const currentStatusIndex = STATUS_FLOW.findIndex(
        (step) => normalizeStatus(step.status) === normalizeStatus(order.status)
      );

      const stepIndex = STATUS_FLOW.findIndex(
        (step) => normalizeStatus(step.status) === normalizeStatus(stepStatus)
      );

      if (currentStatusIndex === -1 || stepIndex === -1) return false;
      return stepIndex <= currentStatusIndex;
    },
    [order]
  );

  // ✅ Memoized current step check
  const isCurrentStep = useCallback(
    (stepStatus: string): boolean => {
      if (!order) return false;
      return normalizeStatus(order.status) === normalizeStatus(stepStatus);
    },
    [order]
  );

  // ✅ Memoized step date getter
  const getStepDate = useCallback(
    (stepStatus: string): string | null => {
      const historyItem = orderHistory.find(
        (item) => normalizeStatus(item.status) === normalizeStatus(stepStatus)
      );

      if (!historyItem) return null;
      return formatDateTime(historyItem.changed_at);
    },
    [orderHistory]
  );

  // ✅ Memoized download handler for Invoice
  const handleDownloadInvoice = useCallback(() => {
    if (!order) return;

    if (order.invoice_url) {
      window.open(order.invoice_url, "_blank", "noopener,noreferrer");
    } else {
      alert(
        "No invoice available yet. Invoice will be generated after order confirmation."
      );
    }
  }, [order]);

  // ✅ NEW: Memoized download handler for PI
  const handleDownloadPI = useCallback(() => {
    if (!order) return;

    if (order.pi_url) {
      window.open(order.pi_url, "_blank", "noopener,noreferrer");
    } else {
      alert(
        "No Proforma Invoice available yet. PI will be generated after order confirmation."
      );
    }
  }, [order]);

  const handleBackToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleCreateNewOrder = useCallback(() => {
    router.push("/dashboard/order");
  }, [router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <button
            onClick={handleBackToDashboard}
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
              onClick={handleBackToDashboard}
              className="mr-3 sm:mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
              aria-label="Back to dashboard"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Order Status
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <ProductCard order={order} />
        <OrderDetailsCard order={order} />

        {/* ✅ Documents Section - Side by Side on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 sm:mb-6">
          <InvoiceSection
            invoiceUrl={order.invoice_url}
            onDownload={handleDownloadInvoice}
          />
          <PISection piUrl={order.pi_url} onDownload={handleDownloadPI} />
        </div>

        {/* Success Banner */}
        {order.payment_status === "payment_verified" && (
          <div className="mb-4 sm:mb-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
              Congrats your Order is Approved!
            </h2>
          </div>
        )}

        {/* Order Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8">
            Order Status
          </h3>

          <div className="space-y-0">
            {STATUS_FLOW.map((step, index) => {
              const isCompleted = isStepCompleted(step.status);
              const isCurrent = isCurrentStep(step.status);
              const stepDate = getStepDate(step.status);
              const isLastStep = index === STATUS_FLOW.length - 1;
              const nextStepCompleted =
                !isLastStep && isStepCompleted(STATUS_FLOW[index + 1].status);

              return (
                <TimelineStep
                  key={step.status}
                  step={step}
                  index={index}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                  stepDate={stepDate}
                  isLastStep={isLastStep}
                  nextStepCompleted={nextStepCompleted}
                  expectedDelivery={order.expected_delivery}
                />
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleBackToDashboard}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-900 font-medium py-3 px-4 sm:px-6 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base cursor-pointer"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleCreateNewOrder}
            className="flex-1 bg-[#4A90E2] hover:bg-[#357ABD] text-white font-medium py-3 px-4 sm:px-6 rounded-xl transition-colors text-sm sm:text-base cursor-pointer"
          >
            Create New Order
          </button>
        </div>
      </div>
    </div>
  );
}
