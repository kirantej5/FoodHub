import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, MapPin, Star } from 'lucide-react';
import { restaurantApi, foodApi } from '../api';
import FoodCard from '../components/FoodCard';
import StarRating from '../components/StarRating';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      restaurantApi.getById(id),
      foodApi.getAll({ restaurant: id })
    ]).then(([rRes, fRes]) => {
      setRestaurant(rRes.data.data.restaurant);
      setFoods(fRes.data.data.foods || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!restaurant) return <div className="py-20 text-center text-xl font-bold">Restaurant not found</div>;

  return (
    <div className="page-enter">
      {/* Cover Image & Info */}
      <div className="relative h-[400px]">
        <img src={restaurant.image || 'https://via.placeholder.com/1200x400'} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        
        <div className="container-custom absolute bottom-0 left-0 right-0 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex gap-2 mb-3">
                {restaurant.cuisine.map(c => (
                  <span key={c} className="badge badge-orange bg-zinc-900/50 backdrop-blur-md">{c}</span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">{restaurant.name}</h1>
              <p className="text-gray-300 max-w-2xl mb-6">{restaurant.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={18} fill="currentColor" />
                  <span className="font-bold text-white">{restaurant.rating}</span>
                  <span>({restaurant.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-orange-500" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" />
                  <span>{restaurant.address?.city}, {restaurant.address?.state}</span>
                </div>
              </div>
            </div>
            
            <div className="glass p-4 rounded-xl min-w-[200px] text-center">
              <p className="text-gray-400 text-sm mb-1">Minimum Order</p>
              <p className="text-2xl font-bold text-orange-500">₹{restaurant.minOrder}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container-custom py-16">
        <h2 className="section-title mb-8 flex items-center gap-3">
          Menu <span className="text-sm font-normal text-gray-500 bg-zinc-800 px-3 py-1 rounded-full">{foods.length} items</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foods.map(food => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
}
