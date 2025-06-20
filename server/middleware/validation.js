import Joi from 'joi';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.log('Validation failed:', req.body); // Log incoming data
      console.log('Validation details:', error.details); // Log specific Joi errors
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        message: 'Query validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Schema definitions
export const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    bio: Joi.string().max(500).optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  book: Joi.object({
    title: Joi.string().max(200).required(),
    author: Joi.string().max(100).required(),
    genre: Joi.string().valid(
      'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
      'Fantasy', 'Thriller', 'Biography', 'History', 'Self-Help',
      'Poetry', 'Drama', 'Horror', 'Adventure', 'Comedy'
    ).required(),
    summary: Joi.string().max(2000).required(),
    description: Joi.string().max(5000).optional(),
    coverUrl: Joi.string().uri().optional(),
    isbn: Joi.string().optional(),
    publishedYear: Joi.number().min(1000).max(new Date().getFullYear()).required(),
    pageCount: Joi.number().min(1).optional(),
    language: Joi.string().optional()
  }),

  review: Joi.object({
    bookId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(10).max(2000).required()
  }),
  

  userUpdate: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    bio: Joi.string().max(500).optional(),
    avatar: Joi.string().uri().optional()
  }),

  bookQuery: Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(50).optional(),
    genre: Joi.string().optional(),
    search: Joi.string().optional(),
    sortBy: Joi.string().valid('title', 'author', 'rating', 'createdAt').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional()
  })
};
