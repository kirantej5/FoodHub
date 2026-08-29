import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Receipt, CheckCircle, Ticket } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderApi, couponApi } from '../api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    zipCode: user?.addresses?.[0]?.zipCode || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [validCoupon, setValidCoupon] = useState('');

  useEffect(() => {
    if (items.length === 0) navigate('/foods');
  }, [items, navigate]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await couponApi.validate(couponCode, subtotal);
      setDiscount(res.data.data.discount);
      setValidCoupon(res.data.data.code);
      toast.success('Coupon applied!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setDiscount(0);
      setValidCoupon('');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await orderApi.create({
        deliveryAddress: address,
        paymentMethod,
        couponCode: validCoupon
      });
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const total = subtotal - discount;

  return (
    <div className="page-enter py-10">
      <div className="container-custom max-w-5xl">
        <h1 className="text-3xl font-black mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="flex-1 space-y-6">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="card p-6 bg-zinc-900/50">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Truck className="text-orange-500" /> Delivery Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Street Address</label>
                  <input required type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="input-field" placeholder="123 Main St" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">City</label>
                  <input required type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="input-field" placeholder="Mumbai" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">State</label>
                  <input required type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="input-field" placeholder="MH" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Zip Code</label>
                  <input required type="text" value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} className="input-field" placeholder="400001" />
                </div>
              </div>
            </form>

            <div className="card p-6 bg-zinc-900/50">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="text-orange-500" /> Payment Method</h2>
              
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={e => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-orange-500" />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
                
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={e => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-orange-500" />
                  <span className="font-medium">Credit / Debit Card (Mock)</span>
                </label>
                
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={e => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-orange-500" />
                  <span className="font-medium">UPI (Mock)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="w-full lg:w-[380px]">
            <div className="card p-6 sticky top-24 bg-zinc-900/50">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Receipt className="text-orange-500" /> Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.food._id} className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0">
                        <img src={item.food.image} alt={item.food.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{item.food.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="Coupon Code" 
                      value={couponCode} 
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      className="input-field pl-9 py-2 text-sm uppercase"
                    />
                  </div>
                  <button type="button" onClick={handleApplyCoupon} className="btn-secondary py-2 px-4 text-sm">Apply</button>
                </div>
                {validCoupon && <p className="text-green-500 text-xs mt-2 flex items-center gap-1"><CheckCircle size={12}/> Coupon {validCoupon} applied!</p>}
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-800 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Fee</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-zinc-800 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-500">₹{total}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={loading} 
                className="btn-primary w-full mt-6 py-3.5 shadow-lg shadow-orange-500/20"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
