import axios from 'axios';
import { authService } from './authService';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

class AdminService {
  getHeaders() {
    const token = authService.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  async getDashboard() {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard`, this.getHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch dashboard');
    }
  }

  async getUsers() {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, this.getHeaders());
      return response.data.users;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  }

  async getUserDetails(userId) {
    try {
      const response = await axios.get(`${API_URL}/admin/users/${userId}`, this.getHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user details');
    }
  }

  async getLoginStats(period = 7) {
    try {
      const response = await axios.get(
        `${API_URL}/admin/logins/stats?period=${period}`,
        this.getHeaders()
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch login stats');
    }
  }

  async getProgressStats() {
    try {
      const response = await axios.get(`${API_URL}/admin/progress/stats`, this.getHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch progress stats');
    }
  }

  async toggleUserStatus(userId) {
    try {
      const response = await axios.patch(
        `${API_URL}/admin/users/${userId}/toggle-active`,
        {},
        this.getHeaders()
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to toggle user status');
    }
  }
}

export const adminService = new AdminService();
