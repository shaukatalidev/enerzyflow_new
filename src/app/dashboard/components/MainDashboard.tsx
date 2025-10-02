'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image'; 
import { orderService, Order } from '../../services/orderService';

// Extracted OrderCard component for better performance
const OrderCard = ({ order, onClick }: { order: Order; onClick: () => void }) => {
  const getProductName = useCallback((order: Order) => {
    const variant = order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
    const capColor = order.cap_color.charAt(0).toUpperCase() + order.cap_color.slice(1).replace('_', ' ');
    return `${variant} Bottle ${capColor} Cap - ${order.volume}ml`;
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'placed':
        return 'text-purple-600 bg-purple-50';
      case 'processing':
        return 'text-orange-500 bg-orange-50';
      case 'printing':
        return 'text-blue-500 bg-blue-50';
      case 'delivered':
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  return (
    <button
      onClick={onClick}
      className="w-full text-left"
    >
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
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className="text-xs text-gray-500">
                Qty: {order.qty.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

// Empty state component
const EmptyState = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
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
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getOrders();
      setOrders(response.orders || []);
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load orders';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  fetchOrders();
}, []); 


  // Memoized filtered orders - only recalculates when orders array changes
  const { activeOrders, completedOrders } = useMemo(() => {
    const active = orders.filter(
      (order) => 
        order.status === 'placed' || 
        order.status === 'printing' || 
        order.status === 'processing'
    );
    
    const completed = orders.filter(
      (order) => order.status === 'delivered'
    );

    return { activeOrders: active, completedOrders: completed };
  }, [orders]);

  // Memoized limited orders for display - prevents unnecessary re-renders
  const displayedActiveOrders = useMemo(() => activeOrders.slice(0, 3), [activeOrders]);
  const displayedCompletedOrders = useMemo(() => completedOrders.slice(0, 3), [completedOrders]);

  // Callbacks for navigation
  const handleOrderClick = useCallback((orderId: string) => {
    router.push(`/order/status?orderId=${orderId}`);
  }, [router]);

  const handleNewOrder = useCallback(() => {
    router.push('/order');
  }, [router]);

  const handleViewAllActive = useCallback(() => {
    // Implement view all logic
  }, []);

  const handleViewAllCompleted = useCallback(() => {
    // Implement view all logic
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:shadow-none lg:border-r border-gray-200`}>
          <div className="flex items-center justify-between p-4 lg:justify-center lg:pt-6">
            <h2 className="text-xl font-bold text-gray-900">Bottle Orders</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 lg:hidden"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="mt-8 px-4 space-y-2">
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Bottle Orders
            </a>
            <a href="/profile" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                  <svg className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Order Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Active orders</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{activeOrders.length}</p>
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Completed orders</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{completedOrders.length}</p>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* New Order Button */}
            <button 
              onClick={handleNewOrder} 
              className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white font-medium py-4 px-6 rounded-2xl mb-6 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Order
            </button>

            {/* Orders Sections */}
            <div className="space-y-6">
              {/* Ongoing Orders */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Ongoing Orders</h2>
                  {activeOrders.length > 3 && (
                    <button 
                      onClick={handleViewAllActive}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all
                    </button>
                  )}
                </div>
                
                {displayedActiveOrders.length === 0 ? (
                  <EmptyState
                    title="No active orders"
                    description="Create your first order to get started"
                    icon={
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
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

              {/* Recent Orders */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  {completedOrders.length > 3 && (
                    <button 
                      onClick={handleViewAllCompleted}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
  );
}
