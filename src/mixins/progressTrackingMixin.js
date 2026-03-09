import { progressService } from '@/services/progressService';

export const progressTrackingMixin = {
  data() {
    return {
      gameStartTime: null,
      currentGameType: '',
      currentGameName: ''
    };
  },
  methods: {
    startGameTracking(gameType, gameName) {
      this.gameStartTime = Date.now();
      this.currentGameType = gameType;
      this.currentGameName = gameName;
    },
    
    async saveGameProgress(score, levelCompleted = 0, completed = false) {
      if (!this.gameStartTime) {
        console.warn('Game tracking not started');
        return;
      }

      const timeSpent = Math.floor((Date.now() - this.gameStartTime) / 1000); // in seconds

      try {
        await progressService.saveProgress({
          gameType: this.currentGameType,
          gameName: this.currentGameName,
          score: score || 0,
          levelCompleted,
          timeSpent,
          completed
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    },

    async updateRewards(rewardPoints) {
      try {
        await progressService.updateRewards(rewardPoints);
        
        // Emit event to update level display
        this.emitter.emit('add-stars', rewardPoints);
      } catch (error) {
        console.error('Failed to update rewards:', error);
      }
    },

    resetGameTracking() {
      this.gameStartTime = null;
      this.currentGameType = '';
      this.currentGameName = '';
    }
  }
};
