
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, User } from 'lucide-react';
import { useBook } from '../context/BookContext';

const Navbar = () => {
  const location = useLocation();
  const { currentUser } = useBook();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-slate-800">BookReviews</span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/books"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/books') 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              Browse Books
            </Link>
            {currentUser && (
              <Link
                to="/profile"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <User className="h-4 w-4" />
                <span>{currentUser.name}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
