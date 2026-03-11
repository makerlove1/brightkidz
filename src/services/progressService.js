import axios from 'axios';
import { authService } from './authService';

const API_URL = process.env.VUE_APP_API_URL || 'https://brightkidz-production-43d4.up.railway.app/api';

class ProgressService {
  getHeaders() {
    const token = authService.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  async saveProgress(progressData) {
    // Only save if user is authenticated
    if (!authService.isAuthenticated()) {
      console.log('Guest mode - progress not saved to database');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/progress/save`,
        progressData,
        this.getHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Failed to save progress:', error);
      throw new Error(error.response?.data?.error || 'Failed to save progress');
    }
  }

  async updateRewards(rewards) {
    if (!authService.isAuthenticated()) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/progress/rewards`,
        { rewards },
        this.getHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update rewards:', error);
      throw new Error(error.response?.data?.error || 'Failed to update rewards');
    }
  }

  async getUserProgress() {
    if (!authService.isAuthenticated()) {
      return [];
    }

    try {
      const response = await axios.get(`${API_URL}/users/progress`, this.getHeaders());
      return response.data.progress;
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      return [];
    }
  }

  async getUserStats() {
    if (!authService.isAuthenticated()) {
      return {};
    }

    try {
      const response = await axios.get(`${API_URL}/users/stats`, this.getHeaders());
      return response.data.statistics;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return {};
    }
  }
}

export const progressService = new ProgressService();
