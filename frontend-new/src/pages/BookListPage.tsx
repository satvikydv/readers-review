import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../contexts/BookContext';

const genres = [
  'All',
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Thriller',
  'Biography',
  'History',
  'Self-Help',
  'Poetry',
  'Drama',
  'Horror',
  'Adventure',
  'Comedy'
];

const BookListPage: React.FC = () => {
  const { books, loading, error, fetchBooks, searchTerm, setSearchTerm, selectedGenre, setSelectedGenre } = useBooks();
  const [filteredBooks, setFilteredBooks] = useState(books);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let updated = books;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      updated = updated.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term)
      );
    }

    if (selectedGenre && selectedGenre !== 'All') {
      updated = updated.filter(book => book.genre === selectedGenre);
    }

    setFilteredBooks(updated);
  }, [books, searchTerm, selectedGenre]);

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Books</h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedGenre}
          onChange={e => setSelectedGenre(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {genres.map(g => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Book Cards */}
      {loading ? (
        <div className="text-center text-slate-600 text-lg">Loading books...</div>
      ) : error ? (
        <div className="text-center text-red-600 text-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <Link
              key={book._id}
              to={`/books/${book._id}`}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300"
            >
              {book.coverUrl && (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-60 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-blue-700 hover:underline">
                  {book.title}
                </h3>
                <p className="text-sm text-slate-600">by {book.author}</p>
                <div className="mt-2 text-yellow-600 text-sm">
                  Rating: {book.averageRating?.toFixed(1) ?? 'N/A'} / 5
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  {book.genre} • Published {book.publishedYear}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredBooks.length === 0 && !loading && (
        <div className="text-center text-slate-500 mt-10">No books found.</div>
      )}
    </div>
  );
};

export default BookListPage;
