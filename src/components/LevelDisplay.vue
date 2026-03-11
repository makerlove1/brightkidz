<template>
  <div class="level-display" @click="showDetails">
    <div class="level-badge">
      <div class="level-icon">{{ getLevelEmoji() }}</div>
      <div class="level-info">
        <div class="level-number">{{ t('level') }} {{ levelData.currentLevel }}</div>
        <div class="level-progress-mini">
          <div class="progress-bar-mini">
            <div 
              class="progress-fill-mini" 
              :style="{ width: levelData.progressPercentage + '%' }"
            ></div>
          </div>
          <div class="progress-text-mini">
            {{ levelData.currentStars }}/{{ levelData.starsToNextLevel }} ⭐
          </div>
        </div>
      </div>
    </div>

    <!-- Level Up Modal - Using Teleport to render at root level -->
    <Teleport to="body">
      <div v-if="showLevelUpModal" class="level-modal-overlay" @click="closeLevelUpModal">
        <div class="level-modal" @click.stop>
          <button class="close-button" @click="closeLevelUpModal">×</button>
          
          <div class="level-up-animation">
            <div class="level-up-burst"></div>
            <div class="level-up-content">
              <div class="level-up-emoji">{{ currentLevelUp.emoji }}</div>
              <h2 class="level-up-title">{{ t('levelUp') }}!</h2>
              <div class="level-up-number">{{ t('level') }} {{ currentLevelUp.level }}</div>
              <div class="level-up-title-badge">{{ currentLevelUp.title }}</div>
              <p class="level-up-message">{{ currentLevelUp.message }}</p>
              <div v-if="currentLevelUp.bonus" class="level-up-bonus">
                +{{ currentLevelUp.bonus }} {{ t('bonusPoints') }}
              </div>
            </div>
          </div>

          <button class="continue-button" @click="closeLevelUpModal">
            {{ t('awesome') }}!
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import axios from 'axios';
import languageManager from '@/utils/LanguageManager';

const API_URL = process.env.VUE_APP_API_URL || 'https://brightkidz-production-43d4.up.railway.app/api';

export default {
  name: 'LevelDisplay',
  data() {
    return {
      levelData: {
        currentLevel: 1,
        currentStars: 0,
        totalStarsEarned: 0,
        starsToNextLevel: 10,
        progressPercentage: 0
      },
      showLevelUpModal: false,
      currentLevelUp: null,
      levelUpQueue: []
    };
  },
  methods: {
    t(key) {
      return languageManager.translate(key);
    },
    getLevelEmoji() {
      const level = this.levelData.currentLevel;
      if (level >= 200) return '🏆';
      if (level >= 150) return '💎';
      if (level >= 100) return '👑';
      if (level >= 75) return '🧠';
      if (level >= 50) return '🎓';
      if (level >= 25) return '📚';
      if (level >= 10) return '🌟';
      if (level >= 5) return '⭐';
      return '🌱';
    },
    async loadLevel() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('LevelDisplay: No token, skipping level load');
        return;
      }

      try {
        console.log('LevelDisplay: Loading level data...');
        const response = await axios.get(
          `${API_URL}/levels/current`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000
          }
        );
        console.log('LevelDisplay: Level data loaded:', response.data.level);
        this.levelData = response.data.level;
      } catch (error) {
        console.error('LevelDisplay: Load level error:', error.message);
        if (error.response) {
          console.error('LevelDisplay: Error status:', error.response.status);
          console.error('LevelDisplay: Error data:', error.response.data);
        }
      }
    },
    async addStars(stars) {
      const token = localStorage.getItem('token');
      console.log('LevelDisplay: addStars called with:', stars, 'token exists:', !!token);
      
      if (!token) {
        console.warn('LevelDisplay: No token found, cannot add stars');
        return;
      }
      
      if (stars < 1) {
        console.warn('LevelDisplay: Invalid star amount:', stars);
        return;
      }

      try {
        console.log('LevelDisplay: Sending API request to add', stars, 'stars');
        const response = await axios.post(
          `${API_URL}/levels/add-stars`,
          { stars },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('LevelDisplay: API response:', response.data);
        const { leveledUp, levelsGained, level } = response.data;
        this.levelData = level;

        if (leveledUp && levelsGained.length > 0) {
          this.levelUpQueue = levelsGained;
          this.showNextLevelUp();
        }
        
        // Emit event to update header rewards - this is critical!
        this.emitter.emit('rewards-updated', level.rewards || level.totalStarsEarned);
        
        console.log('LevelDisplay: Stars added successfully:', { stars, newLevel: level });
      } catch (error) {
        console.error('LevelDisplay: Add stars error:', error);
        if (error.response) {
          console.error('LevelDisplay: Error response:', error.response.data);
          console.error('LevelDisplay: Error status:', error.response.status);
        }
      }
    },
    showNextLevelUp() {
      if (this.levelUpQueue.length > 0) {
        this.currentLevelUp = this.levelUpQueue.shift();
        this.showLevelUpModal = true;
        this.playLevelUpAnimation();
      }
    },
    closeLevelUpModal() {
      this.showLevelUpModal = false;
      // Show next level up if there are more in queue
      setTimeout(() => {
        if (this.levelUpQueue.length > 0) {
          this.showNextLevelUp();
        }
      }, 300);
    },
    playLevelUpAnimation() {
      // Play sound effect if available
      try {
        const audio = new Audio('/sounds/levelup.mp3');
        audio.play().catch(() => {
          // Sound play failed, ignore
        });
      } catch (e) {
        // Audio not available, ignore
        console.debug('Level up sound not available');
      }
    },
    showDetails() {
      this.$emit('show-level-details');
    }
  },
  mounted() {
    this.loadLevel();
    
    // Listen for star rewards from games
    this.emitter.on('showReward', (stars) => {
      // Handle both array and number formats
      const starAmount = Array.isArray(stars) ? parseInt(stars[0]) : parseInt(stars);
      console.log('LevelDisplay: Received showReward event');
      console.log('LevelDisplay: Raw stars value:', stars);
      console.log('LevelDisplay: Parsed star amount:', starAmount);
      console.log('LevelDisplay: Is guest mode:', localStorage.getItem('guestMode'));
      console.log('LevelDisplay: Token exists:', !!localStorage.getItem('token'));
      
      if (starAmount && starAmount > 0) {
        this.addStars(starAmount);
      } else {
        console.error('LevelDisplay: Invalid star amount after parsing:', starAmount);
      }
    });
    
    console.log('LevelDisplay: Component mounted and listening for showReward events');
  },
  beforeUnmount() {
    this.emitter.off('showReward');
  }
};
</script>

<style scoped lang="scss">
.level-display {
  cursor: pointer;
}

.level-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 8px 15px;
  border-radius: 20px;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
}

.level-icon {
  font-size: 1.8rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.level-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.level-number {
  font-weight: bold;
  font-size: 0.95rem;
}

.level-progress-mini {
  display: flex;
  align-items: center;
  gap: 5px;
}

.progress-bar-mini {
  width: 60px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill-mini {
  height: 100%;
  background: white;
  transition: width 0.5s ease;
}

.progress-text-mini {
  font-size: 0.75rem;
  opacity: 0.9;
  white-space: nowrap;
}

.level-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2147483647 !important;
  isolation: isolate;
  animation: fadeIn 0.3s ease;
}

.level-modal {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  position: relative;
  z-index: 2147483647 !important;
  animation: scaleIn 0.5s ease;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  z-index: 10;
  
  &:hover {
    color: #333;
  }
}

.level-up-animation {
  position: relative;
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
}

.level-up-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
  animation: burst 1s ease-out;
}

@keyframes burst {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.level-up-content {
  position: relative;
  z-index: 1;
}

.level-up-emoji {
  font-size: 5rem;
  margin-bottom: 15px;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.level-up-title {
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 10px;
  font-weight: bold;
}

.level-up-number {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.level-up-title-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.level-up-message {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.level-up-bonus {
  font-size: 1.5rem;
  font-weight: bold;
  color: #43e97b;
}

.continue-button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .level-badge {
    padding: 6px 12px;
  }

  .level-icon {
    font-size: 1.5rem;
  }

  .level-number {
    font-size: 0.85rem;
  }

  .progress-bar-mini {
    width: 50px;
  }

  .level-modal {
    padding: 30px 20px;
  }

  .level-up-emoji {
    font-size: 4rem;
  }

  .level-up-title {
    font-size: 1.5rem;
  }

  .level-up-number {
    font-size: 2.5rem;
  }
}
</style>
