import { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const statusColors = {
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'out for delivery': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await adminApi.getAllOrders({ limit: 100 });
      if (res.data.success) {
        setOrders(res.data.data.orders || []);
      }
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await adminApi.updateOrderStatus(id, status);
      if (res.data.success) {
        toast.success(`Status updated to "${status}"`);
        setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status, status } : o));
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
    </div>
  );

  const currentStatus = (order) => order.orderStatus || order.status || 'Pending';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Manage Orders
        <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">({orders.length} total)</span>
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = currentStatus(order);
                const colorClass = statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
                return (
                  <tr key={order._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-mono text-xs font-medium text-gray-900 dark:text-white">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{order.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">{order.user?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4">{order.items?.length || '—'} items</td>
                    <td className="px-6 py-4 font-semibold text-green-600">${(order.totalAmount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
