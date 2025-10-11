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
  CreditCard,
  Filter,
  ClipboardList,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import {
  adminService,
  AllOrderModel,
  User,
  ORDER_STATUS,
} from "@/app/services/adminService";
import Image from "next/image";
import toast from "react-hot-toast";
import OrderComments from "@/components/OrderComments";

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  declinedOrders: number;
}

// Helper function to check if status is pending
function isPendingStatus(status: string): boolean {
  const pendingStatuses: string[] = [
    ORDER_STATUS.PLACED,
    ORDER_STATUS.PRINTING,
    ORDER_STATUS.READY_FOR_PLANT,
    ORDER_STATUS.PLANT_PROCESSING,
  ];
  return pendingStatuses.includes(status);
}

// ✅ Component definitions BEFORE main component

// Component: Stat Card
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

// Component: Tab Button
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

// Component: Person Card
interface PersonCardProps {
  person: User;
  color: "blue" | "green" | "red";
}

const PersonCard: React.FC<PersonCardProps> = ({ person, color }) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  };

  return (
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
          className={`${colorMap[color]} text-xs px-2 py-1 rounded capitalize`}
        >
          {person.Role}
        </span>
      </div>
    </div>
  );
};

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

  // Filter states
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Modal states
  const [editingOrder, setEditingOrder] = useState<AllOrderModel | null>(null);
  const [editingPayment, setEditingPayment] = useState<AllOrderModel | null>(
    null
  );
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(
    null
  );
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [uploadingInvoice, setUploadingInvoice] = useState<string | null>(null);
  const [editingLabelDetails, setEditingLabelDetails] =
    useState<AllOrderModel | null>(null);
  const [viewingComments, setViewingComments] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, usersResponse] = await Promise.all([
        adminService.getAllOrders(100, 0),
        adminService.getAllUsers(),
      ]);

      const fetchedOrders = ordersResponse.orders;
      const fetchedUsers = usersResponse.users;

      setOrders(fetchedOrders);
      setUsers(fetchedUsers);

      const pendingCount = fetchedOrders.filter((o) =>
        isPendingStatus(o.status)
      ).length;
      const completedCount = fetchedOrders.filter(
        (o) => o.status === ORDER_STATUS.COMPLETED
      ).length;
      const declinedCount = fetchedOrders.filter(
        (o) => o.status === ORDER_STATUS.DECLINED
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
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (
    orderId: string,
    status: string,
    reason?: string
  ) => {
    try {
      await adminService.updateOrderStatus(orderId, status, reason);
      await fetchDashboardData();
      setEditingOrder(null);
      toast.success("Order status updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update order status";
      toast.error(errorMessage);
    }
  };

  const handlePaymentStatusUpdate = async (
    orderId: string,
    status: "payment_verified" | "payment_rejected",
    reason?: string
  ) => {
    try {
      const order = orders.find((o) => o.order_id === orderId);

      if (!order) {
        toast.error("Order not found");
        return;
      }

      if (order.payment_status === "payment_pending") {
        toast.error("Payment screenshot has not been uploaded yet");
        return;
      }

      if (order.payment_status === status) {
        toast.error(
          `Payment is already ${
            status === "payment_verified" ? "verified" : "rejected"
          }`
        );
        return;
      }

      if (status === "payment_rejected") {
        if (!reason || !reason.trim()) {
          toast.error("Reason is required for rejecting payment");
          return;
        }
        await adminService.updatePaymentStatus(orderId, status, reason);
        toast.success("Payment rejected successfully");
      } else {
        await adminService.updatePaymentStatus(orderId, status);
        toast.success("Payment verified successfully");
      }

      await fetchDashboardData();
      setEditingPayment(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update payment status";
      toast.error(errorMessage);
    }
  };

  const handleDocumentsUpload = async (
    orderId: string,
    invoiceFile: File | null,
    piFile: File | null
  ) => {
    try {
      if (!invoiceFile && !piFile) {
        toast.error("Please select at least one file to upload");
        return;
      }

      setUploadingInvoice(orderId);

      if (invoiceFile && piFile) {
        await adminService.uploadInvoiceAndPI(orderId, invoiceFile, piFile);
        toast.success("Invoice and PI uploaded successfully");
      } else if (invoiceFile) {
        await adminService.uploadInvoiceOnly(orderId, invoiceFile);
        toast.success("Invoice uploaded successfully");
      } else if (piFile) {
        await adminService.uploadPIOnly(orderId, piFile);
        toast.success("PI uploaded successfully");
      }

      await fetchDashboardData();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload documents";
      toast.error(errorMessage);
    } finally {
      setUploadingInvoice(null);
    }
  };

  const handleLabelDetailsSave = async (
    orderId: string,
    noOfSheets: number,
    cuttingType: string,
    labelsPerSheet: number,
    description: string
  ) => {
    try {
      await adminService.saveOrderLabelDetails(orderId, {
        no_of_sheets: noOfSheets,
        cutting_type: cuttingType,
        labels_per_sheet: labelsPerSheet,
        description: description,
      });
      toast.success("Label details saved successfully");
      await fetchDashboardData();
      setEditingLabelDetails(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save label details";
      toast.error(errorMessage);
    }
  };

  const handleCreateUser = async (
    email: string,
    role: "printing" | "plant"
  ) => {
    try {
      await adminService.createUser({ email, role });
      await fetchDashboardData();
      setIsAddingPerson(false);
      toast.success(
        "User created successfully! Login credentials sent via email."
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user";
      toast.error(errorMessage);
    }
  };

  const handleViewInvoice = (url: string) => {
    const cleanUrl = url.replace("?attachment", "");
    window.open(cleanUrl, "_blank", "noopener,noreferrer");
  };

  // ✅ UPDATED: Separate admins from other users
  const adminUsers = users.filter((u) => u.Role === "admin");
  const nonAdminUsers = users.filter((u) => u.Role !== "admin");

  const filteredUsers =
    roleFilter === "all"
      ? nonAdminUsers
      : nonAdminUsers.filter((u) => u.Role === roleFilter);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
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
            onEditPayment={setEditingPayment}
            onViewScreenshot={setViewingScreenshot}
            onUploadDocuments={handleDocumentsUpload}
            onViewInvoice={handleViewInvoice}
            onEditLabelDetails={setEditingLabelDetails}
            onViewComments={setViewingComments}
            uploadingInvoice={uploadingInvoice}
          />
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <UsersTable
            adminUsers={adminUsers}
            users={filteredUsers}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
          />
        )}

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

      {editingPayment && (
        <PaymentEditModal
          order={editingPayment}
          onClose={() => setEditingPayment(null)}
          onUpdatePayment={handlePaymentStatusUpdate}
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

      {editingLabelDetails && (
        <LabelDetailsModal
          order={editingLabelDetails}
          onClose={() => setEditingLabelDetails(null)}
          onSave={handleLabelDetailsSave}
        />
      )}

      {/* ✅ Comments Modal - Read Only for Admin */}
      {viewingComments && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full relative">
            <button
              onClick={() => setViewingComments(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Close comments"
            >
              <X size={32} />
            </button>
            <OrderComments
              orderId={viewingComments}
              userRole="admin"
              onClose={() => setViewingComments(null)}
              readOnly={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ UPDATED Orders Table Component - All actions in dropdown
interface OrdersTableProps {
  orders: AllOrderModel[];
  onEdit: (order: AllOrderModel) => void;
  onEditPayment: (order: AllOrderModel) => void;
  onViewScreenshot: (url: string) => void;
  onUploadDocuments: (
    orderId: string,
    invoiceFile: File | null,
    piFile: File | null
  ) => void;
  onViewInvoice: (url: string) => void;
  onEditLabelDetails: (order: AllOrderModel) => void;
  onViewComments: (orderId: string) => void;
  uploadingInvoice: string | null;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onEdit,
  onEditPayment,
  onViewScreenshot,
  onUploadDocuments,
  onViewInvoice,
  onEditLabelDetails,
  onViewComments,
  uploadingInvoice,
}) => {
  const [uploadModalOrder, setUploadModalOrder] =
    useState<AllOrderModel | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Order Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Documents
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.order_id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-gray-900">
                      {order.company_name}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-gray-900">
                      {order.user_name}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                    {order.qty} pcs
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${adminService.getStatusColorClass(
                        order.status
                      )}`}
                    >
                      {adminService.formatOrderStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${adminService.getPaymentStatusColorClass(
                        order.payment_status
                      )}`}
                    >
                      {adminService.formatPaymentStatus(order.payment_status)}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {adminService.hasInvoiceUrl(order) && (
                        <button
                          onClick={() => onViewInvoice(order.invoice_url || "")}
                          className="text-xs text-teal-600 hover:text-teal-800 flex items-center"
                          title="View Invoice"
                        >
                          <FileText size={14} className="mr-1" />
                          Invoice
                        </button>
                      )}
                      {adminService.hasPIUrl(order) && (
                        <button
                          onClick={() => onViewInvoice(order.pi_url || "")}
                          className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                          title="View PI"
                        >
                          <FileText size={14} className="mr-1" />
                          PI
                        </button>
                      )}

                      {!adminService.hasAllDocuments(order) && (
                        <span className="text-xs text-gray-400">
                          {adminService.hasInvoiceUrl(order)
                            ? "PI missing"
                            : adminService.hasPIUrl(order)
                            ? "Invoice missing"
                            : "No docs"}
                        </span>
                      )}
                    </div>
                  </td>
                  {/* ✅ UPDATED: Show date with time */}
                  <td className="px-6 py-5 text-sm text-gray-600">
                    {adminService.formatDateWithTime(order.created_at)}
                  </td>
                  {/* ✅ UPDATED: All actions in dropdown menu */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === order.order_id
                              ? null
                              : order.order_id
                          )
                        }
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
                        title="More Actions"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === order.order_id && (
                        <div className="absolute right-0 mt-1 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            {/* Edit Order Status */}
                            <button
                              onClick={() => {
                                onEdit(order);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                            >
                              <Edit2 size={16} className="mr-3 text-blue-600" />
                              Edit Order Status
                            </button>

                            {/* Update Payment Status */}
                            <button
                              onClick={() => {
                                onEditPayment(order);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                            >
                              <CreditCard
                                size={16}
                                className="mr-3 text-purple-600"
                              />
                              Update Payment Status
                            </button>

                            {/* View Payment Screenshot */}
                            {order.payment_url && (
                              <button
                                onClick={() => {
                                  onViewScreenshot(order.payment_url!);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                              >
                                <Eye
                                  size={16}
                                  className="mr-3 text-indigo-600"
                                />
                                View Payment Screenshot
                              </button>
                            )}

                            {/* Upload Invoice/PI */}
                            <button
                              onClick={() => {
                                setUploadModalOrder(order);
                                setOpenMenuId(null);
                              }}
                              disabled={uploadingInvoice === order.order_id}
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer disabled:opacity-50"
                            >
                              {uploadingInvoice === order.order_id ? (
                                <Loader2
                                  size={16}
                                  className="mr-3 text-green-600 animate-spin"
                                />
                              ) : (
                                <Upload
                                  size={16}
                                  className="mr-3 text-green-600"
                                />
                              )}
                              Upload Invoice/PI
                            </button>

                            {/* Label Details */}
                            <button
                              onClick={() => {
                                onEditLabelDetails(order);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                            >
                              <ClipboardList
                                size={16}
                                className="mr-3 text-orange-600"
                              />
                              Label Details
                            </button>

                            {/* View Comments */}
                            <button
                              onClick={() => {
                                onViewComments(order.order_id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                            >
                              <MessageSquare
                                size={16}
                                className="mr-3 text-pink-600"
                              />
                              View Comments
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenMenuId(null)}
        />
      )}

      {uploadModalOrder && (
        <UploadDocumentsModal
          order={uploadModalOrder}
          onClose={() => setUploadModalOrder(null)}
          onUpload={onUploadDocuments}
          uploading={uploadingInvoice === uploadModalOrder.order_id}
        />
      )}
    </>
  );
};

// ✅ UPDATED Users Table Component - Admins separated
interface UsersTableProps {
  adminUsers: User[];
  users: User[];
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  adminUsers,
  users,
  roleFilter,
  onRoleFilterChange,
}) => (
  <div className="space-y-6">
    {/* ✅ Admins Section */}
    {adminUsers.length > 0 && (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-red-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            Administrators ({adminUsers.length})
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {adminUsers.map((user) => (
              <PersonCard key={user.UserID} person={user} color="red" />
            ))}
          </div>
        </div>
      </div>
    )}

    {/* ✅ Other Users Section with Filters */}
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          All Users ({users.length})
        </h2>
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="printing">Printing</option>
            <option value="plant">Plant</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Designation
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.UserID} className="hover:bg-gray-50">
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.Name || "N/A"}
                </td>
                <td className="px-6 py-5 text-sm text-gray-600">
                  {user.Email}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                  {user.Phone || "N/A"}
                </td>
                <td className="px-6 py-5 text-sm text-gray-600">
                  {user.Designation || "N/A"}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${adminService.getRoleBadgeColor(
                      user.Role
                    )}`}
                  >
                    {user.Role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No users found with selected filter
        </div>
      )}
    </div>
  </div>
);

// ✅ Order Edit Modal
// Order Edit Modal Component - UPDATED for Admin restrictions
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
  const [newStatus, setNewStatus] = useState(order.status);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Only allow admin to update to these 3 statuses
  const adminAllowedStatuses = [
    ORDER_STATUS.DISPATCHED,
    ORDER_STATUS.COMPLETED,
    ORDER_STATUS.DECLINED,
  ];

  const requiresReason = newStatus === ORDER_STATUS.DECLINED;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (requiresReason && !reason.trim()) {
      toast.error("Please provide a reason for declining the order");
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdateStatus(
        order.order_id,
        newStatus,
        reason.trim() || undefined
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Update Order Status
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order ID
            </label>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {order.order_id}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <p
              className={`inline-block px-3 py-1 rounded-full text-sm ${adminService.getStatusColorClass(
                order.status
              )}`}
            >
              {adminService.formatOrderStatus(order.status)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={(e) =>
                setNewStatus(
                  e.target
                    .value as (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* ✅ Only show the 3 allowed statuses for admin */}
              {adminAllowedStatuses.map((status) => (
                <option key={status} value={status}>
                  {adminService.formatOrderStatus(status)}
                </option>
              ))}
            </select>
          </div>

          {requiresReason && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Declining <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                required
              />
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
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

// ✅ Payment Edit Modal
interface PaymentEditModalProps {
  order: AllOrderModel;
  onClose: () => void;
  onUpdatePayment: (
    orderId: string,
    status: "payment_verified" | "payment_rejected",
    reason?: string
  ) => void;
}

const PaymentEditModal: React.FC<PaymentEditModalProps> = ({
  order,
  onClose,
  onUpdatePayment,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<
    "payment_verified" | "payment_rejected"
  >("payment_verified");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (selectedStatus === "payment_rejected" && !reason.trim()) {
      toast.error("Reason is required for rejected payment");
      return;
    }
    onUpdatePayment(order.order_id, selectedStatus, reason || undefined);
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Update Payment Status
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Order ID: {order.order_id.slice(0, 13)}...
          </p>
          <p className="text-sm text-gray-600">Company: {order.company_name}</p>
          <p className="text-sm text-gray-600 mt-2">
            Current: {adminService.formatPaymentStatus(order.payment_status)}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            New Payment Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value as "payment_verified" | "payment_rejected"
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="payment_verified">Payment Verified</option>
            <option value="payment_rejected">Payment Rejected</option>
          </select>
        </div>

        {selectedStatus === "payment_rejected" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter reason for rejection..."
            />
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer"
          >
            Update Payment
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Screenshot Modal
interface ScreenshotModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  imageUrl,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="relative max-w-4xl w-full">
      <button
        onClick={onClose}
        className="absolute -top-12 right-0 text-white hover:text-gray-300 cursor-pointer"
      >
        <X size={32} />
      </button>
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Screenshot
        </h3>
        <div className="relative w-full h-[70vh]">
          <Image
            src={imageUrl}
            alt="Payment Screenshot"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
    </div>
  </div>
);

// ✅ Add Person Modal
interface AddPersonModalProps {
  onClose: () => void;
  onSave: (email: string, role: "printing" | "plant") => void;
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({ onClose, onSave }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"printing" | "plant">("printing");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!adminService.validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }
    onSave(email, role);
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Add New Person
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "printing" | "plant")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="printing">Printing</option>
              <option value="plant">Plant</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ Upload Documents Modal
interface UploadDocumentsModalProps {
  order: AllOrderModel;
  onClose: () => void;
  onUpload: (
    orderId: string,
    invoiceFile: File | null,
    piFile: File | null
  ) => void;
  uploading: boolean;
}

const UploadDocumentsModal: React.FC<UploadDocumentsModalProps> = ({
  order,
  onClose,
  onUpload,
  uploading,
}) => {
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [piFile, setPiFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!invoiceFile && !piFile) {
      toast.error("Please select at least one file");
      return;
    }
    onUpload(order.order_id, invoiceFile, piFile);
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Upload Documents
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Order ID: {order.order_id.slice(0, 13)}...
          </p>
          <p className="text-sm text-gray-600">Company: {order.company_name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Invoice (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {invoiceFile && (
            <p className="text-xs text-green-600 mt-1">✓ {invoiceFile.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Proforma Invoice (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPiFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
          />
          {piFile && (
            <p className="text-xs text-green-600 mt-1">✓ {piFile.name}</p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 cursor-pointer flex items-center justify-center"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} className="mr-2" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Roles Panel Component
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
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
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

// ✅ Label Details Modal
interface LabelDetailsModalProps {
  order: AllOrderModel;
  onClose: () => void;
  onSave: (
    orderId: string,
    noOfSheets: number,
    cuttingType: string,
    labelsPerSheet: number,
    description: string
  ) => void;
}

const LabelDetailsModal: React.FC<LabelDetailsModalProps> = ({
  order,
  onClose,
  onSave,
}) => {
  const [noOfSheets, setNoOfSheets] = useState<number>(1);
  const [cuttingType, setCuttingType] = useState<string>("");
  const [labelsPerSheet, setLabelsPerSheet] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch existing label details if any
    const fetchLabelDetails = async () => {
      try {
        const details = await adminService.getOrderLabelDetails(order.order_id);
        if (details) {
          setNoOfSheets(details.no_of_sheets);
          setCuttingType(details.cutting_type);
          setLabelsPerSheet(details.labels_per_sheet);
          setDescription(details.description || "");
        }
      } catch (error) {
        console.error("Failed to fetch label details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabelDetails();
  }, [order.order_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (noOfSheets <= 0) {
      toast.error("Number of sheets must be greater than 0");
      return;
    }

    if (!cuttingType.trim()) {
      toast.error("Cutting type is required");
      return;
    }

    if (labelsPerSheet <= 0) {
      toast.error("Labels per sheet must be greater than 0");
      return;
    }

    setSaving(true);
    try {
      await onSave(
        order.order_id,
        noOfSheets,
        cuttingType,
        labelsPerSheet,
        description
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-orange-600" />
            Label Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">
            Order Information
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Order ID:</span>
              <span className="ml-2 font-medium text-gray-900">
                {order.order_id.slice(0, 13)}...
              </span>
            </div>
            <div>
              <span className="text-gray-600">Company:</span>
              <span className="ml-2 font-medium text-gray-900">
                {order.company_name}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Quantity:</span>
              <span className="ml-2 font-medium text-gray-900">
                {order.qty} pcs
              </span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
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

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Number of Sheets */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Number of Sheets <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={noOfSheets}
                  onChange={(e) => setNoOfSheets(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  required
                />
              </div>

              {/* Cutting Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Cutting Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={cuttingType}
                  onChange={(e) => setCuttingType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  required
                >
                  <option value="">Select cutting type</option>
                  <option value="Die Cut">Die Cut</option>
                  <option value="Kiss Cut">Kiss Cut</option>
                  <option value="Straight Cut">Straight Cut</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {/* Labels Per Sheet */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Labels Per Sheet <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={labelsPerSheet}
                  onChange={(e) =>
                    setLabelsPerSheet(parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description / Additional Notes
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  placeholder="Enter any additional notes or specifications..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Label Details
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
