import React from "react";
import {
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface OrderItem {
  _id: string;
  customerName: string;
  phone: string;
  email?: string;
  items: Array<{
    title: string;
    quantity: number;
    price?: number;
  }>;
  total: number;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt?: string;
}

interface RecentOrdersProps {
  orders: OrderItem[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  loading?: boolean;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    label: "Pending",
  },
  approved: {
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-500/20",
    border: "border-green-500/30",
    label: "Approved",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    label: "Rejected",
  },
  completed: {
    icon: CheckCircle,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    label: "Completed",
  },
};

export default function RecentOrders({
  orders,
  onApprove,
  onReject,
  loading,
}: RecentOrdersProps) {
  const recentOrders = orders.slice(0, 8);

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div>
          <h3 className="text-xl font-bold text-white">📋 Recent Orders</h3>
          <p className="text-sm text-gray-400 mt-1">
            Latest {recentOrders.length} orders
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading orders...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No orders found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/50 bg-gray-800/20">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                {(onApprove || onReject) && (
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const config = statusConfig[order.status];
                // const StatusIcon = config.icon;
                const itemsPreview = order.items
                  .slice(0, 2)
                  .map((item) => `${item.title} (×${item.quantity})`)
                  .join(", ");
                const hasMore = order.items.length > 2;

                return (
                  <tr
                    key={order._id}
                    className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300">{itemsPreview}</p>
                      {hasMore && (
                        <p className="text-xs text-gray-500 mt-1">
                          +{order.items.length - 2} more items
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-green-400">
                        Rs {order.total.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* <StatusIcon size={16} className={config.color} /> */}
                        <span
                        //   className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}
                        >
                          {/* {config.label} */}
                        </span>
                      </div>
                    </td>
                    {(onApprove || onReject) && order.status === "pending" && (
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          {onApprove && (
                            <button
                              onClick={() => onApprove(order._id)}
                              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-green-500/30"
                            >
                              Approve
                            </button>
                          )}
                          {onReject && (
                            <button
                              onClick={() => onReject(order._id)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-red-500/30"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-800/50 bg-gray-800/10">
        <a
          href="/Admin/Order"
          className="flex items-center justify-center gap-2 text-green-400 hover:text-green-300 text-sm font-semibold transition-colors"
        >
          View All Orders <ChevronRight size={16} />
        </a>
      </div>
    </div>
  );
}
