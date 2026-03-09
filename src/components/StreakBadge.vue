<template>
  <div class="streak-badge" @click="showDetails" v-if="streak.currentStreak > 0">
    <div class="streak-icon">🔥</div>
    <div class="streak-count">{{ streak.currentStreak }}</div>
    <div class="streak-label">{{ t('days') }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import languageManager from '@/utils/LanguageManager';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

export default {
  name: 'StreakBadge',
  data() {
    return {
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        totalLoginDays: 0
      }
    };
  },
  methods: {
    t(key) {
      return languageManager.translate(key);
    },
    async loadStreak() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(
          `${API_URL}/streaks/current`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.streak = response.data.streak;
      } catch (error) {
        console.error('Load streak badge error:', error);
      }
    },
    showDetails() {
      this.$emit('show-streak-details');
    }
  },
  mounted() {
    this.loadStreak();
    // Refresh streak every minute
    this.interval = setInterval(() => {
      this.loadStreak();
    }, 60000);
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
};
</script>

<style scoped lang="scss">
.streak-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  color: white;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  .streak-icon {
    font-size: 1.5rem;
    animation: flicker 2s ease-in-out infinite;
  }

  .streak-count {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .streak-label {
    font-size: 0.85rem;
    opacity: 0.9;
  }
}

@keyframes flicker {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@media (max-width: 768px) {
  .streak-badge {
    padding: 6px 12px;
    
    .streak-icon {
      font-size: 1.2rem;
    }
    
    .streak-count {
      font-size: 1rem;
    }
    
    .streak-label {
      font-size: 0.75rem;
    }
  }
}
</style>
