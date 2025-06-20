import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [2000, 'Comment cannot exceed 2000 characters']
  },
  helpful: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate reviews from same user for same book
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

// Update book rating after review operations
reviewSchema.post('save', async function() {
  const Book = mongoose.model('Book');
  const book = await Book.findById(this.bookId);
  if (book) {
    await book.updateRating();
  }
});

reviewSchema.post('remove', async function() {
  const Book = mongoose.model('Book');
  const book = await Book.findById(this.bookId);
  if (book) {
    await book.updateRating();
  }
});

export default mongoose.model('Review', reviewSchema);
