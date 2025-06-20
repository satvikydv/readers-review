import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../api';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  summary: string;
  coverUrl: string;
  publishedYear: number;
  averageRating?: number;
  totalReviews?: number;
}

interface Review {
    _id: string;
    id: string;
    bookId: string;
    userId: 
      | string 
      | {
          _id: string;
          name: string;
          avatar?: string;
        };
    userName?: string;  // optional fallback
    rating: number;
    comment: string;
    date: string;
    createdAt: string;
    helpful?: number;
  }
  

interface BookContextType {
  books: Book[];
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  fetchReviews: (bookId: string) => Promise<void>;
  addReview: (bookId: string, rating: number, comment: string) => Promise<void>;

    // ✅ NEW:
    searchTerm: string;
    selectedGenre: string;
    setSearchTerm: (term: string) => void;
    setSelectedGenre: (genre: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
const [selectedGenre, setSelectedGenre] = useState('All');


  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getBooks();
      setBooks(res.books);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (bookId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getReviews({ bookId });
      setReviews(res.reviews);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (bookId: string, rating: number, comment: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.createReview({ bookId, rating, comment });
      await fetchReviews(bookId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add review');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <BookContext.Provider value={{ books, reviews, loading, error, fetchBooks, fetchReviews, addReview, searchTerm, selectedGenre, setSearchTerm, setSelectedGenre }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBooks must be used within BookProvider');
  return ctx;
}; 