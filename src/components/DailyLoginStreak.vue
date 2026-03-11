<template>
  <div v-if="showModal" class="streak-modal-overlay" @click="closeModal">
    <div class="streak-modal" @click.stop>
      <button class="close-button" @click="closeModal">×</button>
      
      <!-- Surprise Animation -->
      <div v-if="!alreadyCheckedIn" class="surprise-animation">
        <div class="confetti"></div>
        <div class="reward-display">
          <div class="reward-emoji">{{ reward.emoji }}</div>
          <h2 class="reward-title">{{ reward.name }}</h2>
          <div class="reward-value">+{{ reward.value }} {{ t('points') }}</div>
          <p class="reward-message">{{ reward.message }}</p>
        </div>
      </div>

      <!-- Streak Information -->
      <div class="streak-info">
        <div class="streak-header">
          <h3>{{ t('dailyLoginStreak') }}</h3>
        </div>

        <div class="streak-stats">
          <div class="stat-card current">
            <div class="stat-icon">🔥</div>
            <div class="stat-value">{{ streakData.currentStreak }}</div>
            <div class="stat-label">{{ t('currentStreak') }}</div>
          </div>

          <div class="stat-card longest">
            <div class="stat-icon">🏆</div>
            <div class="stat-value">{{ streakData.longestStreak }}</div>
            <div class="stat-label">{{ t('longestStreak') }}</div>
          </div>

          <div class="stat-card total">
            <div class="stat-icon">📅</div>
            <div class="stat-value">{{ streakData.totalLoginDays }}</div>
            <div class="stat-label">{{ t('totalDays') }}</div>
          </div>
        </div>

        <!-- Streak Progress Bar -->
        <div class="streak-progress">
          <div class="progress-label">{{ t('nextMilestone') }}</div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
          <div class="progress-text">
            {{ streakData.currentStreak }} / {{ nextMilestone }} {{ t('days') }}
          </div>
        </div>

        <!-- Milestone Rewards -->
        <div class="milestones">
          <h4>{{ t('upcomingRewards') }}</h4>
          <div class="milestone-list">
            <div 
              v-for="milestone in visibleMilestones" 
              :key="milestone.day"
              class="milestone-item"
              :class="{ achieved: streakData.currentStreak >= milestone.day }"
            >
              <div class="milestone-icon">{{ milestone.emoji }}</div>
              <div class="milestone-info">
                <div class="milestone-name">{{ milestone.name }}</div>
                <div class="milestone-reward">{{ milestone.value }} {{ t('points') }}</div>
              </div>
              <div class="milestone-day">{{ t('day') }} {{ milestone.day }}</div>
            </div>
          </div>
        </div>

        <button class="continue-button" @click="closeModal">
          {{ t('continue') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import languageManager from '@/utils/LanguageManager';

const API_URL = process.env.VUE_APP_API_URL || 'https://brightkidz-production-43d4.up.railway.app/api';

export default {
  name: 'DailyLoginStreak',
  data() {
    return {
      showModal: false,
      alreadyCheckedIn: false,
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        totalLoginDays: 0
      },
      reward: null,
      milestones: [
        { day: 3, name: '3-Day Streak!', value: 25, emoji: '🔥' },
        { day: 7, name: 'Week Warrior!', value: 50, emoji: '⭐' },
        { day: 14, name: '2-Week Champion!', value: 100, emoji: '🏆' },
        { day: 30, name: 'Monthly Master!', value: 250, emoji: '👑' },
        { day: 50, name: 'Dedication Award!', value: 500, emoji: '💎' },
        { day: 100, name: 'Century Club!', value: 1000, emoji: '🎖️' }
      ]
    };
  },
  computed: {
    nextMilestone() {
      const next = this.milestones.find(m => m.day > this.streakData.currentStreak);
      return next ? next.day : 100;
    },
    progressPercentage() {
      const prevMilestone = [...this.milestones]
        .reverse()
        .find(m => m.day <= this.streakData.currentStreak)?.day || 0;
      const range = this.nextMilestone - prevMilestone;
      const progress = this.streakData.currentStreak - prevMilestone;
      return Math.min((progress / range) * 100, 100);
    },
    visibleMilestones() {
      return this.milestones.filter(m => 
        m.day > this.streakData.currentStreak || 
        m.day === this.streakData.currentStreak
      ).slice(0, 3);
    }
  },
  methods: {
    t(key) {
      return languageManager.translate(key);
    },
    async checkDailyLogin() {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Check if already checked in today using localStorage
      const today = new Date().toISOString().split('T')[0];
      const lastCheckIn = localStorage.getItem('lastStreakCheckIn');
      
      if (lastCheckIn === today) {
        console.log('Already checked in today (cached)');
        await this.loadStreakData();
        return;
      }

      try {
        const response = await axios.post(
          `${API_URL}/streaks/check-in`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { alreadyCheckedIn, streak, reward } = response.data;
        
        this.alreadyCheckedIn = alreadyCheckedIn;
        this.streakData = streak;
        this.reward = reward;

        // Store today's date in localStorage to prevent multiple check-ins
        localStorage.setItem('lastStreakCheckIn', today);

        if (!alreadyCheckedIn) {
          this.showModal = true;
          this.playRewardAnimation();
        }
      } catch (error) {
        console.error('Daily check-in error:', error);
      }
    },
    async loadStreakData() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(
          `${API_URL}/streaks/current`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.streakData = response.data.streak;
      } catch (error) {
        console.error('Load streak error:', error);
      }
    },
    playRewardAnimation() {
      // Add confetti animation
      setTimeout(() => {
        this.createConfetti();
      }, 300);
    },
    createConfetti() {
      const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];
      const confettiContainer = this.$el.querySelector('.confetti');
      
      if (!confettiContainer) return;

      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confettiContainer.appendChild(confetti);
      }
    },
    closeModal() {
      this.showModal = false;
    },
    showStreakModal() {
      this.showModal = true;
    }
  },
  mounted() {
    this.checkDailyLogin();
  }
};
</script>

<style scoped lang="scss">
.streak-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

.streak-modal {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.4s ease;
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

.surprise-animation {
  position: relative;
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 30px;
}

.confetti {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  animation: confettiFall 3s linear forwards;
}

@keyframes confettiFall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.reward-display {
  animation: bounceIn 0.6s ease;
}

.reward-emoji {
  font-size: 5rem;
  margin-bottom: 15px;
  animation: pulse 1s ease infinite;
}

.reward-title {
  font-size: 1.8rem;
  color: #667eea;
  margin-bottom: 10px;
}

.reward-value {
  font-size: 2rem;
  font-weight: bold;
  color: #43e97b;
  margin-bottom: 10px;
}

.reward-message {
  color: #666;
  font-size: 1rem;
}

.streak-info {
  .streak-header {
    text-align: center;
    margin-bottom: 25px;

    h3 {
      font-size: 1.5rem;
      color: #333;
    }
  }
}

.streak-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  color: white;

  &.current {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.longest {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  &.total {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  }

  .stat-icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .stat-label {
    font-size: 0.85rem;
    opacity: 0.9;
  }
}

.streak-progress {
  margin-bottom: 30px;

  .progress-label {
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }

  .progress-bar {
    height: 20px;
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.5s ease;
  }

  .progress-text {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
  }
}

.milestones {
  margin-bottom: 25px;

  h4 {
    color: #333;
    margin-bottom: 15px;
  }
}

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.milestone-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 12px;
  transition: all 0.3s;

  &.achieved {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: white;

    .milestone-day {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .milestone-icon {
    font-size: 2rem;
  }

  .milestone-info {
    flex: 1;

    .milestone-name {
      font-weight: 600;
      margin-bottom: 3px;
    }

    .milestone-reward {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  }

  .milestone-day {
    background: #e0e0e0;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }
}

.continue-button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
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

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .streak-modal {
    padding: 20px;
  }

  .streak-stats {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 15px;
  }

  .reward-emoji {
    font-size: 4rem;
  }

  .reward-title {
    font-size: 1.5rem;
  }
}
</style>
