"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { printService, Order } from "@/app/services/printService";
import { ChevronDown, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md">
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-blue-500 text-gray-700 cursor-pointer"
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
  order: Order;
  onAccept: (orderId: string) => void;
  onDecline: (orderId: string) => void;
  onViewDetails: (orderId: string) => void;
  isLoading: boolean;
  showActions?: boolean;
}

const OrderCard = ({
  order,
  onAccept,
  onDecline,
  onViewDetails,
  isLoading,
  showActions = true,
}: OrderCardProps) => {
  const getProductName = useCallback((order: Order) => {
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

  return (
    <div
      onClick={showActions ? undefined : () => onViewDetails(order.order_id)}
      className={`bg-gray-50 rounded-2xl p-4 mb-4 transition-shadow ${
        showActions ? "" : "cursor-pointer hover:shadow-md"
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
          <p className="text-xs sm:text-sm text-gray-600">
            Date: {formatDate(order.created_at)}
          </p>
          <p className="text-xs sm:text-sm text-gray-900 font-medium mt-1">
            Quantity: {order.qty} units
          </p>
        </div>
      </div>

      {showActions ? (
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
      ) : (
        <div className="mt-2">
          {(order.status === "dispatch" || order.status === "printing" || order.status === "processing") && (
            <p className="text-sm font-medium text-green-600">
              ✓ Completed - Ready for Dispatch
              <br />
              <span className="text-xs text-gray-500">
                Last updated: {formatDate(order.updated_at)}
              </span>
            </p>
          )}
          {order.status === "declined" && (
            <p className="text-sm font-medium text-red-600">
              ✗ Declined
              <br />
              {order.decline_reason && (
                <span className="text-xs text-gray-500">
                  Reason: {order.decline_reason}
                </span>
              )}
            </p>
          )}
          {order.status === "cancelled" && (
            <p className="text-sm font-medium text-gray-600">
              ✗ Cancelled
              <br />
              <span className="text-xs text-gray-500">
                Last updated: {formatDate(order.updated_at)}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default function PrintDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [upcomingOrders, setUpcomingOrders] = useState<Order[]>([]);
  const [previousOrders, setPreviousOrders] = useState<Order[]>([]);
  const [displayedUpcomingOrders, setDisplayedUpcomingOrders] = useState<
    Order[]
  >([]);
  const [displayedPreviousOrders, setDisplayedPreviousOrders] = useState<
    Order[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllPrevious, setShowAllPrevious] = useState(false);

  const fetchAttempted = useRef(false);
  const INITIAL_DISPLAY_COUNT = 3;

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await printService.getAllOrders({
        limit: 100,
        offset: 0,
      });
      const orders = response.orders || [];

      const upcoming = orders.filter((order) => order.status === "placed");
      const previous = orders.filter(
        (order) =>
          order.status === "printing" ||
          order.status === "processing" ||
          order.status === "dispatch" ||
          order.status === "declined" ||
          order.status === "cancelled"
      );

      setUpcomingOrders(upcoming);
      setPreviousOrders(previous);
      setDisplayedUpcomingOrders(upcoming.slice(0, INITIAL_DISPLAY_COUNT));
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

  const handleViewAllUpcoming = () => {
    setShowAllUpcoming(true);
    setDisplayedUpcomingOrders(upcomingOrders);
  };

  const handleViewAllPrevious = () => {
    setShowAllPrevious(true);
    setDisplayedPreviousOrders(previousOrders);
  };

  const handleAccept = async (orderId: string) => {
    setActionLoading(true);
    try {
      const response = await printService.acceptOrder(orderId);
      toast.success(response.message || "Order accepted successfully");
      await fetchOrders();
      setShowAllUpcoming(false);
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
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to decline order");
      }
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
        {/* Header Text */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Hi {user?.profile?.name || "Harshan Printing"}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {upcomingOrders.length} new{" "}
            {upcomingOrders.length === 1 ? "order" : "orders"} waiting for you
          </p>
        </div>

        {/* Upcoming Orders Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Upcoming orders
            </h2>
            {!showAllUpcoming &&
              upcomingOrders.length > INITIAL_DISPLAY_COUNT && (
                <button
                  onClick={handleViewAllUpcoming}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
                >
                  View All →
                </button>
              )}
            {showAllUpcoming &&
              upcomingOrders.length > INITIAL_DISPLAY_COUNT && (
                <button
                  onClick={() => {
                    setShowAllUpcoming(false);
                    setDisplayedUpcomingOrders(
                      upcomingOrders.slice(0, INITIAL_DISPLAY_COUNT)
                    );
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
                >
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
                  onViewDetails={handleViewDetails}
                  isLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </section>

        {/* Previous Orders Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Previous Orders
            </h2>
            {!showAllPrevious &&
              previousOrders.length > INITIAL_DISPLAY_COUNT && (
                <button
                  onClick={handleViewAllPrevious}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
                >
                  View All →
                </button>
              )}
            {showAllPrevious &&
              previousOrders.length > INITIAL_DISPLAY_COUNT && (
                <button
                  onClick={() => {
                    setShowAllPrevious(false);
                    setDisplayedPreviousOrders(
                      previousOrders.slice(0, INITIAL_DISPLAY_COUNT)
                    );
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
                >
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
                  onViewDetails={handleViewDetails}
                  isLoading={actionLoading}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Decline Modal */}
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
