import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookProvider } from './contexts/BookContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import Layout from './components/Layout';

const App: React.FC = () => (
  <AuthProvider>
    <BookProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/books" element={<BookListPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
            <Route path="/" element={<Navigate to="/books" replace />} />
          </Route>
        </Routes>
      </Router>
    </BookProvider>
  </AuthProvider>
);

export default App;
