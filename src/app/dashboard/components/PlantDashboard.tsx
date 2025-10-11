"use client";

import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { plantService } from "@/app/services/plantService";
import type { AllOrderModel } from "@/app/services/adminService";
import {
  Calendar,
  Clock,
  CheckCircle,
  Loader2,
  Package,
  MessageSquare,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import OrderComments from "@/components/OrderComments";

// ✅ Constants outside component
const INITIAL_DISPLAY_COUNT = 3;

// ✅ Helper function outside component
const getProductName = (order: AllOrderModel) => {
  const variant =
    order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
  const capColor =
    order.cap_color.charAt(0).toUpperCase() +
    order.cap_color.slice(1).replace("_", " ");
  return `${variant} Bottle ${capColor} Cap - ${order.volume}ml`;
};

// ✅ Button text helper
const getButtonText = (status: string) => {
  if (status === "ready_for_plant") return "Start Processing";
  if (status === "plant_processing") return "Mark as Dispatched";
  return "Update Status";
};

// ✅ Memoized OrderCard component
interface OrderCardProps {
  order: AllOrderModel;
  onAccept: (orderId: string) => void;
  onViewComments: (orderId: string) => void;
  isLoading: boolean;
  showActions?: boolean;
}

// ✅ Updated OrderCard - removed label status, deadline shows date and time only
const OrderCard = memo<OrderCardProps>(
  ({ order, onAccept, onViewComments, isLoading, showActions = true }) => {
    // ✅ Memoize deadline info - just date and time
    const deadlineInfo = useMemo(() => {
      const hasDeadline = !plantService.isZeroDate(order.deadline);
      const deadlineDateTime = hasDeadline
        ? plantService.formatDeadlineDateTime(order.deadline)
        : '';

      return {
        hasDeadline,
        deadlineDateTime,
      };
    }, [order.deadline]);

    // ✅ Check if order is in pending status
    const isPending = order.status === "ready_for_plant";

    return (
      <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
        {/* Image and order details */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
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
            {/* Client name */}
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Client name: {order.company_name}
            </p>

            {/* Product Name */}
            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1">
              {getProductName(order)}
            </h3>

            {/* Order ID */}
            <p className="text-xs sm:text-sm text-blue-600 mb-1">
              Order ID: {order.order_id.slice(0, 10)}...
            </p>

            {/* Deadline - just date and time */}
            {deadlineInfo.hasDeadline && (
              <p className="text-xs sm:text-sm text-gray-600">
                Deadline: <span className="text-red-600 font-medium">{deadlineInfo.deadlineDateTime}</span>
              </p>
            )}

            {/* Quantity */}
            <p className="text-xs sm:text-sm text-gray-900 font-medium mt-2">
              Quantity: {order.qty} units
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {showActions ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept(order.order_id);
                }}
                disabled={isLoading}
                className={`${
                  isPending ? "flex-1" : "flex-1"
                } bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {getButtonText(order.status)}
                  </>
                )}
              </button>
              {!isPending && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewComments(order.order_id);
                  }}
                  className="px-4 py-2.5 sm:py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  title="View/Add Comments"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="hidden sm:inline">Comments</span>
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${plantService.getStatusColorClass(
                    order.status
                  )}`}
                >
                  {plantService.getStatusLabel(order.status)}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Last updated: {plantService.formatDate(order.updated_at)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewComments(order.order_id);
                }}
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                title="View Comments"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">View</span>
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
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.showActions === nextProps.showActions
    );
  }
);

OrderCard.displayName = "OrderCard";


// ✅ Reusable OrderSection component
interface OrderSectionProps {
  title: string;
  orders: AllOrderModel[];
  displayedOrders: AllOrderModel[];
  showAll: boolean;
  onToggle: () => void;
  onAccept: (id: string) => void;
  onViewComments: (id: string) => void;
  isLoading: boolean;
  showActions?: boolean;
  emptyMessage: string;
}

const OrderSection = memo<OrderSectionProps>(
  ({
    title,
    orders,
    displayedOrders,
    showAll,
    onToggle,
    onAccept,
    onViewComments,
    isLoading,
    showActions = true,
    emptyMessage,
  }) => {
    const hasMore = orders.length > INITIAL_DISPLAY_COUNT;

    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {hasMore && (
            <button
              onClick={onToggle}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
            >
              {showAll ? "View Less ←" : "View All →"}
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                onAccept={onAccept}
                onViewComments={onViewComments}
                isLoading={isLoading}
                showActions={showActions}
              />
            ))}
          </div>
        )}
      </section>
    );
  }
);

OrderSection.displayName = "OrderSection";

// ✅ Main component
export default function PlantDashboard() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<{
    pending: AllOrderModel[];
    inProgress: AllOrderModel[];
    previous: AllOrderModel[];
  }>({
    pending: [],
    inProgress: [],
    previous: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    pending: false,
    inProgress: false,
    previous: false,
  });

  const [uiState, setUiState] = useState({
    isLoading: true,
    actionLoading: false,
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const fetchAttempted = useRef(false);

  const displayedOrders = useMemo(
    () => ({
      pending: expandedSections.pending
        ? orders.pending
        : orders.pending.slice(0, INITIAL_DISPLAY_COUNT),
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
      const response = await plantService.getAllOrders(100, 0);
      const allOrders = response.orders || [];

      setOrders({
        pending: allOrders.filter((o) => o.status === "ready_for_plant"),
        inProgress: allOrders.filter((o) => o.status === "plant_processing"),
        previous: allOrders.filter(
          (o) => o.status === "dispatched" || o.status === "completed"
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

  const handleToggle = useCallback(
    (section: "pending" | "inProgress" | "previous") => {
      setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    },
    []
  );

  const handleAccept = useCallback(
    async (orderId: string) => {
      setUiState((prev) => ({ ...prev, actionLoading: true }));
      try {
        const response = await plantService.updateOrderStatus(orderId);
        toast.success(response.message || "Order status updated successfully");
        await fetchOrders();
        setExpandedSections({
          pending: false,
          inProgress: false,
          previous: false,
        });
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

  const handleViewComments = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
  }, []);

  const handleCloseComments = useCallback(() => {
    setSelectedOrderId(null);
  }, []);

  if (uiState.isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Hi {user?.profile?.name || "Plant Team"}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {orders.pending.length} pending{" "}
            {orders.pending.length === 1 ? "order" : "orders"} •{" "}
            {orders.inProgress.length} in progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Pending orders</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {orders.pending.length}
              </p>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">In progress</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {orders.inProgress.length}
              </p>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Package className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Sections */}
        <OrderSection
          title="Pending Orders"
          orders={orders.pending}
          displayedOrders={displayedOrders.pending}
          showAll={expandedSections.pending}
          onToggle={() => handleToggle("pending")}
          onAccept={handleAccept}
          onViewComments={handleViewComments}
          isLoading={uiState.actionLoading}
          emptyMessage="No pending orders"
        />

        <OrderSection
          title="In Progress"
          orders={orders.inProgress}
          displayedOrders={displayedOrders.inProgress}
          showAll={expandedSections.inProgress}
          onToggle={() => handleToggle("inProgress")}
          onAccept={handleAccept}
          onViewComments={handleViewComments}
          isLoading={uiState.actionLoading}
          emptyMessage="No orders in progress"
        />

        <OrderSection
          title="Previous Orders"
          orders={orders.previous}
          displayedOrders={displayedOrders.previous}
          showAll={expandedSections.previous}
          onToggle={() => handleToggle("previous")}
          onAccept={handleAccept}
          onViewComments={handleViewComments}
          isLoading={uiState.actionLoading}
          showActions={false}
          emptyMessage="No previous orders"
        />
      </div>

      {/* Comments Modal */}
      {selectedOrderId && (
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
              orderId={selectedOrderId}
              userRole={user?.role || "plant"}
              onClose={handleCloseComments}
              readOnly={
                !orders.pending.some((o) => o.order_id === selectedOrderId) &&
                !orders.inProgress.some((o) => o.order_id === selectedOrderId)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
