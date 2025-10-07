"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { orderService, Order } from "@/app/services/orderService";

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderType: "active" | "completed";
  onOrderClick: (orderId: string) => void;
}

const ITEMS_PER_PAGE = 10;

export default function OrdersModal({
  isOpen,
  onClose,
  orderType,
  onOrderClick,
}: OrdersModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  
  const offsetRef = useRef(0);
  const fetchingRef = useRef(false);

  const getProductName = useCallback((order: Order) => {
    const variant =
      order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
    const capColor =
      order.cap_color.charAt(0).toUpperCase() +
      order.cap_color.slice(1).replace("_", " ");
    return `${variant} Bottle ${capColor} Cap - ${order.volume}ml`;
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "placed":
        return "text-purple-600 bg-purple-50";
      case "printing":
        return "text-blue-500 bg-blue-50";
      case "ready_for_plant":
        return "text-yellow-500 bg-yellow-50";
      case "plant_processing":
        return "text-orange-500 bg-orange-50";
      case "dispatched":
        return "text-cyan-500 bg-cyan-50";
      case "completed":
        return "text-green-500 bg-green-50";
      case "declined":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  // ✅ Updated filter logic - using correct order statuses
  const filterOrdersByType = useCallback(
    (allOrders: Order[]) => {
      if (orderType === "active") {
        // Active: placed, printing, ready_for_plant, plant_processing
        return allOrders.filter(
          (order) =>
            order.status === "placed" ||
            order.status === "printing" ||
            order.status === "ready_for_plant" ||
            order.status === "plant_processing"
        );
      } else {
        // Completed: dispatched, completed
        return allOrders.filter(
          (order) =>
            order.status === "dispatched" ||
            order.status === "completed"
        );
      }
    },
    [orderType]
  );

  const fetchOrders = useCallback(
    async (isLoadMore: boolean = false) => {
      if (fetchingRef.current) return;

      fetchingRef.current = true;
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await orderService.getOrders({
          limit: ITEMS_PER_PAGE,
          offset: isLoadMore ? offsetRef.current : 0,
        });

        const filteredOrders = filterOrdersByType(response.orders || []);

        if (isLoadMore) {
          setOrders((prev) => [...prev, ...filteredOrders]);
        } else {
          setOrders(filteredOrders);
          offsetRef.current = 0;
        }

        offsetRef.current += ITEMS_PER_PAGE;
        setHasMore(response.has_more || false);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load orders";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        fetchingRef.current = false;
      }
    },
    [filterOrdersByType]
  );

  useEffect(() => {
    if (isOpen) {
      offsetRef.current = 0;
      setOrders([]);
      setHasMore(true);
      setError("");
      fetchOrders(false);
    }
  }, [isOpen, orderType, fetchOrders]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchOrders(true);
    }
  };

  const handleClose = () => {
    setOrders([]);
    offsetRef.current = 0;
    setHasMore(true);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Glassmorphic Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="relative bg-white w-full h-full sm:h-[90vh] sm:max-w-2xl sm:rounded-2xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {orderType === "active" ? "Active Orders" : "Completed Orders"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-4 sm:mx-6 mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-500 font-medium mb-2">No orders found</p>
                <p className="text-sm text-gray-400">
                  {orderType === "active"
                    ? "You don't have any active orders"
                    : "You don't have any completed orders"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <button
                    key={order.order_id}
                    onClick={() => {
                      onOrderClick(order.order_id);
                      handleClose();
                    }}
                    className="w-full text-left cursor-pointer"
                  >
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                          {order.label_url ? (
                            <Image
                              src={order.label_url}
                              alt="Label"
                              width={48}
                              height={48}
                              className="w-full h-full object-cover rounded-xl"
                              loading="lazy"
                              unoptimized
                            />
                          ) : (
                            <span className="text-white text-xs font-bold">
                              Label
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-1 leading-tight truncate">
                            {getProductName(order)}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1 truncate">
                            Order ID: {order.order_id.slice(0, 13)}...
                          </p>
                          <p className="text-xs text-gray-500 mb-2">
                            Date: {formatDate(order.created_at)}
                          </p>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {orderService.formatOrderStatus(order.status)}
                            </span>
                            <span className="text-xs text-gray-500">
                              Qty: {order.qty.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading more...</span>
                      </>
                    ) : (
                      <span>Load More Orders</span>
                    )}
                  </button>
                )}

                {!hasMore && orders.length > 0 && (
                  <p className="text-center text-sm text-gray-500 py-4">
                    No more orders to load
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
