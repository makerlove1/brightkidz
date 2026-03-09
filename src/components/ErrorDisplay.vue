<template>
  <div v-if="showErrors && errors.length > 0" class="error-display">
    <div class="error-header">
      <span class="error-title">🐛 Errors ({{ errors.length }})</span>
      <div class="error-actions">
        <button @click="clearErrors" class="error-btn">Clear</button>
        <button @click="exportErrors" class="error-btn">Export</button>
        <button @click="toggleErrors" class="error-btn">{{ minimized ? '▲' : '▼' }}</button>
      </div>
    </div>
    <div v-if="!minimized" class="error-list">
      <div v-for="(error, index) in recentErrors" :key="index" class="error-item">
        <div class="error-type">{{ error.type }}</div>
        <div class="error-time">{{ formatTime(error.timestamp) }}</div>
        <div class="error-details">{{ formatDetails(error.details) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import errorLogger from "@/utils/ErrorLogger";

export default {
  name: "ErrorDisplay",
  data() {
    return {
      errors: [],
      showErrors: process.env.NODE_ENV === 'development',
      minimized: false,
      updateInterval: null,
    };
  },
  computed: {
    recentErrors() {
      return this.errors.slice(-5).reverse(); // Show last 5 errors, newest first
    },
  },
  mounted() {
    // Update errors every second
    this.updateInterval = setInterval(() => {
      this.errors = errorLogger.getErrors();
    }, 1000);
    
    // Initial load
    this.errors = errorLogger.getErrors();
  },
  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  },
  methods: {
    clearErrors() {
      errorLogger.clearErrors();
      this.errors = [];
    },
    exportErrors() {
      errorLogger.exportErrors();
    },
    toggleErrors() {
      this.minimized = !this.minimized;
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    },
    formatDetails(details) {
      if (typeof details === 'string') return details;
      if (details.message) return details.message;
      if (details.error && details.error.message) return details.error.message;
      return JSON.stringify(details).substring(0, 100);
    },
  },
};
</script>

<style scoped lang="scss">
.error-display {
  position: fixed;
  bottom: 10px;
  right: 10px;
  max-width: 400px;
  width: 90%;
  background: rgba(220, 38, 38, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  color: white;
  font-family: monospace;
  font-size: 12px;
  
  @media (max-width: 768px) {
    bottom: 5px;
    right: 5px;
    left: 5px;
    max-width: none;
    width: auto;
    font-size: 11px;
  }
}

.error-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 8px;
  }
}

.error-title {
  font-weight: bold;
  font-size: 14px;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
}

.error-actions {
  display: flex;
  gap: 5px;
}

.error-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }
}

.error-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  
  @media (max-width: 768px) {
    max-height: 200px;
    padding: 8px;
  }
}

.error-item {
  background: rgba(0, 0, 0, 0.2);
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.error-type {
  font-weight: bold;
  margin-bottom: 4px;
  color: #fef3c7;
}

.error-time {
  font-size: 10px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.error-details {
  word-break: break-word;
  line-height: 1.4;
  opacity: 0.9;
}
</style>
