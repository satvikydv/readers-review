
const express = require('express');
const Book = require('../models/Book');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validateRequest, validateQuery, schemas } = require('../middleware/validation');

const router = express.Router();

// GET /api/books - List all books with pagination, filtering, and search
router.get('/', validateQuery(schemas.bookQuery), optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      genre,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (genre) query.genre = genre;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const books = await Book.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name')
      .exec();

    const total = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/books/:id - Get specific book details
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ book });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/books - Add new book (admin only)
router.post('/', authenticateToken, requireAdmin, validateRequest(schemas.book), async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      createdBy: req.user._id
    };

    const book = new Book(bookData);
    await book.save();
    await book.populate('createdBy', 'name');

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/books/:id - Update book (admin only)
router.put('/:id', authenticateToken, requireAdmin, validateRequest(schemas.book), async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/books/:id - Delete book (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Delete all reviews for this book
    const Review = require('../models/Review');
    await Review.deleteMany({ bookId: req.params.id });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/books/:id/stats - Get book statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const Review = require('../models/Review');
    const reviews = await Review.find({ bookId: req.params.id });
    
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length
    }));

    const stats = {
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0,
      ratingDistribution
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
