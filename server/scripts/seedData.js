
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');
const Review = require('../models/Review');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookreview');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@bookreview.com',
      password: 'admin123',
      role: 'admin',
      bio: 'System administrator and book enthusiast'
    });
    await adminUser.save();

    // Create regular users
    const users = [
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        bio: 'Avid reader and literature lover'
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        password: 'password123',
        bio: 'Science fiction enthusiast'
      },
      {
        name: 'Emma Williams',
        email: 'emma@example.com',
        password: 'password123',
        bio: 'Fantasy and mystery book reviewer'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }

    // Create books
    const books = [
      {
        title: 'The Midnight Library',
        author: 'Matt Haig',
        genre: 'Fiction',
        summary: 'A magical library between life and death where each book represents a different life you could have lived.',
        coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
        publishedYear: 2020,
        pageCount: 288,
        createdBy: adminUser._id
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        genre: 'Self-Help',
        summary: 'A comprehensive guide to building good habits and breaking bad ones through tiny changes.',
        coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop',
        publishedYear: 2018,
        pageCount: 320,
        createdBy: adminUser._id
      },
      {
        title: 'The Seven Husbands of Evelyn Hugo',
        author: 'Taylor Jenkins Reid',
        genre: 'Romance',
        summary: 'A reclusive Hollywood icon finally tells her story to an unknown journalist.',
        coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
        publishedYear: 2017,
        pageCount: 400,
        createdBy: adminUser._id
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Science Fiction',
        summary: 'An epic tale of politics, religion, and survival on the desert planet Arrakis.',
        coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop',
        publishedYear: 1965,
        pageCount: 688,
        createdBy: adminUser._id
      },
      {
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        genre: 'Thriller',
        summary: 'A woman refuses to speak after murdering her husband, and a psychotherapist is determined to understand why.',
        coverUrl: 'https://images.unsplash.com/photo-1515378791036-0648a814a23f?w=300&h=400&fit=crop',
        publishedYear: 2019,
        pageCount: 336,
        createdBy: adminUser._id
      },
      {
        title: 'Educated',
        author: 'Tara Westover',
        genre: 'Biography',
        summary: 'A memoir about growing up in a survivalist family and the transformative power of education.',
        coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop',
        publishedYear: 2018,
        pageCount: 334,
        createdBy: adminUser._id
      }
    ];

    const createdBooks = [];
    for (const bookData of books) {
      const book = new Book(bookData);
      await book.save();
      createdBooks.push(book);
    }

    // Create reviews
    const reviews = [
      {
        userId: createdUsers[0]._id,
        bookId: createdBooks[0]._id,
        rating: 5,
        comment: 'Absolutely beautiful and thought-provoking. Made me reflect on my own life choices.'
      },
      {
        userId: createdUsers[1]._id,
        bookId: createdBooks[0]._id,
        rating: 4,
        comment: 'Great concept and execution. Some parts felt a bit slow, but overall very engaging.'
      },
      {
        userId: createdUsers[0]._id,
        bookId: createdBooks[1]._id,
        rating: 5,
        comment: 'Life-changing! The 1% rule is so simple yet powerful. Already implementing these habits.'
      },
      {
        userId: createdUsers[2]._id,
        bookId: createdBooks[2]._id,
        rating: 5,
        comment: 'One of the best books I have ever read. The storytelling is phenomenal.'
      },
      {
        userId: createdUsers[1]._id,
        bookId: createdBooks[3]._id,
        rating: 4,
        comment: 'A masterpiece of science fiction. Dense but rewarding read.'
      }
    ];

    for (const reviewData of reviews) {
      const review = new Review(reviewData);
      await review.save();
    }

    // Update book ratings
    for (const book of createdBooks) {
      await book.updateRating();
    }

    // Update user review counts
    for (const user of createdUsers) {
      const reviewCount = await Review.countDocuments({ userId: user._id });
      user.totalReviews = reviewCount;
      await user.save();
    }

    console.log('Database seeded successfully!');
    console.log(`Created ${createdBooks.length} books`);
    console.log(`Created ${createdUsers.length + 1} users`);
    console.log(`Created ${reviews.length} reviews`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
