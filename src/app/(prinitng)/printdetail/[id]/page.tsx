"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { printService } from "@/app/services/printService";
import type { AllOrderModel } from "@/app/services/adminService";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PrintingOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<AllOrderModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const declineReasons = [
    "Capacity full",
    "Technical issues",
    "Insufficient resources",
    "Service unavailable",
    "Other commitments",
  ];

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        toast.error("Invalid order ID");
        router.push("/dashboard");
        return;
      }

      try {
        setLoading(true);
        const response = await printService.getAllOrders({
          limit: 100,
          offset: 0,
        });
        const foundOrder = response.orders.find((o) => o.order_id === orderId);

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          toast.error("Order not found");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  const handleAccept = async () => {
    if (!order) return;

    setActionLoading(true);
    try {
      const response = await printService.startPrinting(order.order_id);
      toast.success(response.message || "Order accepted and moved to printing");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to accept order");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineSubmit = async () => {
    if (!order || !declineReason) {
      toast.error("Please select a reason");
      return;
    }

    setActionLoading(true);
    try {
      const response = await printService.declineOrder(
        order.order_id,
        declineReason
      );
      toast.success(response.message || "Order declined successfully");
      setShowDeclineModal(false);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to decline order");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const getProductName = () => {
    if (!order) return "";
    const variant =
      order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
    const capColor = order.cap_color
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return `${variant} Bottle ${capColor} Cap Label`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysUntilDelivery = (expectedDelivery: string) => {
    const expected = new Date(expectedDelivery);
    const now = new Date();
    const diffTime = expected.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = (expectedDelivery: string) => {
    const expected = new Date(expectedDelivery);
    const now = new Date();
    return now > expected;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const canTakeAction = order.status === "placed";
  const daysRemaining = getDaysUntilDelivery(order.expected_delivery);
  const overdue = isOverdue(order.expected_delivery);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header - Sticky on mobile */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Printing Details
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Order Status Badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${printService.getStatusColorClass(
              order.status
            )}`}
          >
            {printService.getStatusLabel(order.status)}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${printService.getPaymentStatusColorClass(
              order.payment_status
            )}`}
          >
            {printService.formatPaymentStatus(order.payment_status)}
          </span>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Order Details
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {/* Work Order */}
              <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-600">
                  Work Order
                </span>
                <span className="text-xs sm:text-sm font-medium text-blue-600 font-mono">
                  {order.order_id.slice(0, 8).toUpperCase()}
                </span>
              </div>

              {/* Company Info */}
              <div className="pb-3 sm:pb-4 border-b border-gray-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Company</p>
                <p className="text-sm sm:text-base font-medium text-gray-900">
                  {order.company_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">by {order.user_name}</p>
              </div>

              {/* Expected Delivery */}
              <div className="pb-3 sm:pb-4 border-b border-gray-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  Expected Delivery
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900">
                      {formatDate(order.expected_delivery)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {overdue ? (
                      <span className="text-sm text-red-600 font-medium">
                        Overdue by {Math.abs(daysRemaining)} days
                      </span>
                    ) : (
                      <span
                        className={`text-sm font-medium ${
                          daysRemaining <= 2
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {daysRemaining} days left
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Final Label */}
              <div className="pb-3 sm:pb-4 border-b border-gray-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  Final Label
                </p>
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  {order.label_url ? (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                      <Image
                        src={order.label_url}
                        alt="Label"
                        fill
                        className="object-cover rounded-lg border border-gray-200"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                      {getProductName()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {order.variant}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="pb-3 sm:pb-4 border-b border-gray-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Qty</p>
                <p className="text-sm sm:text-base text-gray-900">
                  {order.qty} pcs
                </p>
              </div>

              {/* Size */}
              <div className="pb-3 sm:pb-4 border-b border-gray-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Size</p>
                <p className="text-sm sm:text-base text-gray-900">
                  {order.volume} ml
                </p>
              </div>

              {/* Cap Color */}
              <div className="pb-3 sm:pb-4 border-b border-gray-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Cap Color
                </p>
                <p className="text-sm sm:text-base text-gray-900 capitalize">
                  {order.cap_color.replace("_", " ")}
                </p>
              </div>

              {/* Order Date */}
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Order Date
                </p>
                <p className="text-sm text-gray-900">
                  {formatDate(order.created_at)}
                </p>
              </div>

              {/* Decline Reason (if declined) */}
              {order.status === "declined" && order.decline_reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mt-4">
                  <p className="text-xs sm:text-sm font-medium text-red-900 mb-1">
                    Decline Reason
                  </p>
                  <p className="text-xs sm:text-sm text-red-700">
                    {order.decline_reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons (only for placed orders) - Backend already filtered for payment */}
        {canTakeAction && (
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              disabled={actionLoading}
              className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Accept & Start Printing</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowDeclineModal(true)}
              disabled={actionLoading}
              className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
              <span>Decline Order</span>
            </button>
          </div>
        )}

        {/* Track Order Button (for printing/ready_for_plant orders) */}
        {!canTakeAction && order.status !== "declined" && (
          <button
            onClick={() => router.push(`/printstatus/${orderId}`)}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 sm:py-4 rounded-xl transition-colors shadow-sm text-sm sm:text-base cursor-pointer"
          >
            Track the order
          </button>
        )}
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-white/30 backdrop-blur-md">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-md sm:mx-4 animate-slide-up sm:animate-none shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Choose a reason for declining
            </h3>

            <div className="space-y-2 mb-6">
              {declineReasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    declineReason === reason
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="decline-reason"
                    value={reason}
                    checked={declineReason === reason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span className="ml-3 text-sm sm:text-base text-gray-900">
                    {reason}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setDeclineReason("");
                }}
                disabled={actionLoading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm sm:text-base cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineSubmit}
                disabled={!declineReason || actionLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
