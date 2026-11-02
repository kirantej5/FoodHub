import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Receipt, ArrowLeft, XCircle, Clock } from 'lucide-react';
import { orderApi } from '../api';
import OrderStatusStepper from '../components/OrderStatusStepper';
import toast from 'react-hot-toast';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getById(id)
      .then(res => {
        setOrder(res.data.data.order);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await orderApi.cancel(id);
      setOrder(res.data.data.order);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!order) return <div className="py-20 text-center">Order not found</div>;

  return (
    <div className="page-enter py-10">
      <div className="container-custom max-w-4xl">
        <Link to="/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-black mb-1">Order #{order._id.slice(-6).toUpperCase()}</h1>
            <p className="text-gray-400 text-sm">
              Placed on {new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          
          {['pending', 'confirmed'].includes(order.status) && (
            <button onClick={handleCancel} className="btn-secondary text-red-500 border-red-500/30 hover:bg-red-500/10 hover:border-red-500 py-2">
              <XCircle size={16} /> Cancel
            </button>
          )}
        </div>

        {/* Status Tracker */}
        <div className="card p-8 mb-8 bg-zinc-900/80">
          <OrderStatusStepper status={order.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Items */}
            <div className="card p-6 bg-zinc-900/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Receipt className="text-orange-500" size={20} /> Order Items
              </h2>
              
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-200">{item.name}</p>
                        <p className="text-sm text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-bold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="card p-6 bg-zinc-900/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-orange-500" size={20} /> Delivery Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Address</p>
                  <p className="font-medium text-gray-200">
                    {order.deliveryAddress.street}<br />
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Payment Method</p>
                  <p className="font-medium text-gray-200 uppercase">{order.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            {/* Restaurant Info */}
            <div className="card p-6 mb-6 bg-zinc-900/50">
              <p className="text-sm text-gray-400 mb-2">Order from</p>
              <div className="flex items-center gap-3 mb-4">
                <img src={order.restaurant.image} alt={order.restaurant.name} className="w-12 h-12 rounded-full object-cover border border-zinc-700" />
                <div>
                  <Link to={`/restaurants/${order.restaurant._id}`} className="font-bold hover:text-orange-500 transition-colors">
                    {order.restaurant.name}
                  </Link>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <Clock size={12} /> {order.restaurant.deliveryTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="card p-6 bg-zinc-900/50">
              <h3 className="font-bold mb-4">Bill Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount + order.discount}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount ({order.couponCode})</span>
                    <span>- ₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-zinc-800 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-500">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
