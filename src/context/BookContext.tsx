
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  summary: string;
  coverUrl: string;
  averageRating: number;
  totalReviews: number;
  publishedYear: number;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalReviews: number;
}

interface BookContextType {
  books: Book[];
  reviews: Review[];
  currentUser: User | null;
  searchTerm: string;
  selectedGenre: string;
  setSearchTerm: (term: string) => void;
  setSelectedGenre: (genre: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getBookById: (id: string) => Book | undefined;
  getReviewsByBookId: (bookId: string) => Review[];
  getUserReviews: (userId: string) => Review[];
}

const BookContext = createContext<BookContextType | undefined>(undefined);

// Mock data
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    summary: 'A magical library between life and death where each book represents a different life you could have lived.',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    averageRating: 4.2,
    totalReviews: 1247,
    publishedYear: 2020
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    summary: 'A comprehensive guide to building good habits and breaking bad ones through tiny changes.',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop',
    averageRating: 4.6,
    totalReviews: 2103,
    publishedYear: 2018
  },
  {
    id: '3',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    genre: 'Romance',
    summary: 'A reclusive Hollywood icon finally tells her story to an unknown journalist.',
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    averageRating: 4.8,
    totalReviews: 3456,
    publishedYear: 2017
  },
  {
    id: '4',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    summary: 'A epic tale of politics, religion, and survival on the desert planet Arrakis.',
    coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop',
    averageRating: 4.4,
    totalReviews: 5632,
    publishedYear: 1965
  },
  {
    id: '5',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Thriller',
    summary: 'A woman refuses to speak after murdering her husband, and a psychotherapist is determined to understand why.',
    coverUrl: 'https://images.unsplash.com/photo-1515378791036-0648a814a23f?w=300&h=400&fit=crop',
    averageRating: 4.1,
    totalReviews: 2987,
    publishedYear: 2019
  },
  {
    id: '6',
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Biography',
    summary: 'A memoir about growing up in a survivalist family and the transformative power of education.',
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop',
    averageRating: 4.5,
    totalReviews: 4321,
    publishedYear: 2018
  }
];

const mockReviews: Review[] = [
  {
    id: '1',
    bookId: '1',
    userId: '1',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely beautiful and thought-provoking. Made me reflect on my own life choices.',
    date: '2024-01-15'
  },
  {
    id: '2',
    bookId: '1',
    userId: '2',
    userName: 'Mike Chen',
    rating: 4,
    comment: 'Great concept and execution. Some parts felt a bit slow, but overall very engaging.',
    date: '2024-01-10'
  },
  {
    id: '3',
    bookId: '2',
    userId: '1',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Life-changing! The 1% rule is so simple yet powerful. Already implementing these habits.',
    date: '2024-01-05'
  }
];

const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  joinDate: '2023-06-15',
  totalReviews: 12
};

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books] = useState<Book[]>(mockBooks);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [currentUser] = useState<User | null>(mockUser);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const addReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [review, ...prev]);
  };

  const getBookById = (id: string): Book | undefined => {
    return books.find(book => book.id === id);
  };

  const getReviewsByBookId = (bookId: string): Review[] => {
    return reviews.filter(review => review.bookId === bookId);
  };

  const getUserReviews = (userId: string): Review[] => {
    return reviews.filter(review => review.userId === userId);
  };

  const value: BookContextType = {
    books,
    reviews,
    currentUser,
    searchTerm,
    selectedGenre,
    setSearchTerm,
    setSelectedGenre,
    addReview,
    getBookById,
    getReviewsByBookId,
    getUserReviews
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
