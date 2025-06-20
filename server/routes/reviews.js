import express from 'express';
import Review from '../models/Review.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateRequest, schemas } from '../middleware/validation.js';

const router = express.Router();

// GET /api/reviews - Get reviews with optional bookId filter
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { bookId, userId, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (bookId) query.bookId = bookId;
    if (userId) query.userId = userId;

    const reviews = await Review.find(query)
      .populate('userId', 'name avatar')
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/reviews - Add new review
router.post('/', authenticateToken, validateRequest(schemas.review), async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      userId: req.user._id,
      bookId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    // Create review
    const review = new Review({
      userId: req.user._id,
      bookId,
      rating,
      comment
    });

    await review.save();
    await review.populate('userId', 'name avatar');
    await review.populate('bookId', 'title author');

    // Update user's total reviews count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalReviews: 1 }
    });

    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/reviews/:id - Update review (only by author)
router.put('/:id', authenticateToken, validateRequest(schemas.review), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own reviews' });
    }

    review.rating = req.body.rating;
    review.comment = req.body.comment;
    await review.save();

    await review.populate('userId', 'name avatar');
    await review.populate('bookId', 'title author');

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/reviews/:id - Delete review (by author or admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review or is admin
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update user's total reviews count
    await User.findByIdAndUpdate(review.userId, {
      $inc: { totalReviews: -1 }
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/reviews/:id/helpful - Mark review as helpful
router.post('/:id/helpful',authenticateToken, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review marked as helpful', helpful: review.helpful });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/reviews/:id/report - Report review
router.post('/:id/report', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { reported: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review reported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
