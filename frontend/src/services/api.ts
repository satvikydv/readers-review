
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async register(name: string, email: string, password: string, bio?: string) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, bio }),
    });
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  // Books methods
  async getBooks(params: {
    page?: number;
    limit?: number;
    genre?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
    ).toString();
    
    return this.request(`/books${queryString ? `?${queryString}` : ''}`);
  }

  async getBook(id: string) {
    return this.request(`/books/${id}`);
  }

  async createBook(bookData: any) {
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(id: string, bookData: any) {
    return this.request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id: string) {
    return this.request(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  // Reviews methods
  async getReviews(params: {
    bookId?: string;
    userId?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
    ).toString();
    
    return this.request(`/reviews${queryString ? `?${queryString}` : ''}`);
  }

  async createReview(reviewData: {
    bookId: string;
    rating: number;
    comment: string;
  }) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(id: string, reviewData: {
    rating: number;
    comment: string;
  }) {
    return this.request(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(id: string) {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // Users methods
  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, userData: {
    name?: string;
    bio?: string;
    avatar?: string;
  }) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserReviews(id: string, page = 1, limit = 10) {
    return this.request(`/users/${id}/reviews?page=${page}&limit=${limit}`);
  }
}

export const apiService = new ApiService();
