"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { plantService } from "@/app/services/plantService";
import type { AllOrderModel } from "@/app/services/adminService";
import { Calendar, Clock, CheckCircle, Loader2, Package } from "lucide-react";
import toast from "react-hot-toast";

// NO CHANGES NEEDED IN OrderCard COMPONENT
interface OrderCardProps {
  order: AllOrderModel;
  onAccept: (orderId: string) => void;
  isLoading: boolean;
  showActions?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onAccept,
  isLoading,
  showActions = true,
}) => {
  const getProductName = useCallback((order: AllOrderModel) => {
    const variant =
      order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
    const capColor =
      order.cap_color.charAt(0).toUpperCase() +
      order.cap_color.slice(1).replace("_", " ");
    return `${variant} Bottle ${capColor} Cap - ${order.volume}ml`;
  }, []);

  const daysRemaining = plantService.getDaysUntilDelivery(order.expected_delivery);
  const overdue = plantService.isOverdue(order.expected_delivery);

  const getButtonText = () => {
    if (order.status === "ready_for_plant") {
      return "Accept";
    } else if (order.status === "plant_processing") {
      return "Mark as Dispatched";
    }
    return "Update Status";
  };

  return (
    <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
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
          <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1">
            {getProductName(order)}
          </h3>
          <p className="text-xs sm:text-sm text-blue-600 mb-1">
            Order ID: {order.order_id.slice(0, 10)}...
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            Date: {plantService.formatDate(order.created_at)}
          </p>

          <div className="flex items-center gap-4 text-xs sm:text-sm mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                Deadline: {plantService.formatDate(order.expected_delivery)}
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
                  className={`font-medium ${
                    daysRemaining <= 2 ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {daysRemaining} days left
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-900 font-medium">
            Quantity: {order.qty} units
          </p>
        </div>
      </div>

      {showActions ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAccept(order.order_id);
          }}
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              {getButtonText()}
            </>
          )}
        </button>
      ) : (
        <div className="mt-2">
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
      )}
    </div>
  );
};

export default function PlantDashboard() {
  const { user } = useAuth();

  // ✅ UPDATED: State is now separated into three distinct lists
  const [pendingOrders, setPendingOrders] = useState<AllOrderModel[]>([]);
  const [inProgressOrders, setInProgressOrders] = useState<AllOrderModel[]>([]);
  const [previousOrders, setPreviousOrders] = useState<AllOrderModel[]>([]);

  const [displayedPendingOrders, setDisplayedPendingOrders] = useState<AllOrderModel[]>([]);
  const [displayedInProgressOrders, setDisplayedInProgressOrders] = useState<AllOrderModel[]>([]);
  const [displayedPreviousOrders, setDisplayedPreviousOrders] = useState<AllOrderModel[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllInProgress, setShowAllInProgress] = useState(false);
  const [showAllPrevious, setShowAllPrevious] = useState(false);

  const fetchAttempted = useRef(false);
  const INITIAL_DISPLAY_COUNT = 3;

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await plantService.getAllOrders({
        limit: 100,
        offset: 0,
      });
      const orders = response.orders || [];

      // ✅ UPDATED: Filtering logic to create three distinct lists
      const pending = orders.filter((order) => order.status === "ready_for_plant");
      const inProgress = orders.filter((order) => order.status === "plant_processing");
      const previous = orders.filter(
        (order) => order.status === "dispatched" || order.status === "completed"
      );
      
      setPendingOrders(pending);
      setInProgressOrders(inProgress);
      setPreviousOrders(previous);

      setDisplayedPendingOrders(pending.slice(0, INITIAL_DISPLAY_COUNT));
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
  
  // ✅ UPDATED: Handlers for each section
  const handleViewAllPending = () => {
    setShowAllPending(true);
    setDisplayedPendingOrders(pendingOrders);
  };
  
  const handleViewAllInProgress = () => {
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
      const response = await plantService.updateOrderStatus(orderId);
      toast.success(response.message || "Order status updated successfully");
      await fetchOrders();
      // Reset view states to avoid showing the full list after an action
      setShowAllPending(false);
      setShowAllInProgress(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update order status");
      }
    } finally {
      setActionLoading(false);
    }
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Hi {user?.profile?.name || "Plant Team"}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {pendingOrders.length} pending{" "}
            {pendingOrders.length === 1 ? "order" : "orders"} • {inProgressOrders.length} in progress
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Stats Cards - No changes needed here */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
             <div className="text-center">
               <p className="text-sm text-gray-500 mb-1">Pending orders</p>
               <p className="text-3xl font-bold text-gray-900 mb-2">
                 {pendingOrders.length}
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
                 {inProgressOrders.length}
               </p>
               <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                 <Package className="w-4 h-4 text-orange-600" />
               </div>
             </div>
           </div>
        </div>

        {/* ✅ UPDATED: Section for Pending Orders */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Orders
            </h2>
            {!showAllPending && pendingOrders.length > INITIAL_DISPLAY_COUNT && (
              <button onClick={handleViewAllPending} className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer">
                View All →
              </button>
            )}
            {showAllPending && pendingOrders.length > INITIAL_DISPLAY_COUNT && (
              <button onClick={() => { setShowAllPending(false); setDisplayedPendingOrders(pendingOrders.slice(0, INITIAL_DISPLAY_COUNT)); }} className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer">
                View Less ←
              </button>
            )}
          </div>
          {pendingOrders.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-500">No pending orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedPendingOrders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onAccept={handleAccept}
                  isLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </section>
        
        {/* ✅ NEW: Section for In Progress Orders */}
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
              <p className="text-gray-500">No orders in progress</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedInProgressOrders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onAccept={handleAccept}
                  isLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </section>

        {/* Previous Orders Section (No changes needed here) */}
        <section>
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
                  isLoading={actionLoading}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}