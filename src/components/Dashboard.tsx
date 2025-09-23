'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  productName: string;
  label: string;
  date: string;
  deadline?: string;
  status: 'pending' | 'confirmed' | 'declined' | 'completed';
  declineReason?: string;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1234564234',
      clientName: 'Ujjawal S.',
      productName: 'Energyflow Conical Bottle',
      label: 'Blue Cap Label - 250ml',
      date: '7 Feb 2025',
      deadline: '20 Sept 2025, 5:00 PM',
      status: 'pending'
    },
    {
      id: '1234564235',
      clientName: 'Ujjawal S.',
      productName: 'Energyflow Conical Bottle',
      label: 'Blue Cap Label - 250ml',
      date: '7 Feb 2025',
      status: 'pending'
    },
    {
      id: '1234564236',
      clientName: 'Ujjawal S.',
      productName: 'Energyflow Conical Bottle',
      label: 'Blue Cap Label - 250ml',
      date: '7 Feb 2025',
      status: 'pending'
    },
    {
      id: '1234564237',
      clientName: 'Ujjawal S.',
      productName: 'Energyflow Conical Bottle',
      label: 'Blue Cap Label - 250ml',
      date: '2 Feb 2025',
      status: 'completed'
    }
  ]);

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [declineReason, setDeclineReason] = useState('Capacity full');

  const handleDecline = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowDeclineModal(true);
  };

  const confirmDecline = () => {
    if (selectedOrderId && declineReason) {
      setOrders(orders.map(order => 
        order.id === selectedOrderId 
          ? { ...order, status: 'declined' as const, declineReason }
          : order
      ));
      setShowDeclineModal(false);
      setDeclineReason('Capacity full');
      setSelectedOrderId('');
    }
  };

  const handleAccept = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'confirmed' as const }
        : order
    ));
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const previousOrders = orders.filter(order => order.status !== 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upcoming Orders */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming orders</h2>
          
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-16 bg-black rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">spicy</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500">Client name: <span className="text-gray-900 font-medium">{order.clientName}</span></p>
                          <p className="text-sm text-gray-500">{order.productName}</p>
                          <p className="text-sm text-gray-500">{order.label}</p>
                          <p className="text-sm text-gray-500">Order ID: <span className="text-blue-600">{order.id}</span></p>
                          <p className="text-sm text-gray-500">Date: {order.date}</p>
                        </div>
                      </div>
                      
                      {order.status === 'confirmed' && order.deadline && (
                        <div className="mt-4">
                          <p className="text-sm text-green-600">Order confirmed. Get it ready before the deadline.</p>
                          <p className="text-sm text-red-500">Deadline: {order.deadline}</p>
                        </div>
                      )}
                      
                      {order.status === 'declined' && (
                        <div className="mt-4">
                          <p className="text-sm text-red-600">You declined this order.</p>
                          <p className="text-sm text-gray-500">Reason: {order.declineReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {order.status === 'pending' && (
                  <div className="flex space-x-3 mt-6">
                    <button 
                      suppressHydrationWarning
                      onClick={() => handleAccept(order.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Accept
                    </button>
                    <button 
                      suppressHydrationWarning
                      onClick={() => handleDecline(order.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Previous Orders */}
        {previousOrders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Previous Orders</h2>
            
            <div className="space-y-4">
              {previousOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-16 bg-black rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">spicy</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500">Client name: <span className="text-gray-900 font-medium">{order.clientName}</span></p>
                          <p className="text-sm text-gray-500">{order.productName}</p>
                          <p className="text-sm text-gray-500">{order.label}</p>
                          <p className="text-sm text-gray-500">Order ID: <span className="text-blue-600">{order.id}</span></p>
                          <p className="text-sm text-gray-500">Date: {order.date}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        {order.status === 'completed' && (
                          <>
                            <p className="text-sm text-green-600 font-medium">Completed</p>
                            <p className="text-sm text-blue-600">Order finished on 17 Sept, 5:00 PM</p>
                          </>
                        )}
                        {order.status === 'declined' && (
                          <>
                            <p className="text-sm text-red-600 font-medium">Declined</p>
                            <p className="text-sm text-gray-500">Reason: {order.declineReason}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Choose a reason for Decline of order</h3>
              <button 
                suppressHydrationWarning
                onClick={() => setShowDeclineModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <select 
                suppressHydrationWarning
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="Capacity full">Capacity full</option>
                <option value="Material not available">Material not available</option>
                <option value="Technical issues">Technical issues</option>
                <option value="Quality concerns">Quality concerns</option>
                <option value="Pricing issues">Pricing issues</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <button 
              suppressHydrationWarning
              onClick={confirmDecline}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
