
import React from 'react';
import { useBook } from '../context/BookContext';
import ReviewCard from '../components/ReviewCard';
import { User, Calendar, MessageCircle, Star, BookOpen } from 'lucide-react';

const UserProfile = () => {
  const { currentUser, getUserReviews, books } = useBook();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Please Log In</h1>
          <p className="text-slate-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  const userReviews = getUserReviews(currentUser.id);
  const averageRating = userReviews.length > 0 
    ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length 
    : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{currentUser.name}</h1>
              <p className="text-slate-600 mb-4">{currentUser.email}</p>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {formatDate(currentUser.joinDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">{userReviews.length}</div>
            <div className="text-sm text-slate-600">Reviews Written</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Star className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">{averageRating.toFixed(1)}</div>
            <div className="text-sm text-slate-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">{userReviews.length}</div>
            <div className="text-sm text-slate-600">Books Reviewed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">
              {userReviews.length > 0 ? Math.ceil((Date.now() - new Date(currentUser.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0}
            </div>
            <div className="text-sm text-slate-600">Months Active</div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Reviews</h2>
          
          {userReviews.length > 0 ? (
            <div className="space-y-6">
              {userReviews.map((review) => (
                <div key={review.id} className="border-l-4 border-amber-400 pl-6">
                  <div className="mb-2">
                    <h3 className="font-semibold text-slate-800">{getBookTitle(review.bookId)}</h3>
                  </div>
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No reviews yet</h3>
              <p className="text-slate-600">Start exploring books and share your thoughts with the community!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
