import { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';

function StatCard({ label, value, icon, valueClass = 'text-gray-800 dark:text-white' }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getDashboard();
        if (res.data.success) setStats(res.data.data);
      } catch {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
    </div>
  );

  if (!stats) return <div className="text-center py-10 text-gray-500">No data available.</div>;

  const { totals, ordersByStatus, recentOrders } = stats;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'out for delivery': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={totals.users} icon="👥" />
        <StatCard label="Total Orders" value={totals.orders} icon="📦" />
        <StatCard label="Menu Items" value={totals.foods} icon="🍔" />
        <StatCard
          label="Total Revenue"
          value={`$${(totals.revenue || 0).toFixed(2)}`}
          icon="💰"
          valueClass="text-green-600 dark:text-green-400"
        />
      </div>

      {/* Order Status Breakdown */}
      {ordersByStatus && Object.keys(ordersByStatus).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Orders by Status</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
                <span className="capitalize">{status}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      {recentOrders?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-500 dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Restaurant</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-mono text-gray-800 dark:text-gray-200">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">{order.user?.name || '—'}</td>
                    <td className="px-6 py-4">{order.restaurant?.name || '—'}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">${(order.totalAmount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status?.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {order.status || order.orderStatus || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
