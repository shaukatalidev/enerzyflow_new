"use client";

import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { printService } from "@/app/services/printService";
import type { AllOrderModel } from "@/app/services/adminService";
import {
  ChevronDown,
  X,
  Download,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import OrderComments from "@/components/OrderComments";

// ✅ Constants
const INITIAL_DISPLAY_COUNT = 3;
const DECLINE_REASONS = [
  "Capacity full",
  "Technical issues",
  "Insufficient resources",
  "Other commitments",
  "Service unavailable",
] as const;

// ✅ TypeScript Interfaces
interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

interface OrderCardProps {
  order: AllOrderModel;
  onAccept: (orderId: string) => void;
  onDecline: (orderId: string) => void;
  onMarkReady: (orderId: string) => void;
  onViewDetails: (orderId: string) => void;
  onViewComments: (orderId: string) => void;
  isLoading: boolean;
}

// ✅ Helper functions outside components
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getProductName = (order: AllOrderModel) => {
  const variant =
    order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
  const capColor =
    order.cap_color.charAt(0).toUpperCase() +
    order.cap_color.slice(1).replace("_", " ");
  return `${variant} Bottle ${capColor} Cap Label - ${order.volume}ml`;
};

// ✅ Download helper function
const downloadImage = async (
  imageUrl: string,
  fileName: string
): Promise<void> => {
  try {
    const response = await fetch(imageUrl, { mode: "cors" });
    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
  } catch (error) {
    console.error("Download failed:", error);
    window.open(imageUrl, "_blank");
    throw error;
  }
};

// ✅ DeclineModal Component
const DeclineModal = memo(
  ({ isOpen, onClose, onConfirm, isLoading }: DeclineModalProps) => {
    const [selectedReason, setSelectedReason] = useState("");

    const handleConfirm = useCallback(() => {
      if (selectedReason) {
        onConfirm(selectedReason);
      }
    }, [selectedReason, onConfirm]);

    useEffect(() => {
      if (!isOpen) setSelectedReason("");
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-md">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Choose a reason for Decline of order
          </h3>

          <div className="mb-6">
            <div className="relative">
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-blue-500 text-gray-900 bg-white cursor-pointer"
              >
                <option value="">Select reason</option>
                {DECLINE_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selectedReason || isLoading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
          >
            {isLoading ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    );
  }
);

DeclineModal.displayName = "DeclineModal";

// ✅ OrderCard Component - UPDATED with deadline and allow comments on previous orders
const OrderCard = memo(
  ({
    order,
    onAccept,
    onDecline,
    onMarkReady,
    onViewDetails,
    onViewComments,
    isLoading,
  }: OrderCardProps) => {
    // ✅ Memoize deadline info
    const deadlineInfo = useMemo(() => {
      const hasDeadline = !printService.isZeroDate(order.deadline);
      const deadlineDateTime = hasDeadline
        ? printService.formatDeadlineDateTime(order.deadline)
        : null;

      return {
        hasDeadline,
        deadlineDateTime,
      };
    }, [order.deadline]);

    // ✅ Download handler
    const handleDownloadLabel = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();

        const labelUrl = order.label_url || order.label_id;

        if (!labelUrl) {
          toast.error("Label not available");
          return;
        }

        try {
          const extension = labelUrl.split(".").pop()?.split("?")[0] || "jpg";
          await downloadImage(
            labelUrl,
            `label_${order.order_id.slice(0, 8)}.${extension}`
          );
          toast.success("Label downloaded successfully");
        } catch {
          toast.error("Download failed, opening in new tab");
          window.open(labelUrl, "_blank");
        }
      },
      [order.label_url, order.label_id, order.order_id]
    );

    const isClickable =
      order.status !== "placed" &&
      order.status !== "accepted" &&
      order.status !== "printing";

    return (
      <div
        onClick={isClickable ? () => onViewDetails(order.order_id) : undefined}
        className={`bg-gray-50 rounded-2xl p-4 mb-4 transition-shadow ${
          isClickable ? "cursor-pointer hover:shadow-md" : ""
        }`}
      >
        {/* Main horizontal layout */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Left side: Image + Details */}
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
              {order.label_url ? (
                <Image
                  src={order.label_url}
                  alt={`Label for ${order.company_name}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain p-2"
                  unoptimized
                />
              ) : (
                <span className="text-gray-400 text-xs sm:text-sm font-bold">
                  LABEL
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Client name: {order.company_name}
              </p>
              <p className="text-xs text-gray-500 mb-1">by {order.user_name}</p>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                {getProductName(order)}
              </h3>
              <p className="text-xs sm:text-sm text-blue-600 mb-1">
                Order ID: {order.order_id.slice(0, 10)}...
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Date: {formatDate(order.created_at)}
              </p>

              {/* ✅ NEW: Show deadline with date and time */}
              {deadlineInfo.hasDeadline && (
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  Deadline:{" "}
                  <span className="text-red-600 font-medium">
                    {deadlineInfo.deadlineDateTime}
                  </span>
                </p>
              )}

              <p className="text-xs sm:text-sm text-gray-900 font-medium">
                Quantity: {order.qty} units
              </p>
            </div>
          </div>

          {/* Right side: Download Button */}
          {order.label_url && (
            <button
              onClick={handleDownloadLabel}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 h-fit bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Label</span>
              <span className="sm:hidden">Download</span>
            </button>
          )}
        </div>

        {/* Bottom section: Action buttons */}
        <div className="mt-2">
          {/* No comment button for "placed" status */}
          {order.status === "placed" && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept(order.order_id);
                }}
                disabled={isLoading}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
              >
                Accept
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDecline(order.order_id);
                }}
                disabled={isLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
              >
                Decline
              </button>
            </div>
          )}

          {/* Show button with comments for "accepted" AND "printing" status */}
          {(order.status === "accepted" || order.status === "printing") && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkReady(order.order_id);
                }}
                disabled={isLoading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
              >
                Mark as Ready for Plant
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewComments(order.order_id);
                }}
                className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                title="View/Add Comments"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="hidden sm:inline">Comments</span>
              </button>
            </div>
          )}

          {/* ✅ UPDATED: Allow comments for previous orders */}
          {order.status !== "placed" &&
            order.status !== "accepted" &&
            order.status !== "printing" && (
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${printService.getStatusColorClass(
                      order.status
                    )}`}
                  >
                    {printService.getStatusLabel(order.status)}
                  </div>
                  {order.status === "declined" && order.decline_reason && (
                    <p className="text-xs text-red-600 mt-2">
                      Reason: {order.decline_reason}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {formatDate(order.updated_at)}
                  </p>
                </div>
                {/* ✅ UPDATED: Can add/view comments for previous orders */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewComments(order.order_id);
                  }}
                  className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  title="View/Add Comments"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Comments</span>
                </button>
              </div>
            )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.order.order_id === nextProps.order.order_id &&
      prevProps.order.status === nextProps.order.status &&
      prevProps.order.updated_at === nextProps.order.updated_at &&
      prevProps.order.deadline === nextProps.order.deadline &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);

OrderCard.displayName = "OrderCard";

// ✅ Main Dashboard Component
export default function PrintDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  // ✅ Consolidated state management
  const [orders, setOrders] = useState({
    upcoming: [] as AllOrderModel[],
    inProgress: [] as AllOrderModel[],
    previous: [] as AllOrderModel[],
  });

  const [expandedSections, setExpandedSections] = useState({
    upcoming: false,
    inProgress: false,
    previous: false,
  });

  const [uiState, setUiState] = useState({
    isLoading: true,
    actionLoading: false,
    showDeclineModal: false,
    selectedOrderId: null as string | null,
  });

  const [selectedCommentOrderId, setSelectedCommentOrderId] = useState<
    string | null
  >(null);

  const fetchAttempted = useRef(false);

  // ✅ Memoized displayed orders
  const displayedOrders = useMemo(
    () => ({
      upcoming: expandedSections.upcoming
        ? orders.upcoming
        : orders.upcoming.slice(0, INITIAL_DISPLAY_COUNT),
      inProgress: expandedSections.inProgress
        ? orders.inProgress
        : orders.inProgress.slice(0, INITIAL_DISPLAY_COUNT),
      previous: expandedSections.previous
        ? orders.previous
        : orders.previous.slice(0, INITIAL_DISPLAY_COUNT),
    }),
    [orders, expandedSections]
  );

  const fetchOrders = useCallback(async () => {
    try {
      setUiState((prev) => ({ ...prev, isLoading: true }));
      const response = await printService.getAllOrders(100, 0);
      const allOrders = response.orders || [];

      setOrders({
        upcoming: allOrders.filter((o) => o.status === "placed"),
        inProgress: allOrders.filter(
          (o) => o.status === "accepted" || o.status === "printing"
        ),
        previous: allOrders.filter(
          (o) =>
            o.status !== "placed" &&
            o.status !== "accepted" &&
            o.status !== "printing"
        ),
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setUiState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;
    fetchOrders();
  }, [fetchOrders]);

  const handleToggleSection = useCallback(
    (section: keyof typeof expandedSections) => {
      setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    },
    []
  );

  const handleAccept = useCallback(
    async (orderId: string) => {
      setUiState((prev) => ({ ...prev, actionLoading: true }));
      try {
        const response = await printService.acceptOrder(orderId);
        toast.success(response.message || "Order accepted successfully");
        await fetchOrders();
        setExpandedSections((prev) => ({ ...prev, upcoming: false }));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to accept order"
        );
      } finally {
        setUiState((prev) => ({ ...prev, actionLoading: false }));
      }
    },
    [fetchOrders]
  );

  const handleMarkReady = useCallback(
    async (orderId: string) => {
      setUiState((prev) => ({ ...prev, actionLoading: true }));
      try {
        const response = await printService.markReadyForPlant(orderId);
        toast.success(response.message || "Order marked as ready for plant!");
        await fetchOrders();
        setExpandedSections((prev) => ({ ...prev, inProgress: false }));
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update order status"
        );
      } finally {
        setUiState((prev) => ({ ...prev, actionLoading: false }));
      }
    },
    [fetchOrders]
  );

  const handleDeclineClick = useCallback((orderId: string) => {
    setUiState((prev) => ({
      ...prev,
      showDeclineModal: true,
      selectedOrderId: orderId,
    }));
  }, []);

  const handleDeclineConfirm = useCallback(
    async (reason: string) => {
      if (!uiState.selectedOrderId) return;
      setUiState((prev) => ({ ...prev, actionLoading: true }));
      try {
        const response = await printService.declineOrder(
          uiState.selectedOrderId,
          reason
        );
        toast.success(response.message || "Order declined successfully");
        setUiState((prev) => ({
          ...prev,
          showDeclineModal: false,
          selectedOrderId: null,
        }));
        await fetchOrders();
        setExpandedSections((prev) => ({ ...prev, upcoming: false }));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to decline order"
        );
      } finally {
        setUiState((prev) => ({ ...prev, actionLoading: false }));
      }
    },
    [uiState.selectedOrderId, fetchOrders]
  );

  const handleViewDetails = useCallback(
    (orderId: string) => {
      router.push(`/printdetail/${orderId}`);
    },
    [router]
  );

  const handleViewComments = useCallback((orderId: string) => {
    setSelectedCommentOrderId(orderId);
  }, []);

  const handleCloseComments = useCallback(() => {
    setSelectedCommentOrderId(null);
  }, []);

  if (uiState.isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  const sections = [
    {
      key: "upcoming" as const,
      title: "Upcoming orders",
      emptyMessage: "No upcoming orders",
    },
    {
      key: "inProgress" as const,
      title: "In Progress",
      emptyMessage: "No orders currently in progress",
    },
    {
      key: "previous" as const,
      title: "Previous Orders",
      emptyMessage: "No previous orders",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Hi {user?.profile?.name || "Printing Team"}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {orders.upcoming.length} new{" "}
            {orders.upcoming.length === 1 ? "order" : "orders"} waiting for you
          </p>
        </div>

        {sections.map((section) => (
          <section key={section.key} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
              {orders[section.key].length > INITIAL_DISPLAY_COUNT && (
                <button
                  onClick={() => handleToggleSection(section.key)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
                >
                  {expandedSections[section.key] ? "View Less ←" : "View All →"}
                </button>
              )}
            </div>

            {orders[section.key].length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <p className="text-gray-500">{section.emptyMessage}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedOrders[section.key].map((order) => (
                  <OrderCard
                    key={order.order_id}
                    order={order}
                    onAccept={handleAccept}
                    onDecline={handleDeclineClick}
                    onMarkReady={handleMarkReady}
                    onViewDetails={handleViewDetails}
                    onViewComments={handleViewComments}
                    isLoading={uiState.actionLoading}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <DeclineModal
        isOpen={uiState.showDeclineModal}
        onClose={() =>
          setUiState((prev) => ({
            ...prev,
            showDeclineModal: false,
            selectedOrderId: null,
          }))
        }
        onConfirm={handleDeclineConfirm}
        isLoading={uiState.actionLoading}
      />

      {/* ✅ UPDATED: Comments Modal - Allow adding comments for all orders */}
      {selectedCommentOrderId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full relative">
            <button
              onClick={handleCloseComments}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Close comments"
            >
              <X size={32} />
            </button>
            <OrderComments
              orderId={selectedCommentOrderId}
              userRole={user?.role || "printing"}
              onClose={handleCloseComments}
            />
          </div>
        </div>
      )}
    </div>
  );
}
