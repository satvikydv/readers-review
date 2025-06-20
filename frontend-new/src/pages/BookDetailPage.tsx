import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBooks } from '../contexts/BookContext';
import { useAuth } from '../contexts/AuthContext';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { books, reviews, fetchReviews, addReview } = useBooks();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const book = books.find(b => b._id === id);

  useEffect(() => {
    if (id) fetchReviews(id);
  }, [id]);

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await addReview(id, rating, comment);
      setComment('');
      setRating(5);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add review');
    }
  };

  // Type guard to safely access user info
  function isPopulatedUser(
    user: string | { _id: string; name: string; avatar?: string }
  ): user is { _id: string; name: string; avatar?: string } {
    return typeof user === 'object' && 'name' in user;
  }

  if (!book) return <div>Book not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
      <p className="text-gray-700 mb-1"><strong>Author:</strong> {book.author}</p>
      <p className="text-gray-700 mb-1"><strong>Genre:</strong> {book.genre}</p>
      <p className="text-gray-700 mb-1"><strong>Summary:</strong> {book.summary}</p>
      <p className="text-gray-700 mb-6"><strong>Published:</strong> {book.publishedYear}</p>

      <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
      <ul className="space-y-4">
        {reviews.map(r => (
          <li key={r._id} className="border p-4 rounded-lg">
            <div className="flex items-center mb-2">
              {isPopulatedUser(r.userId) && r.userId.avatar && (
                <img
                  src={r.userId.avatar}
                  alt={r.userId.name}
                  className="h-8 w-8 rounded-full mr-2"
                />
              )}
              <strong>{isPopulatedUser(r.userId) ? r.userId.name : r.userName}</strong>
              <span className="ml-2 text-yellow-600">({r.rating}/5)</span>
            </div>
            <p className="text-gray-800">{r.comment}</p>
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={handleReview} className="mt-8 space-y-4">
          <h4 className="text-xl font-semibold">Add a Review</h4>
          <div>
            <label className="block text-sm font-medium">Rating</label>
            <select
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Comment</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              className="w-full border p-2 rounded min-h-[100px]"
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </form>
      ) : (
        <p className="mt-6 italic text-gray-600">Login to add a review.</p>
      )}
    </div>
  );
};

export default BookDetailPage;
