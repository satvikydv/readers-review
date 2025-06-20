
# Book Review Platform Backend

A RESTful API for a book review platform built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT tokens
- CRUD operations for books, reviews, and users
- Role-based access control (user/admin)
- Input validation and error handling
- Rate limiting and security middleware
- Search and filtering capabilities
- Pagination support

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Joi** - Input validation
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret key
   - Frontend URL for CORS

5. Start MongoDB service on your machine

6. Seed the database with sample data:
   ```bash
   node scripts/seedData.js
   ```

7. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Books
- `GET /api/books` - List all books (with pagination, search, filtering)
- `GET /api/books/:id` - Get specific book
- `POST /api/books` - Create book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)
- `GET /api/books/:id/stats` - Get book statistics

### Reviews
- `GET /api/reviews` - Get reviews (with filters)
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review (author only)
- `DELETE /api/reviews/:id` - Delete review (author/admin)
- `POST /api/reviews/:id/helpful` - Mark review as helpful
- `POST /api/reviews/:id/report` - Report review

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/reviews` - Get user's reviews
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `POST /api/users/:id/promote` - Promote user to admin (admin only)

## Query Parameters

### Books (`GET /api/books`)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12, max: 50)
- `genre` - Filter by genre
- `search` - Search in title/author
- `sortBy` - Sort field (title, author, rating, createdAt)
- `sortOrder` - Sort direction (asc, desc)

### Reviews (`GET /api/reviews`)
- `bookId` - Filter by book ID
- `userId` - Filter by user ID
- `page` - Page number
- `limit` - Items per page

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address.

## Default Admin Account

After seeding the database:
- Email: `admin@bookreview.com`
- Password: `admin123`

## Development

```bash
# Install nodemon for development
npm install -g nodemon

# Run in development mode
npm run dev

# Run tests
npm test
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance
3. Set secure JWT secret
4. Configure proper CORS origins
5. Use process manager like PM2

```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name "book-review-api"
```

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation
- Password hashing
- JWT token expiration
- Admin-only routes protection

## Database Models

### User
- `name`, `email`, `password`, `bio`, `role`, `joinDate`, `totalReviews`

### Book
- `title`, `author`, `genre`, `summary`, `coverUrl`, `publishedYear`, `averageRating`, `totalReviews`

### Review
- `userId`, `bookId`, `rating`, `comment`, `helpful`, `reported`, `createdAt`
