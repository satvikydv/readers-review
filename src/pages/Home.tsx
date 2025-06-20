
import React from 'react';
import { Link } from 'react-router-dom';
import { useBook } from '../context/BookContext';
import BookCard from '../components/BookCard';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Star } from 'lucide-react';

const Home = () => {
  const { books } = useBook();
  
  // Get featured books (highest rated books)
  const featuredBooks = books
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);

  // Get recent books (assuming newer published books)
  const recentBooks = books
    .sort((a, b) => b.publishedYear - a.publishedYear)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Discover Your Next
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-blue-600 block">
              Favorite Book
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Explore thousands of books, read honest reviews, and share your thoughts with a community of book lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
              <Link to="/books">
                <Search className="mr-2 h-5 w-5" />
                Browse Books
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3">
              <Link to="/books">
                <TrendingUp className="mr-2 h-5 w-5" />
                Top Rated
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Featured Books</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover the highest-rated books that have captivated readers worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredBooks.map((book) => (
              <div key={book.id} className="group">
                <BookCard book={book} className="h-full" />
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-700">Editor's Choice</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Books Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Recently Added</h2>
              <p className="text-slate-600">
                Fresh additions to our collection
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link to="/books">View All Books</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          <div className="text-center mt-8 sm:hidden">
            <Button asChild variant="outline">
              <Link to="/books">View All Books</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-8">Join Our Reading Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">{books.length}+</div>
              <div className="text-amber-100">Books Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-amber-100">Active Readers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-amber-100">Reviews Written</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
