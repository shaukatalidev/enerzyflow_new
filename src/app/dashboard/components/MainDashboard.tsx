"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { orderService } from "@/app/services/orderService";
import type { Order } from "@/app/services/orderService";
import OrdersModal from "@/components/OrderModal";
import { Calendar } from "lucide-react";

// OrderCard component
const OrderCard = ({
  order,
  onClick,
}: {
  order: Order;
  onClick: () => void;
}) => {
  const getProductName = useCallback((order: Order) => {
    const variant =
      order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
    const capColor =
      order.cap_color.charAt(0).toUpperCase() +
      order.cap_color.slice(1).replace("_", " ");
    return `${variant} Bottle ${capColor} Cap - ${order.volume}ml`;
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
    <button onClick={onClick} className="w-full text-left cursor-pointer">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-200">
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
              <span className="text-white text-xs font-bold">Label</span>
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

            {/* Expected Delivery */}
            {order.expected_delivery && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                <Calendar className="w-3 h-3" />
                <span>Delivery: {formatDate(order.expected_delivery)}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${orderService.getOrderStatusColor(
                  order.status
                )}`}
              >
                {orderService.formatOrderStatus(order.status)}
              </span>
              <span className="text-xs text-gray-500">
                Qty: {order.qty.toLocaleString()}
              </span>
            </div>

            {/* Payment Status Badge */}
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${orderService.getPaymentStatusColor(
                  order.payment_status
                )}`}
              >
                {orderService.formatPaymentStatus(order.payment_status)}
              </span>
            </div>

            {/* ✅ Show warning if payment not uploaded */}
            {order.payment_status === "payment_pending" && (
              <div className="mt-2 flex items-center text-xs text-amber-600">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Payment pending - Click to upload
              </div>
            )}

            {/* ✅ Show payment rejected message */}
            {order.payment_status === "payment_rejected" && (
              <div className="mt-2 flex items-center text-xs text-red-600">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Payment rejected - {order.decline_reason || "Click to reupload"}
              </div>
            )}

            {/* Show decline reason if declined */}
            {order.status === "declined" && (
              <p className="text-xs text-red-600 mt-2">
                <span className="font-medium">Declined:</span>{" "}
                {order.decline_reason || "Contact support for details"}
              </p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

// EmptyState component
const EmptyState = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
    {icon}
    <p className="text-gray-500 font-medium mb-2">{title}</p>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export default function MainDashboard() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOrderType, setModalOrderType] = useState<
    "active" | "completed" | "rejected"
  >("active");

  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

  const fetchAttempted = useRef(false);
  const fetchingRef = useRef(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (fetchAttempted.current || fetchingRef.current) {
        return;
      }

      fetchAttempted.current = true;
      fetchingRef.current = true;
      setIsLoading(true);

      try {
        const response = await orderService.getOrders({ limit: 100 });
        setOrders(response.orders || []);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load orders";
        setError(errorMessage);
        fetchAttempted.current = false;
      } finally {
        setIsLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchOrders();
  }, []);

  // ✅ Updated: Divide orders into three categories
  const { activeOrders, completedOrders, rejectedOrders } = useMemo(() => {
    // Active orders: placed, printing, ready_for_plant, plant_processing
    // BUT exclude payment_rejected orders
    const active = orders.filter(
      (order) =>
        (order.status === "placed" ||
          order.status === "printing" ||
          order.status === "ready_for_plant" ||
          order.status === "plant_processing") &&
        order.payment_status !== "payment_rejected"
    );

    // Completed orders: dispatched, completed
    const completed = orders.filter(
      (order) => order.status === "dispatched" || order.status === "completed"
    );

    // ✅ Rejected orders: declined status OR payment_rejected
    const rejected = orders.filter(
      (order) =>
        order.status === "declined" ||
        order.payment_status === "payment_rejected"
    );

    // Sort active orders: payment pending first, then by date
    active.sort((a, b) => {
      if (
        a.payment_status === "payment_pending" &&
        b.payment_status !== "payment_pending"
      )
        return -1;
      if (
        a.payment_status !== "payment_pending" &&
        b.payment_status === "payment_pending"
      )
        return 1;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    // Sort rejected orders (newest first)
    rejected.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Sort completed orders (newest first)
    completed.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      activeOrders: active,
      completedOrders: completed,
      rejectedOrders: rejected,
    };
  }, [orders]);

  const displayedActiveOrders = useMemo(
    () => activeOrders.slice(0, 3),
    [activeOrders]
  );

  const displayedRejectedOrders = useMemo(
    () => rejectedOrders.slice(0, 3),
    [rejectedOrders]
  );

  const displayedCompletedOrders = useMemo(
    () => completedOrders.slice(0, 3),
    [completedOrders]
  );

  const handleOrderClick = useCallback(
    (orderId: string) => {
      const order = orders.find((o) => o.order_id === orderId);

      if (!order) {
        console.error("Order not found");
        return;
      }

      // ✅ If payment status is pending or rejected, redirect to invoice page
      if (
        order.payment_status === "payment_pending" ||
        order.payment_status === "payment_rejected"
      ) {
        setShowPaymentAlert(true);

        setTimeout(() => {
          router.push(`/order/${orderId}/invoice`);
          setShowPaymentAlert(false);
        }, 1500);
        return;
      }
      router.push(`/order/${orderId}/status`);
    },
    [orders, router]
  );

  const handleNewOrder = useCallback(() => {
    setIsCreatingOrder(true);
    router.push("/order");
  }, [router]);

  const handleViewAllActive = useCallback(() => {
    setModalOrderType("active");
    setIsModalOpen(true);
  }, []);

  const handleViewAllRejected = useCallback(() => {
    setModalOrderType("rejected");
    setIsModalOpen(true);
  }, []);

  const handleViewAllCompleted = useCallback(() => {
    setModalOrderType("completed");
    setIsModalOpen(true);
  }, []);

  const handleCloseAlert = useCallback(() => {
    setShowPaymentAlert(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:shadow-none lg:border-r border-gray-200`}
          >
            <div className="flex items-center justify-between p-4 lg:justify-center lg:pt-6">
              <h2 className="text-xl font-bold text-gray-900">Bottle Orders</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 lg:hidden cursor-pointer"
                aria-label="Close sidebar"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="mt-8 px-4 space-y-2">
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md cursor-pointer"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Bottle Orders
              </a>
              <a
                href="/profile"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </a>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-0">
            <div className="p-4 lg:p-6">
              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-red-400 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-3 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Payment Alert */}
              {showPaymentAlert && (
                <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg animate-pulse">
                  <div className="flex items-start">
                    <svg
                      className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-amber-800">
                        Payment screenshot required
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Please upload payment screenshot to continue.
                        Redirecting...
                      </p>
                    </div>
                    <button
                      onClick={handleCloseAlert}
                      className="ml-auto flex-shrink-0 text-amber-600 hover:text-amber-800 cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* ✅ Order Stats Cards - 3 Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Ongoing</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {activeOrders.length}
                    </p>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-4 h-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Rejected</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {rejectedOrders.length}
                    </p>
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {completedOrders.length}
                    </p>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* New Order Button */}
              <button
                onClick={handleNewOrder}
                disabled={isCreatingOrder}
                className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white font-medium py-4 px-6 rounded-2xl mb-6 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isCreatingOrder ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    New Order
                  </>
                )}
              </button>

              {/* ✅ Orders Sections - Three Sections */}
              <div className="space-y-6">
                {/* Ongoing Orders */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Ongoing Orders
                    </h2>
                    {activeOrders.length > 3 && (
                      <button
                        onClick={handleViewAllActive}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        View all
                      </button>
                    )}
                  </div>

                  {displayedActiveOrders.length === 0 ? (
                    <EmptyState
                      title="No ongoing orders"
                      description="Create your first order to get started"
                      icon={
                        <svg
                          className="w-16 h-16 mx-auto text-gray-300 mb-4"
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
                      }
                    />
                  ) : (
                    <div className="space-y-3">
                      {displayedActiveOrders.map((order) => (
                        <OrderCard
                          key={order.order_id}
                          order={order}
                          onClick={() => handleOrderClick(order.order_id)}
                        />
                      ))}
                    </div>
                  )}
                </section>

                {/* ✅ Rejected Orders Section - Only show if there are rejected orders */}
                {rejectedOrders.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Rejected Orders
                      </h2>
                      {rejectedOrders.length > 3 && (
                        <button
                          onClick={handleViewAllRejected}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                        >
                          View all
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {displayedRejectedOrders.map((order) => (
                        <OrderCard
                          key={order.order_id}
                          order={order}
                          onClick={() => handleOrderClick(order.order_id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Completed Orders */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Completed Orders
                    </h2>
                    {completedOrders.length > 3 && (
                      <button
                        onClick={handleViewAllCompleted}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        View all
                      </button>
                    )}
                  </div>

                  {displayedCompletedOrders.length === 0 ? (
                    <EmptyState
                      title="No completed orders"
                      description="Completed orders will appear here"
                      icon={
                        <svg
                          className="w-16 h-16 mx-auto text-gray-300 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      }
                    />
                  ) : (
                    <div className="space-y-3">
                      {displayedCompletedOrders.map((order) => (
                        <OrderCard
                          key={order.order_id}
                          order={order}
                          onClick={() => handleOrderClick(order.order_id)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      <OrdersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderType={modalOrderType}
        onOrderClick={handleOrderClick}
      />
    </>
  );
}
