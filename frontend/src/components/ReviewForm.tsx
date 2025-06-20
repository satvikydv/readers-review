
import React, { useState } from 'react';
import { useBook } from '../context/BookContext';
import StarRating from './StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReviewFormProps {
  bookId: string;
  onSubmit?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, onSubmit }) => {
  const { addReview, currentUser } = useBook();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || rating === 0 || !comment.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      addReview({
        bookId,
        userId: currentUser.id,
        userName: currentUser.name,
        rating,
        comment: comment.trim()
      });

      setRating(0);
      setComment('');
      
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
        <p className="text-amber-800">Please log in to write a review.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your Rating
          </label>
          <StarRating
            rating={rating}
            interactive={true}
            onRatingChange={setRating}
            size="lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your Review
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this book..."
            rows={4}
            required
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          disabled={rating === 0 || !comment.trim() || isSubmitting}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
