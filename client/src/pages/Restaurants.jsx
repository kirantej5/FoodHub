import { useEffect, useState } from 'react';
import { restaurantApi } from '../api';
import RestaurantCard from '../components/RestaurantCard';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restaurantApi.getAll()
      .then(res => {
        setRestaurants(res.data.data.restaurants || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter py-12">
      <div className="container-custom">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-black mb-4">Restaurants</h1>
          <p className="text-gray-400 mb-8">Order from your favorite local restaurants</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-0 h-[280px] flex flex-col">
                <div className="flex-1 skeleton rounded-none" />
                <div className="p-4 h-16 bg-zinc-900" />
              </div>
            ))}
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(restaurant => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-bold mb-2">No restaurants found</h3>
          </div>
        )}
      </div>
    </div>
  );
}
