import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(res => res.data),
  register: (name: string, email: string, password: string, bio?: string) =>
    api.post('/auth/register', { name, email, password, bio }).then(res => res.data),
  getCurrentUser: () => api.get('/auth/me').then(res => res.data),
  logout: () => {
    localStorage.removeItem('authToken');
  },

  // Books
  getBooks: (params?: any) => api.get('/books', { params }).then(res => res.data),
  getBook: (id: string) => api.get(`/books/${id}`).then(res => res.data),
  createBook: (data: any) => api.post('/books', data).then(res => res.data),
  updateBook: (id: string, data: any) => api.put(`/books/${id}`, data).then(res => res.data),
  deleteBook: (id: string) => api.delete(`/books/${id}`).then(res => res.data),

  // Reviews
  getReviews: (params?: any) => api.get('/reviews', { params }).then(res => res.data),
  createReview: (data: any) => api.post('/reviews', data).then(res => res.data),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`).then(res => res.data),

  // Users
  getUser: (id: string) => api.get(`/users/${id}`).then(res => res.data),
  getUsers: (params?: any) => api.get('/users', { params }).then(res => res.data),
  promoteUser: (id: string) => api.post(`/users/${id}/promote`).then(res => res.data),
}; 