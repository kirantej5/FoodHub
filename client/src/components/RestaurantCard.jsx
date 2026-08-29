import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import StarRating from './StarRating';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurants/${restaurant._id}`} className="card block group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-bold text-xl text-white mb-1 drop-shadow-md">
            {restaurant.name}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-1 drop-shadow-md">
            {restaurant.cuisine.join(' • ')}
          </p>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between" style={{ background: 'var(--color-surface)' }}>
        <StarRating rating={restaurant.rating} count={restaurant.reviewCount} />
        
        <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
          <Clock size={14} />
          <span>{restaurant.deliveryTime}</span>
        </div>
      </div>
    </Link>
  );
}
