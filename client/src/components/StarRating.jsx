import { Star, StarHalf } from 'lucide-react';

export default function StarRating({ rating, count, size = 14 }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`f-${i}`} size={size} fill="currentColor" className="star-filled" />
        ))}
        {hasHalfStar && (
          <div className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="star-empty absolute inset-0" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star size={size} fill="currentColor" className="star-filled" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`e-${i}`} size={size} className="star-empty" />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
          ({count})
        </span>
      )}
    </div>
  );
}
