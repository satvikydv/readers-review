
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

export interface Book {
  _id: string;
  id: string;
  title: string;
  author: string;
  genre: string;
  summary: string;
  coverUrl: string;
  averageRating: number;
  totalReviews: number;
  publishedYear: number;
  createdBy?: {
    _id: string;
    name: string;
  };
}

export interface Review {
  _id: string;
  id: string;
  bookId: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  userName: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: string;
  helpful?: number;
}

export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalReviews: number;
  bio?: string;
  avatar?: string;
}

interface BookContextType {
  books: Book[];
  reviews: Review[];
  currentUser: User | null;
  searchTerm: string;
  selectedGenre: string;
  loading: boolean;
  error: string | null;
  setSearchTerm: (term: string) => void;
  setSelectedGenre: (genre: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date' | '_id' | 'userId' | 'userName' | 'createdAt'>) => Promise<void>;
  getBookById: (id: string) => Book | undefined;
  getReviewsByBookId: (bookId: string) => Review[];
  getUserReviews: (userId: string) => Review[];
  fetchBooks: (params?: any) => Promise<void>;
  fetchReviews: (bookId?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, bio?: string) => Promise<void>;
  logout: () => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize user from token
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          const user = response.user;
          setCurrentUser({
            ...user,
            id: user._id,
            joinDate: user.createdAt || user.joinDate
          });
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('authToken');
        }
      }
    };

    initializeUser();
  }, []);

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBooks(params);
      const transformedBooks = response.books.map((book: any) => ({
        ...book,
        id: book._id
      }));
      setBooks(transformedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (bookId?: string) => {
    try {
      const params = bookId ? { bookId } : {};
      const response = await apiService.getReviews(params);
      const transformedReviews = response.reviews.map((review: any) => ({
        ...review,
        id: review._id,
        userName: review.userId.name,
        date: review.createdAt.split('T')[0]
      }));
      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.login(email, password);
      const user = response.user;
      setCurrentUser({
        ...user,
        id: user._id,
        joinDate: user.createdAt || user.joinDate
      });
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, bio?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.register(name, email, password, bio);
      const user = response.user;
      setCurrentUser({
        ...user,
        id: user._id,
        joinDate: user.createdAt || user.joinDate
      });
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setCurrentUser(null);
  };

  const addReview = async (newReview: Omit<Review, 'id' | 'date' | '_id' | 'userId' | 'userName' | 'createdAt'>) => {
    try {
      const response = await apiService.createReview({
        bookId: newReview.bookId,
        rating: newReview.rating,
        comment: newReview.comment
      });
      
      const transformedReview = {
        ...response.review,
        id: response.review._id,
        userName: response.review.userId.name,
        date: response.review.createdAt.split('T')[0]
      };
      
      setReviews(prev => [transformedReview, ...prev]);
      
      // Refresh books to update rating
      await fetchBooks();
    } catch (error: any) {
      setError(error.message || 'Failed to add review');
      throw error;
    }
  };

  const getBookById = (id: string): Book | undefined => {
    return books.find(book => book.id === id || book._id === id);
  };

  const getReviewsByBookId = (bookId: string): Review[] => {
    return reviews.filter(review => review.bookId === bookId);
  };

  const getUserReviews = (userId: string): Review[] => {
    return reviews.filter(review => 
      review.userId._id === userId || 
      (typeof review.userId === 'string' && review.userId === userId)
    );
  };

  const value: BookContextType = {
    books,
    reviews,
    currentUser,
    searchTerm,
    selectedGenre,
    loading,
    error,
    setSearchTerm,
    setSelectedGenre,
    addReview,
    getBookById,
    getReviewsByBookId,
    getUserReviews,
    fetchBooks,
    fetchReviews,
    login,
    register,
    logout
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
};
