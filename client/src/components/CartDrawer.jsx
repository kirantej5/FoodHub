import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateItem, removeItem, clearCart, subtotal, totalItems } = useCartStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={closeCart} />
      <div className="drawer flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-zinc-900/50" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-orange-500" size={20} />
            <h2 className="text-lg font-bold">Your Cart</h2>
            <span className="badge badge-orange ml-2">{totalItems}</span>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="m-auto flex flex-col items-center justify-center text-gray-500 gap-4">
              <div className="w-24 h-24 rounded-full bg-zinc-800/50 flex items-center justify-center mb-2">
                <ShoppingBag size={40} className="text-zinc-600" />
              </div>
              <p className="text-lg font-medium text-gray-400">Your cart is empty</p>
              <button onClick={() => { closeCart(); navigate('/foods'); }} className="btn-secondary mt-2">
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.food._id || item.food} className="flex gap-4 p-3 rounded-xl bg-zinc-900/50 border border-white/5">
                  <div className="w-20 h-20 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0">
                    <img src={item.food.image || item.image || 'https://via.placeholder.com/150'} alt={item.food.name || item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-1">{item.food.name || item.name}</h4>
                      <p className="text-orange-500 font-bold mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-zinc-800 rounded-full p-1">
                        <button onClick={() => updateItem(item.food._id || item.food, item.quantity - 1)} disabled={item.quantity <= 1} className="w-6 h-6 rounded-full flex items-center justify-center bg-zinc-700 hover:bg-orange-500 hover:text-white disabled:opacity-50 transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateItem(item.food._id || item.food, item.quantity + 1)} className="w-6 h-6 rounded-full flex items-center justify-center bg-zinc-700 hover:bg-orange-500 hover:text-white transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.food._id || item.food)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="text-sm text-red-500 font-medium self-end hover:underline">
                Clear Cart
              </button>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-zinc-900/80 backdrop-blur-md" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>Subtotal</span>
              <span className="text-orange-500">₹{subtotal}</span>
            </div>
            <button
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
              className="btn-primary w-full py-3.5 text-base shadow-lg shadow-orange-500/20"
            >
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
