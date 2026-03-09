<template>
  <div class="admin-dashboard">
    <header class="admin-header">
      <h1>{{ t('adminDashboard') }}</h1>
      <div class="header-actions">
        <button @click="refreshData" class="refresh-button">
          <i class="fas fa-sync-alt"></i> {{ t('refresh') }}
        </button>
        <button @click="logout" class="logout-button">
          <i class="fas fa-sign-out-alt"></i> {{ t('logout') }}
        </button>
      </div>
    </header>

    <div v-if="loading" class="loading">{{ t('loading') }}...</div>

    <div v-else class="dashboard-content">
      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <i class="fas fa-users"></i>
          <div class="stat-info">
            <h3>{{ statistics.totalUsers }}</h3>
            <p>{{ t('totalUsers') }}</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-user-check"></i>
          <div class="stat-info">
            <h3>{{ statistics.activeUsers }}</h3>
            <p>{{ t('activeUsers') }}</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-sign-in-alt"></i>
          <div class="stat-info">
            <h3>{{ statistics.totalLogins }}</h3>
            <p>{{ t('totalLogins') }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i> {{ t(tab.label) }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Users Tab -->
        <div v-if="activeTab === 'users'" class="users-section">
          <div class="section-header">
            <h2>{{ t('allUsers') }}</h2>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('searchUsers')"
              class="search-input"
            />
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>{{ t('username') }}</th>
                  <th>{{ t('email') }}</th>
                  <th>{{ t('fullName') }}</th>
                  <th>{{ t('level') }}</th>
                  <th>{{ t('totalStars') }}</th>
                  <th>{{ t('currentStreak') }}</th>
                  <th>{{ t('totalLogins') }}</th>
                  <th>{{ t('lastLogin') }}</th>
                  <th>{{ t('actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.full_name || '-' }}</td>
                  <td>
                    <span class="level-badge-small">
                      {{ getLevelEmoji(user.current_level) }} {{ user.current_level }}
                    </span>
                  </td>
                  <td>⭐ {{ user.total_stars }}</td>
                  <td>
                    <span v-if="user.current_streak > 0" class="streak-badge-small">
                      🔥 {{ user.current_streak }}
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td>{{ user.total_logins }}</td>
                  <td>{{ formatDate(user.last_login) }}</td>
                  <td>
                    <button @click="viewUserDetails(user.id)" class="action-button view">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="toggleUserStatus(user.id)" class="action-button toggle">
                      <i :class="user.is_active ? 'fas fa-ban' : 'fas fa-check'"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Logins Tab -->
        <div v-if="activeTab === 'logins'" class="logins-section">
          <h2>{{ t('recentLogins') }}</h2>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>{{ t('username') }}</th>
                  <th>{{ t('email') }}</th>
                  <th>{{ t('loginTime') }}</th>
                  <th>{{ t('logoutTime') }}</th>
                  <th>{{ t('duration') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="login in recentLogins" :key="login.id">
                  <td>{{ login.username }}</td>
                  <td>{{ login.email }}</td>
                  <td>{{ formatDateTime(login.login_time) }}</td>
                  <td>{{ login.logout_time ? formatDateTime(login.logout_time) : t('active') }}</td>
                  <td>{{ formatDuration(login.session_duration) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Statistics Tab -->
        <div v-if="activeTab === 'stats'" class="stats-section">
          <h2>{{ t('detailedStatistics') }}</h2>
          <div class="stats-content">
            <div class="stat-block">
              <h3>{{ t('topPerformers') }}</h3>
              <div class="leaderboard">
                <div v-for="(user, index) in topPerformers" :key="user.id" class="leaderboard-item">
                  <span class="rank">{{ index + 1 }}</span>
                  <span class="name">{{ user.username }}</span>
                  <span class="score">{{ user.total_score }} pts</span>
                </div>
              </div>
            </div>
            <div class="stat-block">
              <h3>{{ t('topStarsEarners') }}</h3>
              <div class="leaderboard">
                <div v-for="(user, index) in topStarsEarners" :key="user.id" class="leaderboard-item">
                  <span class="rank">{{ index + 1 }}</span>
                  <span class="name">{{ user.username }}</span>
                  <span class="stars">⭐ {{ user.total_stars }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="selectedUser" class="modal" @click.self="selectedUser = null">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedUser.username }}</h2>
          <button @click="selectedUser = null" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <div class="user-info">
            <p><strong>{{ t('email') }}:</strong> {{ selectedUser.email }}</p>
            <p><strong>{{ t('fullName') }}:</strong> {{ selectedUser.full_name || '-' }}</p>
            <p><strong>{{ t('totalScore') }}:</strong> {{ selectedUser.total_score }}</p>
            <p><strong>{{ t('stars') }}:</strong> {{ selectedUser.rewards_earned }}</p>
          </div>
          <h3>{{ t('loginHistory') }}</h3>
          <div class="history-list">
            <div v-for="login in selectedUser.loginHistory" :key="login.id" class="history-item">
              <span>{{ formatDateTime(login.login_time) }}</span>
              <span>{{ formatDuration(login.session_duration) }}</span>
            </div>
          </div>
          <h3>{{ t('gameProgress') }}</h3>
          <div class="progress-list">
            <div v-for="progress in selectedUser.progress" :key="progress.id" class="progress-item">
              <span class="game-name">{{ progress.game_name }}</span>
              <span class="score">{{ progress.score }} pts</span>
              <span :class="['status', { completed: progress.completed }]">
                {{ progress.completed ? t('completed') : t('inProgress') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import languageManager from "@/utils/LanguageManager";
import { adminService } from "@/services/adminService";
import { authService } from "@/services/authService";

export default {
  name: "AdminDashboard",
  data() {
    return {
      loading: true,
      statistics: {},
      users: [],
      recentLogins: [],
      topPerformers: [],
      topStarsEarners: [],
      activeTab: 'users',
      searchQuery: '',
      selectedUser: null,
      tabs: [
        { id: 'users', label: 'users', icon: 'fas fa-users' },
        { id: 'logins', label: 'recentLogins', icon: 'fas fa-sign-in-alt' },
        { id: 'stats', label: 'statistics', icon: 'fas fa-chart-bar' }
      ]
    };
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users;
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.full_name && user.full_name.toLowerCase().includes(query))
      );
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    t(key) {
      return languageManager.translate(key);
    },
    async loadData() {
      this.loading = true;
      try {
        const [dashboard, progressStats] = await Promise.all([
          adminService.getDashboard(),
          adminService.getProgressStats()
        ]);
        
        this.statistics = dashboard.statistics;
        this.recentLogins = dashboard.recentLogins;
        this.users = await adminService.getUsers();
        this.topPerformers = progressStats.topPerformers;
        this.topStarsEarners = progressStats.topStarsEarners;
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        this.loading = false;
      }
    },
    async refreshData() {
      await this.loadData();
    },
    async viewUserDetails(userId) {
      try {
        this.selectedUser = await adminService.getUserDetails(userId);
      } catch (error) {
        console.error('Failed to load user details:', error);
      }
    },
    async toggleUserStatus(userId) {
      try {
        await adminService.toggleUserStatus(userId);
        await this.loadData();
      } catch (error) {
        console.error('Failed to toggle user status:', error);
      }
    },
    logout() {
      authService.logout();
      this.$router.push('/login');
    },
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString();
    },
    formatDateTime(date) {
      if (!date) return '-';
      return new Date(date).toLocaleString();
    },
    formatDuration(seconds) {
      if (!seconds) return '-';
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    },
    getLevelEmoji(level) {
      if (!level) return '🌱';
      if (level >= 200) return '🏆';
      if (level >= 150) return '💎';
      if (level >= 100) return '👑';
      if (level >= 75) return '🧠';
      if (level >= 50) return '🎓';
      if (level >= 25) return '📚';
      if (level >= 10) return '🌟';
      if (level >= 5) return '⭐';
      return '🌱';
    }
  }
};
</script>

<style scoped lang="scss">
.admin-dashboard {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.admin-header {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0;
    color: #667eea;
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }
}

.refresh-button, .logout-button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;

  i {
    margin-right: 5px;
  }
}

.refresh-button {
  background: #667eea;
  color: white;

  &:hover {
    background: #5568d3;
  }
}

.logout-button {
  background: #e53e3e;
  color: white;

  &:hover {
    background: #c53030;
  }
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #667eea;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  i {
    font-size: 2.5rem;
    color: #667eea;
  }

  .stat-info {
    h3 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    p {
      margin: 5px 0 0;
      color: #666;
    }
  }
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab {
  padding: 12px 24px;
  border: none;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  i {
    margin-right: 8px;
  }

  &:hover {
    background: #f0f0f0;
  }

  &.active {
    background: #667eea;
    color: white;
  }
}

.tab-content {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: #333;
  }
}

.search-input {
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  width: 300px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    background: #f5f7fa;
    font-weight: 600;
    color: #333;
  }

  tbody tr:hover {
    background: #f9f9f9;
  }
}

.action-button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 5px;
  transition: all 0.3s;

  &.view {
    background: #667eea;
    color: white;

    &:hover {
      background: #5568d3;
    }
  }

  &.toggle {
    background: #e53e3e;
    color: white;

    &:hover {
      background: #c53030;
    }
  }
}

.stats-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.stat-block {
  h3 {
    margin-top: 0;
    color: #667eea;
  }
}

.leaderboard, .game-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leaderboard-item, .game-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;

  .rank {
    font-weight: 700;
    color: #667eea;
    min-width: 30px;
  }

  .name, .game-name {
    flex: 1;
  }

  .score, .play-count {
    font-weight: 600;
    color: #333;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;

  h2 {
    margin: 0;
    color: #667eea;
  }
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
}

.modal-body {
  padding: 20px;

  h3 {
    color: #667eea;
    margin-top: 20px;
  }
}

.user-info {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;

  p {
    margin: 8px 0;
  }
}

.history-list, .progress-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item, .progress-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 6px;
}

.progress-item {
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

.level-badge-small {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
}

.streak-badge-small {
  display: inline-block;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 15px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .table-container {
    font-size: 0.85rem;
  }
}
</style>
