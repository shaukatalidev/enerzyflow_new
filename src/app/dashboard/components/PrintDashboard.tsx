// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { useAuth } from '@/app/context/AuthContext';
// import { orderService, Order } from '@/app/services/orderService';
// import { Bell, ChevronDown, X } from 'lucide-react';

// interface DeclineModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: (reason: string) => void;
//   isLoading: boolean;
// }

// const DeclineModal = ({ isOpen, onClose, onConfirm, isLoading }: DeclineModalProps) => {
//   const [selectedReason, setSelectedReason] = useState('');

//   const reasons = [
//     'Capacity full',
//     'Technical issues',
//     'Insufficient resources',
//     'Other commitments',
//   ];

//   const handleConfirm = () => {
//     if (selectedReason) {
//       onConfirm(selectedReason);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
//       <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           Choose a reason for Decline of order
//         </h3>

//         <div className="mb-6">
//           <div className="relative">
//             <select
//               value={selectedReason}
//               onChange={(e) => setSelectedReason(e.target.value)}
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-blue-500 text-gray-700"
//             >
//               <option value="">Select reason</option>
//               {reasons.map((reason) => (
//                 <option key={reason} value={reason}>
//                   {reason}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//           </div>
//         </div>

//         <button
//           onClick={handleConfirm}
//           disabled={!selectedReason || isLoading}
//           className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
//         >
//           {isLoading ? 'Confirming...' : 'Confirm'}
//         </button>
//       </div>
//     </div>
//   );
// };

// interface OrderCardProps {
//   order: Order;
//   onAccept: (orderId: string) => void;
//   onDecline: (orderId: string) => void;
//   isLoading: boolean;
//   showActions?: boolean;
// }

// const OrderCard = ({ order, onAccept, onDecline, isLoading, showActions = true }: OrderCardProps) => {
//   const getProductName = useCallback((order: Order) => {
//     const variant = order.variant.charAt(0).toUpperCase() + order.variant.slice(1);
//     const capColor = order.cap_color.charAt(0).toUpperCase() + order.cap_color.slice(1).replace('_', ' ');
//     return `${variant} Bottle ${capColor} Cap Label - ${order.volume}ml`;
//   }, []);

//   const formatDate = useCallback((dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//     });
//   }, []);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return 'text-green-600';
//       case 'declined':
//         return 'text-red-600';
//       default:
//         return 'text-gray-600';
//     }
//   };

//   return (
//     <div className="bg-gray-50 rounded-2xl p-4 mb-4">
//       <div className="flex items-start space-x-4 mb-4">
//         <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
//           {order.label_url ? (
//             <Image
//               src={order.label_url}
//               alt="Label"
//               width={80}
//               height={80}
//               className="w-full h-full object-cover"
//               unoptimized
//             />
//           ) : (
//             <span className="text-white text-xs sm:text-sm font-bold">SPICY</span>
//           )}
//         </div>

//         <div className="flex-1 min-w-0">
//           <p className="text-xs sm:text-sm text-gray-600 mb-1">
//             Client name: {order.company_id || 'Ujjawal S.'}
//           </p>
//           <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1">
//             {getProductName(order)}
//           </h3>
//           <p className="text-xs sm:text-sm text-blue-600 mb-1">
//             Order ID: {order.order_id.slice(0, 10)}...
//           </p>
//           <p className="text-xs sm:text-sm text-gray-600">
//             Date: {formatDate(order.created_at)}
//           </p>
//         </div>
//       </div>

//       {showActions ? (
//         <div className="flex gap-2 sm:gap-3">
//           <button
//             onClick={() => onAccept(order.order_id)}
//             disabled={isLoading}
//             className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
//           >
//             Accept
//           </button>
//           <button
//             onClick={() => onDecline(order.order_id)}
//             disabled={isLoading}
//             className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
//           >
//             Decline
//           </button>
//         </div>
//       ) : (
//         <div className="mt-2">
//           {order.status === 'completed' && (
//             <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
//               Completed<br />
//               <span className="text-xs text-gray-500">Order finished on 12 Sept, 5:00 PM</span>
//             </p>
//           )}
//           {order.status === 'declined' && order.decline_reason && (
//             <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
//               You declined this order.<br />
//               <span className="text-xs text-gray-500">Reason: {order.decline_reason}</span>
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function PrintDashboard() {
//   const router = useRouter();
//   const { user, logout } = useAuth();

//   const [upcomingOrders, setUpcomingOrders] = useState<Order[]>([]);
//   const [previousOrders, setPreviousOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [showDeclineModal, setShowDeclineModal] = useState(false);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

//   const fetchAttempted = useRef(false);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (fetchAttempted.current) return;
//       fetchAttempted.current = true;

//       try {
//         const response = await orderService.getOrders({ limit: 100 });
//         const orders = response.orders || [];

//         const upcoming = orders.filter(
//           (order) => order.status === 'placed' || order.status === 'pending'
//         );
//         const previous = orders.filter(
//           (order) => order.status === 'completed' || order.status === 'declined'
//         );

//         setUpcomingOrders(upcoming);
//         setPreviousOrders(previous);
//       } catch (error) {
//         // Handle error silently
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleAccept = async (orderId: string) => {
//     setActionLoading(true);
//     try {
//       // Call your accept order API here
//       // await orderService.acceptOrder(orderId);
      
//       setUpcomingOrders((prev) => prev.filter((order) => order.order_id !== orderId));
//     } catch (error) {
//       // Handle error
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDeclineClick = (orderId: string) => {
//     setSelectedOrderId(orderId);
//     setShowDeclineModal(true);
//   };

//   const handleDeclineConfirm = async (reason: string) => {
//     if (!selectedOrderId) return;

//     setActionLoading(true);
//     try {
//       // Call your decline order API here
//       // await orderService.declineOrder(selectedOrderId, reason);

//       setUpcomingOrders((prev) => prev.filter((order) => order.order_id !== selectedOrderId));
//       setShowDeclineModal(false);
//       setSelectedOrderId(null);
//     } catch (error) {
//       // Handle error
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     router.push('/login');
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading orders...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
//                 Hi {user?.profile?.name || 'Ankit'}!
//               </h1>
//               <p className="text-xs sm:text-sm text-gray-600">
//                 {upcomingOrders.length} new {upcomingOrders.length === 1 ? 'order' : 'orders'} waiting for you
//               </p>
//             </div>

//             <div className="flex items-center gap-3 sm:gap-4">
//               <button className="relative p-2 text-gray-600 hover:text-gray-900">
//                 <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
//                 {upcomingOrders.length > 0 && (
//                   <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
//                 )}
//               </button>

//               <button
//                 onClick={() => router.push('/profile')}
//                 className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-200 flex items-center justify-center overflow-hidden"
//               >
//                 {user?.profile?.profilePhoto ? (
//                   <Image
//                     src={user.profile.profilePhoto}
//                     alt="Profile"
//                     width={40}
//                     height={40}
//                     className="w-full h-full object-cover"
//                     unoptimized
//                   />
//                 ) : (
//                   <span className="text-sm font-semibold text-gray-700">
//                     {user?.profile?.name?.charAt(0) || 'A'}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Desktop Layout */}
//         <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
//           {/* Upcoming Orders - Left Column */}
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming orders</h2>
//             {upcomingOrders.length === 0 ? (
//               <div className="bg-white rounded-2xl p-8 text-center">
//                 <p className="text-gray-500">No upcoming orders</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {upcomingOrders.map((order) => (
//                   <OrderCard
//                     key={order.order_id}
//                     order={order}
//                     onAccept={handleAccept}
//                     onDecline={handleDeclineClick}
//                     isLoading={actionLoading}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Previous Orders - Right Column */}
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous Orders</h2>
//             {previousOrders.length === 0 ? (
//               <div className="bg-white rounded-2xl p-8 text-center">
//                 <p className="text-gray-500">No previous orders</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {previousOrders.map((order) => (
//                   <OrderCard
//                     key={order.order_id}
//                     order={order}
//                     onAccept={handleAccept}
//                     onDecline={handleDeclineClick}
//                     isLoading={actionLoading}
//                     showActions={false}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mobile Layout */}
//         <div className="lg:hidden">
//           {/* Upcoming Orders */}
//           <section className="mb-8">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming orders</h2>
//             {upcomingOrders.length === 0 ? (
//               <div className="bg-white rounded-2xl p-6 text-center">
//                 <p className="text-gray-500">No upcoming orders</p>
//               </div>
//             ) : (
//               upcomingOrders.map((order) => (
//                 <OrderCard
//                   key={order.order_id}
//                   order={order}
//                   onAccept={handleAccept}
//                   onDecline={handleDeclineClick}
//                   isLoading={actionLoading}
//                 />
//               ))
//             )}
//           </section>

//           {/* Previous Orders */}
//           <section>
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Orders</h2>
//             {previousOrders.length === 0 ? (
//               <div className="bg-white rounded-2xl p-6 text-center">
//                 <p className="text-gray-500">No previous orders</p>
//               </div>
//             ) : (
//               previousOrders.map((order) => (
//                 <OrderCard
//                   key={order.order_id}
//                   order={order}
//                   onAccept={handleAccept}
//                   onDecline={handleDeclineClick}
//                   isLoading={actionLoading}
//                   showActions={false}
//                 />
//               ))
//             )}
//           </section>
//         </div>
//       </div>

//       {/* Decline Modal */}
//       <DeclineModal
//         isOpen={showDeclineModal}
//         onClose={() => {
//           setShowDeclineModal(false);
//           setSelectedOrderId(null);
//         }}
//         onConfirm={handleDeclineConfirm}
//         isLoading={actionLoading}
//       />

//       {/* Logout Button */}
//       <div className="fixed bottom-6 right-6">
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg transition-colors font-medium"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }
