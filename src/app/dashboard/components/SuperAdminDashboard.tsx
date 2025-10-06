"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Eye,
  Edit2,
  Save,
  UserPlus,
  Users,
  Package,
  Loader2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { adminService, AllOrderModel, User } from "@/app/services/adminService";
import Image from "next/image";

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  declinedOrders: number;
}

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"orders" | "users" | "roles">(
    "orders"
  );
  const [loading, setLoading] = useState(true);

  // Data states
  const [orders, setOrders] = useState<AllOrderModel[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    declinedOrders: 0,
  });

  // Modal states
  const [editingOrder, setEditingOrder] = useState<AllOrderModel | null>(null);
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(
    null
  );
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [uploadingInvoice, setUploadingInvoice] = useState<string | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch data in parallel
      const [ordersResponse, usersResponse] = await Promise.all([
        adminService.getAllOrders(100, 0),
        adminService.getAllUsers(),
      ]);

      const fetchedOrders = ordersResponse.orders || [];
      const fetchedUsers = usersResponse.users || [];

      setOrders(fetchedOrders);
      setUsers(fetchedUsers);

      // Calculate stats
      const pendingCount = fetchedOrders.filter((o) =>
        [
          "placed",
          "payment_uploaded",
          "payment_verified",
          "processing",
          "printing",
        ].includes(o.status)
      ).length;
      const completedCount = fetchedOrders.filter(
        (o) => o.status === "delivered"
      ).length;
      const declinedCount = fetchedOrders.filter(
        (o) => o.status === "declined" || o.status === "payment_rejected"
      ).length;

      setStats({
        totalUsers: fetchedUsers.length,
        totalOrders: fetchedOrders.length,
        pendingOrders: pendingCount,
        completedOrders: completedCount,
        declinedOrders: declinedCount,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Line 93 - Fixed
  const handleOrderStatusUpdate = async (
    orderId: string,
    status: string,
    reason?: string
  ) => {
    try {
      await adminService.updateOrderStatus(orderId, status, reason);
      await fetchDashboardData();
      setEditingOrder(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update order status";
      alert(errorMessage);
    }
  };

  // ✅ Line 104 - Fixed
  const handleInvoiceUpload = async (orderId: string, file: File) => {
    try {
      setUploadingInvoice(orderId);
      await adminService.uploadInvoice(orderId, file);
      await fetchDashboardData();
      alert("Invoice uploaded successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload invoice";
      alert(errorMessage);
    } finally {
      setUploadingInvoice(null);
    }
  };

  // ✅ Line 117 - Fixed
  const handleCreateUser = async (
    email: string,
    role: "printing" | "plant"
  ) => {
    try {
      await adminService.createUser({ email, role });
      await fetchDashboardData();
      setIsAddingPerson(false);
      alert("User created successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user";
      alert(errorMessage);
    }
  };

  // ✅ Function to open PDF in new tab (handles Cloudinary URLs)
  const handleViewInvoice = (url: string) => {
    // Force PDF to open in new tab with fl_attachment flag removed
    const cleanUrl = url.replace(/\/fl_attachment[^/]*\//, "/");
    window.open(cleanUrl, "_blank", "noopener,noreferrer");
  };

  const printingPersons = users.filter((u) => u.Role === "printing");
  const plantPersons = users.filter((u) => u.Role === "plant");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            color="blue"
          />
          <StatCard
            icon={Package}
            label="Total Orders"
            value={stats.totalOrders}
            color="purple"
          />
          <StatCard
            icon={Clock}
            label="Pending Orders"
            value={stats.pendingOrders}
            color="orange"
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={stats.completedOrders}
            color="green"
          />
          <StatCard
            icon={XCircle}
            label="Declined"
            value={stats.declinedOrders}
            color="red"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-6">
          <TabButton
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
            label="Orders Management"
          />
          <TabButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            label="Users Management"
          />
          <TabButton
            active={activeTab === "roles"}
            onClick={() => setActiveTab("roles")}
            label="Printing & Plant Persons"
          />
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <OrdersTable
            orders={orders}
            onEdit={setEditingOrder}
            onViewScreenshot={setViewingScreenshot}
            onUploadInvoice={handleInvoiceUpload}
            onViewInvoice={handleViewInvoice}
            uploadingInvoice={uploadingInvoice}
          />
        )}

        {/* Users Tab */}
        {activeTab === "users" && <UsersTable users={users} />}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <RolesPanel
            printingPersons={printingPersons}
            plantPersons={plantPersons}
            onAddPerson={() => setIsAddingPerson(true)}
          />
        )}
      </div>

      {/* Modals */}
      {editingOrder && (
        <OrderEditModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onUpdateStatus={handleOrderStatusUpdate}
        />
      )}

      {viewingScreenshot && (
        <ScreenshotModal
          imageUrl={viewingScreenshot}
          onClose={() => setViewingScreenshot(null)}
        />
      )}

      {isAddingPerson && (
        <AddPersonModal
          onClose={() => setIsAddingPerson(false)}
          onSave={handleCreateUser}
        />
      )}
    </div>
  );
};

// ==================== Component: Stat Card ====================
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "blue" | "purple" | "orange" | "green" | "red";
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  color,
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div
        className={`p-3 rounded-lg ${colorClasses[color]} inline-block mb-2`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
};

// ==================== Component: Tab Button ====================
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
      active
        ? "bg-white text-blue-600 shadow-sm"
        : "text-gray-600 hover:text-gray-900"
    }`}
  >
    {label}
  </button>
);

// ==================== Component: Orders Table ====================
interface OrdersTableProps {
  orders: AllOrderModel[];
  onEdit: (order: AllOrderModel) => void;
  onViewScreenshot: (url: string) => void;
  onUploadInvoice: (orderId: string, file: File) => void;
  onViewInvoice: (url: string) => void;
  uploadingInvoice: string | null;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onEdit,
  onViewScreenshot,
  onUploadInvoice,
  onViewInvoice,
  uploadingInvoice,
}) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.order_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.order_id.slice(0, 8)}...
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {order.company_name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{order.user_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.qty} pcs
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${adminService.getStatusColorClass(
                    order.status
                  )}`}
                >
                  {adminService.formatOrderStatus(order.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {adminService.formatDate(order.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(order)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit Order"
                  >
                    <Edit2 size={18} />
                  </button>
                  {order.payment_url && (
                    <button
                      onClick={() => onViewScreenshot(order.payment_url)}
                      className="text-purple-600 hover:text-purple-800"
                      title="View Payment Screenshot"
                    >
                      <Eye size={18} />
                    </button>
                  )}
                  {!order.invoice_url && (
                    <label
                      className="cursor-pointer text-green-600 hover:text-green-800"
                      title="Upload Invoice"
                    >
                      {uploadingInvoice === order.order_id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Upload size={18} />
                      )}
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onUploadInvoice(order.order_id, file);
                        }}
                        disabled={uploadingInvoice === order.order_id}
                      />
                    </label>
                  )}
                  {order.invoice_url && (
                    <button
                      onClick={() => onViewInvoice(order.invoice_url)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="View Invoice"
                    >
                      <FileText size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ==================== Component: Users Table ====================
interface UsersTableProps {
  users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
      <div className="text-sm text-gray-500">Total: {users.length}</div>
    </div>
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            User
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Role
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Designation
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user.UserID} className="hover:bg-gray-50">
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {user.Name?.charAt(0) || user.Email.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user.Name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.Phone || "N/A"}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">{user.Email}</td>
            <td className="px-6 py-4 text-sm">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                {user.Role}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {user.Designation || "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ==================== Component: Roles Panel ====================
interface RolesPanelProps {
  printingPersons: User[];
  plantPersons: User[];
  onAddPerson: () => void;
}

const RolesPanel: React.FC<RolesPanelProps> = ({
  printingPersons,
  plantPersons,
  onAddPerson,
}) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-900">
        Printing & Plant Persons
      </h2>
      <button
        onClick={onAddPerson}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        <UserPlus size={18} />
        <span>Add Person</span>
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      {/* Printing Persons */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Users size={20} />
          <span>Printing Persons ({printingPersons.length})</span>
        </h3>
        <div className="space-y-3">
          {printingPersons.map((person) => (
            <PersonCard key={person.UserID} person={person} color="blue" />
          ))}
          {printingPersons.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No printing persons yet
            </p>
          )}
        </div>
      </div>

      {/* Plant Persons */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Users size={20} />
          <span>Plant Persons ({plantPersons.length})</span>
        </h3>
        <div className="space-y-3">
          {plantPersons.map((person) => (
            <PersonCard key={person.UserID} person={person} color="green" />
          ))}
          {plantPersons.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No plant persons yet
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

// ==================== Component: Person Card ====================
interface PersonCardProps {
  person: User;
  color: "blue" | "green";
}

const PersonCard: React.FC<PersonCardProps> = ({ person, color }) => (
  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium text-gray-900">{person.Name || "N/A"}</h4>
        <p className="text-sm text-gray-600">{person.Email}</p>
        <p className="text-sm text-gray-600">{person.Phone || "N/A"}</p>
        {person.Designation && (
          <p className="text-xs text-gray-500 mt-1">{person.Designation}</p>
        )}
      </div>
      <span
        className={`${
          color === "blue"
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
        } text-xs px-2 py-1 rounded capitalize`}
      >
        {person.Role}
      </span>
    </div>
  </div>
);

// ==================== Modal: Order Edit ====================
interface OrderEditModalProps {
  order: AllOrderModel;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string, reason?: string) => void;
}

const OrderEditModal: React.FC<OrderEditModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [reason, setReason] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (adminService.requiresReason(selectedStatus) && !reason.trim()) {
      alert("Reason is required for declined or payment rejected status");
      return;
    }

    setUpdating(true);
    try {
      await onUpdateStatus(
        order.order_id,
        selectedStatus,
        reason.trim() || undefined
      );
    } finally {
      setUpdating(false);
    }
  };

  const statusOptions = [
    "placed",
    "payment_uploaded",
    "payment_verified",
    "processing",
    "printing",
    "dispatched",
    "delivered",
    "declined",
    "payment_rejected",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Update Order Status
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Order Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-3 text-gray-900">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-700 font-medium">Order ID:</span>
                <span className="ml-2 text-gray-900">
                  {order.order_id.slice(0, 13)}...
                </span>
              </div>
              <div>
                <span className="text-gray-700 font-medium">Company:</span>
                <span className="ml-2 text-gray-900">{order.company_name}</span>
              </div>
              <div>
                <span className="text-gray-700 font-medium">Quantity:</span>
                <span className="ml-2 text-gray-900">{order.qty} pcs</span>
              </div>
              <div>
                <span className="text-gray-700 font-medium">
                  Current Status:
                </span>
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full ${adminService.getStatusColorClass(
                    order.status
                  )}`}
                >
                  {adminService.formatOrderStatus(order.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              New Status *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {adminService.formatOrderStatus(status)}
                </option>
              ))}
            </select>
          </div>

          {/* Reason (required for declined/payment_rejected) */}
          {adminService.requiresReason(selectedStatus) && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {selectedStatus === "declined" ? "Decline" : "Rejection"} Reason
                *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder={`Enter reason for ${
                  selectedStatus === "declined"
                    ? "declining"
                    : "rejecting payment"
                }...`}
                required
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {updating ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Update Status
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== Modal: Screenshot ====================
interface ScreenshotModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  imageUrl,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Payment Screenshot</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="relative w-full h-[600px]">
        <Image
          src={imageUrl}
          alt="Payment Screenshot"
          fill
          className="object-contain rounded-lg"
          unoptimized
        />
      </div>
    </div>
  </div>
);

// ==================== Modal: Add Person ====================
interface AddPersonModalProps {
  onClose: () => void;
  onSave: (email: string, role: "printing" | "plant") => void;
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({ onClose, onSave }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"printing" | "plant">("printing");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminService.validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setSaving(true);
    try {
      await onSave(email, role);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Add New Person</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Role *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("printing")}
                className={`p-4 border-2 rounded-lg font-medium ${
                  role === "printing"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300"
                }`}
              >
                🖨️ Printing
              </button>
              <button
                type="button"
                onClick={() => setRole("plant")}
                className={`p-4 border-2 rounded-lg font-medium ${
                  role === "plant"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-300"
                }`}
              >
                🏭 Plant
              </button>
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="person@example.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              User will receive login credentials via email
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={18} className="mr-2" />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
