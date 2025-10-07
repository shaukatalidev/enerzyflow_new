"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { printService } from "@/app/services/printService";
import type { AllOrderModel } from "@/app/services/adminService";
import { ChevronDown, X, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

const DeclineModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeclineModalProps) => {
  const [selectedReason, setSelectedReason] = useState("");

  const reasons = [
    "Capacity full",
    "Technical issues",
    "Insufficient resources",
    "Other commitments",
    "Service unavailable",
  ];

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-md">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
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
              {reasons.map((reason) => (
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
};

interface OrderCardProps {
  order: AllOrderModel;
  onAccept: (orderId: string) => void;
  onDecline: (orderId: string) => void;
  onMarkReady: (orderId: string) => void; // ✅ NEW: Prop for the new action
  onViewDetails: (orderId: string) => void;
  isLoading: boolean;
}

const OrderCard = ({
  order,
  onAccept,
  onDecline,
  onMarkReady, // ✅ NEW
  onViewDetails,
  isLoading,
}: OrderCardProps) => {
  const getProductName = useCallback((order: AllOrderModel) => {
    const variant =
      order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
    const capColor =
      order.cap_color.charAt(0).toUpperCase() +
      order.cap_color.slice(1).replace("_", " ");
    return `${variant} Bottle ${capColor} Cap Label - ${order.volume}ml`;
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  const getDaysUntilDelivery = useCallback((expectedDelivery: string) => {
    const expected = new Date(expectedDelivery);
    const now = new Date();
    const diffTime = expected.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  const isOverdue = useCallback((expectedDelivery: string) => {
    const expected = new Date(expectedDelivery);
    const now = new Date();
    return now > expected;
  }, []);

  const daysRemaining = getDaysUntilDelivery(order.expected_delivery);
  const overdue = isOverdue(order.expected_delivery);
  
  // ✅ UPDATED: Card is now clickable only if there are no direct actions
  const isClickable = order.status !== 'placed' && order.status !== 'printing';

  return (
    <div
      onClick={isClickable ? () => onViewDetails(order.order_id) : undefined}
      className={`bg-gray-50 rounded-2xl p-4 mb-4 transition-shadow ${
        isClickable ? "cursor-pointer hover:shadow-md" : ""
      }`}
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
          {order.label_url ? (
            <Image
              src={order.label_url}
              alt="Label"
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

          <div className="flex items-center gap-4 text-xs sm:text-sm mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                Delivery: {formatDate(order.expected_delivery)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-500" />
              {overdue ? (
                <span className="text-red-600 font-medium">
                  Overdue by {Math.abs(daysRemaining)} days
                </span>
              ) : (
                <span
                  className={`${
                    daysRemaining <= 2 ? "text-orange-600" : "text-green-600"
                  } font-medium`}
                >
                  {daysRemaining} days left
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-900 font-medium">
            Quantity: {order.qty} units
          </p>

          <div className="mt-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${printService.getPaymentStatusColorClass(
                order.payment_status
              )}`}
            >
              {printService.formatPaymentStatus(order.payment_status)}
            </span>
          </div>
        </div>
      </div>

      {/* ✅ UPDATED: Conditional rendering for action buttons based on status */}
      <div className="mt-2">
        {order.status === "placed" && (
          <div className="flex gap-2 sm:gap-3">
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

        {/* ✅ NEW: Button for "printing" status */}
        {order.status === "printing" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkReady(order.order_id);
            }}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
          >
            Mark as Ready for Plant
          </button>
        )}

        {/* Show status badge for previous orders */}
        {order.status !== "placed" && order.status !== "printing" && (
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
        )}
      </div>
    </div>
  );
};

export default function PrintDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [upcomingOrders, setUpcomingOrders] = useState<AllOrderModel[]>([]);
  const [inProgressOrders, setInProgressOrders] = useState<AllOrderModel[]>([]); // ✅ NEW
  const [previousOrders, setPreviousOrders] = useState<AllOrderModel[]>([]);
  
  // States for displayed orders remain the same, just add one for in-progress
  const [displayedUpcomingOrders, setDisplayedUpcomingOrders] = useState<AllOrderModel[]>([]);
  const [displayedInProgressOrders, setDisplayedInProgressOrders] = useState<AllOrderModel[]>([]); // ✅ NEW
  const [displayedPreviousOrders, setDisplayedPreviousOrders] = useState<AllOrderModel[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllInProgress, setShowAllInProgress] = useState(false); // ✅ NEW
  const [showAllPrevious, setShowAllPrevious] = useState(false);

  const fetchAttempted = useRef(false);
  const INITIAL_DISPLAY_COUNT = 3;

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await printService.getAllOrders({ limit: 100, offset: 0 });
      const orders = response.orders || [];

      const verifiedOrders = orders.filter(
        (order) => order.payment_status === "payment_verified"
      );

      // ✅ UPDATED: Split orders into three categories
      const upcoming = verifiedOrders.filter((o) => o.status === "placed");
      const inProgress = verifiedOrders.filter((o) => o.status === "printing");
      const previous = verifiedOrders.filter(
        (o) => o.status !== "placed" && o.status !== "printing"
      );

      setUpcomingOrders(upcoming);
      setInProgressOrders(inProgress);
      setPreviousOrders(previous);
      
      setDisplayedUpcomingOrders(upcoming.slice(0, INITIAL_DISPLAY_COUNT));
      setDisplayedInProgressOrders(inProgress.slice(0, INITIAL_DISPLAY_COUNT));
      setDisplayedPreviousOrders(previous.slice(0, INITIAL_DISPLAY_COUNT));
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;
    fetchOrders();
  }, [fetchOrders]);
  
  // Handlers for showing all/less orders
  const handleViewAllUpcoming = () => {
    setShowAllUpcoming(true);
    setDisplayedUpcomingOrders(upcomingOrders);
  };
  
  const handleViewAllInProgress = () => { // ✅ NEW
    setShowAllInProgress(true);
    setDisplayedInProgressOrders(inProgressOrders);
  };

  const handleViewAllPrevious = () => {
    setShowAllPrevious(true);
    setDisplayedPreviousOrders(previousOrders);
  };

  const handleAccept = async (orderId: string) => {
    setActionLoading(true);
    try {
      const response = await printService.startPrinting(orderId);
      toast.success(response.message || "Order accepted and moved to printing");
      await fetchOrders();
      setShowAllUpcoming(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept order");
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ NEW: Handler for marking order as ready for plant
  const handleMarkReady = async (orderId: string) => {
    setActionLoading(true);
    try {
      // NOTE: You need to create this 'markReadyForPlant' method in your printService.
      // It should make an API call to update the order status to 'ready_for_plant'.
      const response = await printService.markReadyForPlant(orderId);
      toast.success(response.message || "Order marked as ready for plant!");
      await fetchOrders();
      setShowAllInProgress(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update order status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowDeclineModal(true);
  };

  const handleDeclineConfirm = async (reason: string) => {
    if (!selectedOrderId) return;
    setActionLoading(true);
    try {
      const response = await printService.declineOrder(selectedOrderId, reason);
      toast.success(response.message || "Order declined successfully");
      setShowDeclineModal(false);
      setSelectedOrderId(null);
      await fetchOrders();
      setShowAllUpcoming(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to decline order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (orderId: string) => {
    router.push(`/printdetail/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        {/* Loading Spinner */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Hi {user?.profile?.name || "Printing Team"}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {upcomingOrders.length} new{" "}
            {upcomingOrders.length === 1 ? "order" : "orders"} waiting for you
          </p>
        </div>

        {/* Upcoming Orders Section */}
        <section className="mb-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-semibold text-gray-900">
               Upcoming orders
             </h2>
             {!showAllUpcoming && upcomingOrders.length > INITIAL_DISPLAY_COUNT && (
                 <button onClick={handleViewAllUpcoming} className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer">
                   View All →
                 </button>
             )}
             {showAllUpcoming && upcomingOrders.length > INITIAL_DISPLAY_COUNT && (
                 <button onClick={() => { setShowAllUpcoming(false); setDisplayedUpcomingOrders(upcomingOrders.slice(0, INITIAL_DISPLAY_COUNT)); }} className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer">
                   View Less ←
                 </button>
             )}
           </div>
          {upcomingOrders.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-500">No upcoming orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedUpcomingOrders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onAccept={handleAccept}
                  onDecline={handleDeclineClick}
                  onMarkReady={handleMarkReady}
                  onViewDetails={handleViewDetails}
                  isLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </section>

        {/* ✅ NEW: In Progress Orders Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              In Progress
            </h2>
            {!showAllInProgress && inProgressOrders.length > INITIAL_DISPLAY_COUNT && (
                 <button onClick={handleViewAllInProgress} className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer">
                   View All →
                 </button>
             )}
             {showAllInProgress && inProgressOrders.length > INITIAL_DISPLAY_COUNT && (
                 <button onClick={() => { setShowAllInProgress(false); setDisplayedInProgressOrders(inProgressOrders.slice(0, INITIAL_DISPLAY_COUNT)); }} className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer">
                   View Less ←
                 </button>
             )}
          </div>
          {inProgressOrders.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-500">No orders currently in progress</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedInProgressOrders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onAccept={handleAccept}
                  onDecline={handleDeclineClick}
                  onMarkReady={handleMarkReady}
                  onViewDetails={handleViewDetails}
                  isLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </section>

        {/* Previous Orders Section */}
        <section>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-semibold text-gray-900">
               Previous Orders
             </h2>
             {!showAllPrevious && previousOrders.length > INITIAL_DISPLAY_COUNT && (
                 <button onClick={handleViewAllPrevious} className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer">
                   View All →
                 </button>
             )}
             {showAllPrevious && previousOrders.length > INITIAL_DISPLAY_COUNT && (
                 <button onClick={() => { setShowAllPrevious(false); setDisplayedPreviousOrders(previousOrders.slice(0, INITIAL_DISPLAY_COUNT)); }} className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer">
                   View Less ←
                 </button>
             )}
           </div>
          {previousOrders.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-500">No previous orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedPreviousOrders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onAccept={handleAccept}
                  onDecline={handleDeclineClick}
                  onMarkReady={handleMarkReady}
                  onViewDetails={handleViewDetails}
                  isLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <DeclineModal
        isOpen={showDeclineModal}
        onClose={() => {
          setShowDeclineModal(false);
          setSelectedOrderId(null);
        }}
        onConfirm={handleDeclineConfirm}
        isLoading={actionLoading}
      />
    </div>
  );
}