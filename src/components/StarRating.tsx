
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(maxRating)].map((_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;
        const isHalfFilled = starRating - 0.5 <= rating && starRating > rating;

        return (
          <div
            key={index}
            className={`relative ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => handleStarClick(starRating)}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled 
                  ? 'text-amber-400 fill-amber-400' 
                  : isHalfFilled 
                  ? 'text-amber-400 fill-amber-200' 
                  : 'text-gray-300'
              } transition-colors ${interactive ? 'hover:text-amber-400' : ''}`}
            />
          </div>
        );
      })}
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
