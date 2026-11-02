import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { restaurantApi, foodApi, categoryApi } from '../api';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';

export default function Home() {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      foodApi.getFeatured(),
      restaurantApi.getFeatured(),
      categoryApi.getAll()
    ]).then(([fRes, rRes, cRes]) => {
      setFeaturedFoods(fRes.data.data.foods || []);
      setFeaturedRestaurants(rRes.data.data.restaurants || []);
      setCategories(cRes.data.data.categories || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600" alt="Hero" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        </div>
        
        <div className="container-custom relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-medium text-sm mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              Fastest Delivery in Town
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              Delicious Food,<br />
              <span className="gradient-text">Delivered Fast.</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-lg">
              Order from your favorite restaurants and get your food delivered hot and fresh right to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/foods" className="btn-primary py-4 px-8 text-lg w-full sm:w-auto">
                Order Now <ArrowRight size={20} />
              </Link>
              <Link to="/restaurants" className="btn-secondary py-4 px-8 text-lg w-full sm:w-auto">
                Explore Restaurants
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block w-[500px] h-[500px] relative">
            <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-3xl animate-pulse" />
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800" alt="Pizza" className="w-full h-full object-cover rounded-full border-4 border-zinc-800 shadow-2xl relative z-10 animate-[spin_60s_linear_infinite]" />
            
            <div className="absolute top-10 -left-10 glass p-4 rounded-2xl z-20 flex items-center gap-4 animate-[bounce_3s_ease-in-out_infinite]">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Delivery within</p>
                <p className="font-bold text-xl">30 mins</p>
              </div>
            </div>
            
            <div className="absolute bottom-10 -right-10 glass p-4 rounded-2xl z-20 flex items-center gap-4 animate-[bounce_4s_ease-in-out_infinite]">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500">
                <Star size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Top Rated</p>
                <p className="font-bold text-xl">4.9 / 5.0</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-zinc-900/30">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="section-title mb-2">Categories</h2>
              <p className="text-gray-400">Explore food by category</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <Link key={cat._id} to={`/foods?category=${cat._id}`} className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 transition-all hover:-translate-y-1">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 group-hover:ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-900 transition-all">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-medium text-sm group-hover:text-orange-500 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Foods */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="section-title mb-2">Popular Dishes</h2>
              <p className="text-gray-400">Most ordered right now</p>
            </div>
            <Link to="/foods" className="text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1 group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFoods.slice(0, 8).map(food => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-20 bg-zinc-900/30">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="section-title mb-2">Top Restaurants</h2>
              <p className="text-gray-400">Best places to eat</p>
            </div>
            <Link to="/restaurants" className="text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1 group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.slice(0, 3).map(restaurant => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Are you starving?</h2>
            <p className="text-xl text-gray-400 mb-10">Within a few clicks, find meals that are accessible near you.</p>
            <div className="bg-zinc-900 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 border border-zinc-800 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-zinc-800/50 rounded-xl">
                <MapPin className="text-orange-500" />
                <input type="text" placeholder="Enter your delivery address" className="bg-transparent border-none outline-none w-full text-white placeholder-gray-500" />
              </div>
              <button className="btn-primary py-4 px-8 text-lg sm:w-auto w-full">Find Food</button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-orange-500/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-500/10 blur-[120px] rounded-full" />
      </section>
    </div>
  );
}
