import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { foodApi } from '../api';
import { useCartStore } from '../store/cartStore';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    foodApi.getById(id)
      .then(res => {
        setFood(res.data.data.food);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!food) return;
    try {
      await addItem(food._id, quantity, food.price);
      toast.success('Added to cart');
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Please login to order');
        navigate('/login');
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!food) return <div className="py-20 text-center text-xl font-bold">Food not found</div>;

  return (
    <div className="page-enter py-10">
      <div className="container-custom">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="card p-6 md:p-10 flex flex-col md:flex-row gap-10 bg-zinc-900/50">
          {/* Image */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-800 shadow-2xl">
              <img src={food.image || 'https://via.placeholder.com/800'} alt={food.name} className="w-full h-full object-cover" />
              {food.isPopular && (
                <span className="absolute top-4 left-4 badge badge-orange backdrop-blur-md bg-orange-500/20 text-sm px-4 py-1.5">
                  Popular
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex gap-2 mb-4">
              {food.tags?.map(tag => (
                <span key={tag} className={`badge ${tag === 'veg' ? 'badge-green' : tag === 'non-veg' ? 'badge-red' : 'bg-zinc-800 text-gray-300 border-zinc-700'}`}>
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-black mb-2">{food.name}</h1>
            
            <Link to={`/restaurants/${food.restaurant?._id}`} className="text-orange-500 font-medium hover:underline mb-6 block">
              {food.restaurant?.name}
            </Link>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-white">₹{food.price}</span>
              <div className="h-6 w-[1px] bg-zinc-700" />
              <StarRating rating={food.rating} count={food.reviewCount} size={18} />
            </div>

            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              {food.description}
            </p>

            <div className="mt-auto border-t border-zinc-800 pt-8 flex items-center gap-6">
              <div className="flex items-center gap-4 bg-zinc-800 rounded-full p-2 border border-zinc-700">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center hover:bg-zinc-600 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-6 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center hover:bg-zinc-600 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button onClick={handleAddToCart} className="btn-primary flex-1 py-4 text-lg shadow-lg shadow-orange-500/20 rounded-full">
                <ShoppingBag size={20} /> Add to Cart — ₹{food.price * quantity}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
