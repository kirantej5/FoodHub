import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import StarRating from './StarRating';
import { useCartStore } from '../store/cartStore';

export default function FoodCard({ food }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(food._id, 1, food.price);
  };

  return (
    <Link to={`/foods/${food._id}`} className="card block group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {food.isPopular && (
          <span className="absolute top-3 left-3 badge badge-orange backdrop-blur-md bg-orange-500/20">
            Popular
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-semibold text-lg line-clamp-1" style={{ color: 'var(--color-text)' }}>
            {food.name}
          </h3>
          <span className="font-bold text-lg" style={{ color: '#f97316' }}>
            ₹{food.price}
          </span>
        </div>

        <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--color-muted)' }}>
          {food.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <StarRating rating={food.rating} count={food.reviewCount} />
          
          <button
            onClick={handleAdd}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#f97316';
              e.currentTarget.style.color = '#f97316';
              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text)';
              e.currentTarget.style.background = 'var(--color-surface-2)';
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
