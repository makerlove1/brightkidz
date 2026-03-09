import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.sessionId = localStorage.getItem('sessionId');
  }

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });

      const { token, user, sessionId } = response.data;
      
      this.token = token;
      this.user = user;
      this.sessionId = sessionId;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('sessionId', sessionId);
      
      // Clear previous streak check-in data when logging in
      localStorage.removeItem('lastStreakCheckIn');

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async logout() {
    try {
      if (this.token && this.sessionId) {
        await axios.post(
          `${API_URL}/auth/logout`,
          { sessionId: this.sessionId },
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      this.user = null;
      this.sessionId = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('guestMode');
      localStorage.removeItem('lastStreakCheckIn');
      
      // Force reload to clear all state
      window.location.href = '/#/';
    }
  }

  async getCurrentUser() {
    if (!this.token) return null;

    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  isAuthenticated() {
    return !!this.token;
  }

  isAdmin() {
    return this.user?.role === 'admin';
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }
}

export const authService = new AuthService();
