"use client";
// components/dashboard/ReviewCard.tsx
import { Star } from 'lucide-react';
import { format } from 'date-fns';

interface TReview {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  review: string;
  rating: number; // 1 to 5
  createdAt: string | Date;
}

const ReviewCard = ({ review }: { review: TReview }) => {
  const fullStars = Math.floor(review.rating);
  const hasHalfStar = review.rating % 1 >= 0.5;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header: Name, Rating, Date */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{review.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(review.createdAt), 'MMM d, yyyy')}
          </p>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < fullStars
                  ? 'fill-yellow-500 text-yellow-500'
                  : i === fullStars && hasHalfStar
                  ? 'fill-yellow-500/50 text-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-semibold text-gray-700">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed line-clamp-4">
        {review.review || (
          <span className="italic text-gray-400">No review text provided.</span>
        )}
      </p>

      {/* Contact Info (subtle) */}
      <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-500">
        <span>{review.email}</span>
        <span>{review.phone}</span>
      </div>
    </div>
  );
};

export default ReviewCard;