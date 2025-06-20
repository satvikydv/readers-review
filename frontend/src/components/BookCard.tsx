
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../context/BookContext';
import StarRating from './StarRating';

interface BookCardProps {
  book: Book;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({ book, className = '' }) => {
  return (
    <Link to={`/books/${book.id}`} className={`block ${className}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-slate-600 text-sm mb-2">by {book.author}</p>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
              {book.genre}
            </span>
            <span className="text-xs text-slate-500">{book.publishedYear}</span>
          </div>
          <div className="flex items-center justify-between">
            <StarRating rating={book.averageRating} size="sm" />
            <span className="text-xs text-slate-500">
              {book.totalReviews} reviews
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
