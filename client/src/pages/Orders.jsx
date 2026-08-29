import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { orderApi } from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders()
      .then(res => {
        setOrders(res.data.data.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    }
  };

  return (
    <div className="page-enter py-10">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
          <Package className="text-orange-500" /> My Orders
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 h-32 skeleton" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} className="card p-6 flex flex-col md:flex-row gap-6 hover:-translate-y-1 transition-transform group bg-zinc-900/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg">{order.restaurant.name}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                    <Clock size={14} />
                    {new Date(order.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </div>
                  
                  <p className="text-gray-300 text-sm line-clamp-1">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                </div>
                
                <div className="flex items-center justify-between md:flex-col md:justify-center md:items-end gap-2 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 min-w-[120px]">
                  <span className="font-bold text-xl text-orange-500">₹{order.totalAmount}</span>
                  <div className="text-gray-400 group-hover:text-white transition-colors flex items-center text-sm font-medium">
                    View Details <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center card bg-zinc-900/30">
            <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Package size={32} className="text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
            <Link to="/foods" className="btn-primary">Browse Menu</Link>
          </div>
        )}
      </div>
    </div>
  );
}
