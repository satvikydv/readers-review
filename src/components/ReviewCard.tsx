
import React from 'react';
import { Review } from '../context/BookContext';
import StarRating from './StarRating';
import { User } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  showBookTitle?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, showBookTitle = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-amber-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-800">{review.userName}</h4>
            <span className="text-sm text-slate-500">{formatDate(review.date)}</span>
          </div>
          <div className="mb-3">
            <StarRating rating={review.rating} size="sm" />
          </div>
          {showBookTitle && (
            <p className="text-sm text-slate-600 mb-2 italic">Review for: Book Title</p>
          )}
          <p className="text-slate-700 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
