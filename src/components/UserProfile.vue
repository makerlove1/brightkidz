<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="user-info">
        <h2>{{ user.username }}</h2>
        <p>{{ user.email }}</p>
      </div>
      <button @click="logout" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i> {{ t('logout') }}
      </button>
    </div>

    <div class="stats-section">
      <h3>{{ t('statistics') }}</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <i class="fas fa-trophy"></i>
          <div>
            <strong>{{ statistics.total_score || 0 }}</strong>
            <span>{{ t('totalScore') }}</span>
          </div>
        </div>
        <div class="stat-item">
          <i class="fas fa-star"></i>
          <div>
            <strong>{{ statistics.rewards_earned || 0 }}</strong>
            <span>{{ t('stars') }}</span>
          </div>
        </div>
        <div class="stat-item">
          <i class="fas fa-clock"></i>
          <div>
            <strong>{{ formatTime(statistics.total_time_spent) }}</strong>
            <span>{{ t('timeSpent') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="progress-section">
      <h3>{{ t('recentProgress') }}</h3>
      <div v-if="progress.length === 0" class="no-data">
        {{ t('noProgressYet') }}
      </div>
      <div v-else class="progress-list">
        <div v-for="item in progress.slice(0, 10)" :key="item.id" class="progress-item">
          <div class="game-info">
            <strong>{{ item.game_name }}</strong>
            <span class="game-type">{{ item.game_type }}</span>
          </div>
          <div class="progress-stats">
            <span class="score">{{ item.score }} pts</span>
            <span :class="['status', { completed: item.completed }]">
              {{ item.completed ? t('completed') : t('inProgress') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="actions">
      <button @click="$router.push('/')" class="action-btn primary">
        <i class="fas fa-home"></i> {{ t('backToGames') }}
      </button>
    </div>
  </div>
</template>

<script>
import languageManager from "@/utils/LanguageManager";
import { authService } from "@/services/authService";
import { progressService } from "@/services/progressService";

export default {
  name: "UserProfile",
  data() {
    return {
      user: authService.getUser() || {},
      statistics: {},
      progress: []
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    t(key) {
      return languageManager.translate(key);
    },
    async loadData() {
      try {
        const [stats, prog] = await Promise.all([
          progressService.getUserStats(),
          progressService.getUserProgress()
        ]);
        this.statistics = stats;
        this.progress = prog;
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    },
    formatTime(seconds) {
      if (!seconds) return '0m';
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    },
    logout() {
      authService.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped lang="scss">
.user-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  background: white;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  .avatar {
    i {
      font-size: 4rem;
      color: #667eea;
    }
  }

  .user-info {
    flex: 1;

    h2 {
      margin: 0;
      color: #333;
    }

    p {
      margin: 5px 0 0;
      color: #666;
    }
  }

  .logout-btn {
    padding: 10px 20px;
    background: #e53e3e;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;

    &:hover {
      background: #c53030;
    }
  }
}

.stats-section, .progress-section {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  h3 {
    margin-top: 0;
    color: #667eea;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 12px;

  i {
    font-size: 2rem;
    color: #667eea;
  }

  div {
    display: flex;
    flex-direction: column;

    strong {
      font-size: 1.5rem;
      color: #333;
    }

    span {
      font-size: 0.85rem;
      color: #666;
    }
  }
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 12px;

  .game-info {
    display: flex;
    flex-direction: column;
    gap: 5px;

    strong {
      color: #333;
    }

    .game-type {
      font-size: 0.85rem;
      color: #667eea;
      text-transform: capitalize;
    }
  }

  .progress-stats {
    display: flex;
    gap: 15px;
    align-items: center;

    .score {
      font-weight: 600;
      color: #333;
    }

    .status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      background: #ffd700;
      color: #333;

      &.completed {
        background: #38a169;
        color: white;
      }
    }
  }
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.action-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  i {
    margin-right: 8px;
  }

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .progress-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
