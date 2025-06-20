
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBook } from '../context/BookContext';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag, MessageCircle, TrendingUp } from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookById, getReviewsByBookId } = useBook();
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!id) {
    return <div>Book not found</div>;
  }

  const book = getBookById(id);
  const reviews = getReviewsByBookId(id);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Book Not Found</h1>
          <p className="text-slate-600 mb-6">The book you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/books">Browse Books</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/books">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Books
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="aspect-[3/4] mb-6">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <h1 className="text-2xl font-bold text-slate-800 mb-2">{book.title}</h1>
              <p className="text-lg text-slate-600 mb-4">by {book.author}</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <StarRating rating={book.averageRating} size="lg" />
                  <span className="text-sm text-slate-500">
                    {book.totalReviews} reviews
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{book.publishedYear}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag className="h-4 w-4" />
                    <span>{book.genre}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-slate-800 mb-2">Summary</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{book.summary}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Reviews Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <MessageCircle className="h-6 w-6 text-amber-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Reviews</h2>
                    <p className="text-slate-600">{reviews.length} reader reviews</p>
                  </div>
                </div>
                {!showReviewForm && (
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Write Review
                  </Button>
                )}
              </div>

              {/* Rating Distribution */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-600">{book.averageRating}</div>
                  <div className="text-sm text-slate-600">Average Rating</div>
                  <StarRating rating={book.averageRating} size="sm" />
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{book.totalReviews}</div>
                  <div className="text-sm text-slate-600">Total Reviews</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) || 0}%
                  </div>
                  <div className="text-sm text-slate-600">Recommended</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm text-slate-600">Trending</div>
                </div>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div>
                <ReviewForm bookId={book.id} onSubmit={handleReviewSubmitted} />
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No reviews yet</h3>
                  <p className="text-slate-600 mb-4">Be the first to share your thoughts about this book!</p>
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Write the First Review
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
