import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../api';

interface Review {
  _id: string;
  bookId: { _id: string; title: string; author: string; coverUrl?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.getUser(id!);
        setUser(res.user);
        setReviews(res.reviews);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!user) return <div className="text-center mt-10 text-gray-600">User not found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      {/* User Info */}
      <div className="flex items-center space-x-6 mb-8">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover shadow-md"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
            {user.name[0].toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-slate-600">{user.email}</p>
          {user.bio && <p className="mt-2 text-slate-700 italic">{user.bio}</p>}
        </div>
      </div>

      {/* Reviews */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-slate-800">Recent Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-slate-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-6">
            {reviews.map((r) => (
              <li key={r._id} className="p-4 bg-slate-50 rounded-lg shadow-sm">
                <div className="flex items-start space-x-4">
                  {r.bookId.coverUrl ? (
                    <img
                      src={r.bookId.coverUrl}
                      alt={r.bookId.title}
                      className="w-12 h-16 object-cover rounded shadow"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gray-300 rounded flex items-center justify-center text-sm text-gray-500">
                      No Cover
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">
                      {r.bookId.title} <span className="text-slate-500">by</span> {r.bookId.author}
                    </div>
                    <div className="text-sm text-slate-500 mb-2">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-yellow-600 font-medium">Rating: {r.rating}/5</div>
                    <div className="mt-1 text-slate-700">{r.comment}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
