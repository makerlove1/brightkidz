import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'https://brightkidz-production-43d4.up.railway.app/api';

class GameLevelService {
  async getGameLevel(gameIdentifier) {
    const token = localStorage.getItem('token');
    if (!token) {
      // Fallback to localStorage if not logged in
      const selectedLevel = parseInt(localStorage.getItem(`${gameIdentifier}_selectedLevel`) || '1');
      const unlockedLevels = parseInt(localStorage.getItem(`${gameIdentifier}_unlockedLevels`) || '1');
      return { selectedLevel, unlockedLevels };
    }

    try {
      const response = await axios.get(
        `${API_URL}/game-levels/${gameIdentifier}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Get game level error:', error);
      // Fallback to localStorage
      const selectedLevel = parseInt(localStorage.getItem(`${gameIdentifier}_selectedLevel`) || '1');
      const unlockedLevels = parseInt(localStorage.getItem(`${gameIdentifier}_unlockedLevels`) || '1');
      return { selectedLevel, unlockedLevels };
    }
  }

  async saveGameLevel(gameIdentifier, selectedLevel, unlockedLevels) {
    const token = localStorage.getItem('token');
    
    // Always save to localStorage as fallback
    localStorage.setItem(`${gameIdentifier}_selectedLevel`, selectedLevel);
    localStorage.setItem(`${gameIdentifier}_unlockedLevels`, unlockedLevels);
    
    if (!token) return;

    try {
      await axios.post(
        `${API_URL}/game-levels/${gameIdentifier}`,
        { selectedLevel, unlockedLevels },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Save game level error:', error);
    }
  }
}

export const gameLevelService = new GameLevelService();
