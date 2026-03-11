<template>
  <div class="header">
    <div class="header-left">
        <div class="logo-wrap">
          <img src="/img/logo.svg" class="site-logo no-drag" alt="BrightKidz logo" />
        </div>
        <div v-if="navBackPath" @click="navBack" class="game-button">
        <em class="fas fa-reply"></em>
      </div>
      <div v-if="sound" @click="playGameExplanation" class="game-button">
        <em class="fas fa-question" style="font-size: 1.3rem"></em>
        <em style="font-size: 1.2rem" class="fas fa-headphones"></em>
      </div>
    </div>
    <div class="header-center">
      <div v-if="!isGuestMode" @click="showRewardPreview()" class="reward">
        <div>{{ rewards }}</div>
        <img
          class="no-drag"
          v-bind:class="[{ 'reward-final': isRewardFinalActive }]"
          v-bind:style="rewardFinal"
          :src="getRewardHeaderImage()"
          alt="reward"
        />
      </div>
      <div v-else class="guest-mode-notice">
        <span class="guest-text">{{ t('guestMode') }}</span>
      </div>
    </div>
    <div class="header-right">
      <template v-if="isGuestMode">
        <button @click="goToLogin" class="auth-button login-btn">
          {{ t('login') }}
        </button>
        <button @click="goToSignup" class="auth-button signup-btn">
          {{ t('signUp') }}
        </button>
      </template>
      <template v-else>
        <LevelDisplay @show-level-details="showLevelModal" />
        <StreakBadge @show-streak-details="showStreakModal" />
      </template>
      <slot></slot>
    </div>
    <!-- Language Switcher is now a floating button, rendered globally -->
    <img
      v-if="isRewardPreviewActive || isRewardShowActive"
      v-bind:class="[
        { 'reward-preview': isRewardPreviewActive },
        { 'reward-show': isRewardShowActive },
      ]"
      :src="getNextRewardImage()"
      class="no-drag"
      alt="reward-preview"
    />
  </div>
</template>

<script>
import { SoundUtils } from "./utils/SoundUtils";
import errorLogger from "@/utils/ErrorLogger";
import StreakBadge from "./StreakBadge.vue";
import LevelDisplay from "./LevelDisplay.vue";
import languageManager from "@/utils/LanguageManager";
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'https://brightkidz-production-43d4.up.railway.app/api';

export default {
  name: "Header",
  components: { StreakBadge, LevelDisplay },
  props: ["navBackPath", "sound", "currentLevel"],
  data() {
    return {
      rewards: 0,
      currentNewRewards: 0,
      isRewardPreviewActive: false,
      isRewardShowActive: false,
      isRewardFinalActive: false,
      rewardImages: ["star1", "star2", "star3", "star4", "star5"],
      isGuestMode: false,
    };
  },
  async mounted() {
    this.emitter.on("showRewardPreview", this.showRewardPreview);
    this.emitter.on("showReward", this.showReward);
    this.emitter.on("rewards-updated", this.updateRewards);
    
    // Check if in guest mode
    this.isGuestMode = localStorage.getItem('guestMode') === 'true';
    
    if (!this.isGuestMode) {
      await this.loadRewards();
      
      // Refresh rewards every 5 seconds
      this.rewardsInterval = setInterval(() => {
        this.loadRewards();
      }, 5000);
    }
  },
  beforeUnmount() {
    this.emitter.off("showRewardPreview");
    this.emitter.off("showReward");
    this.emitter.off("rewards-updated");
    if (this.rewardsInterval) {
      clearInterval(this.rewardsInterval);
    }
  },
  computed: {
    rewardFinal: function () {
      return {
        "animation-iteration-count": this.currentNewRewards,
      };
    },
  },
  methods: {
    t(key) {
      return languageManager.translate(key);
    },
    goToLogin() {
      localStorage.removeItem('guestMode');
      this.$router.push('/');
    },
    goToSignup() {
      localStorage.removeItem('guestMode');
      this.$router.push('/?register=true');
    },
    async loadRewards() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.rewards = 0;
        return;
      }

      try {
        console.log('Header: Loading rewards with token:', token.substring(0, 20) + '...');
        const response = await axios.get(
          `${API_URL}/levels/current`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000 // 5 second timeout
          }
        );
        console.log('Header: Rewards loaded successfully:', response.data.level);
        this.rewards = response.data.level.rewards || response.data.level.totalStarsEarned || 0;
      } catch (error) {
        console.error('Header: Load rewards error:', error.message);
        if (error.response) {
          console.error('Header: Error status:', error.response.status);
          console.error('Header: Error data:', error.response.data);
          
          // If token is invalid/expired, clear it
          if (error.response.status === 401 || error.response.status === 403) {
            console.warn('Header: Token invalid, clearing from localStorage');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            this.rewards = 0;
          }
        } else if (error.request) {
          console.error('Header: No response received. Is backend server running?');
        }
      }
    },
    updateRewards(newRewards) {
      // Update rewards from LevelDisplay after API call completes
      console.log('Header: Updating rewards from', this.rewards, 'to', newRewards);
      this.rewards = newRewards || 0;
    },
    showStreakModal() {
      // Emit event to show streak modal in App.vue
      this.emitter.emit('show-streak-modal');
    },
    showLevelModal() {
      // Emit event to show level details modal in App.vue
      this.emitter.emit('show-level-modal');
    },
    getDecimalPart: function (n) {
      n += "";
      return (n = parseInt(n.slice(n.length - 2, n.length - 1)) || 0);
    },
    getRewardHeaderImage: function () {
      let n = this.getDecimalPart(this.rewards);
      // n is a number between 0 and 9 now. so we need to ensure that it's bigger than our image array length
      n = n % this.rewardImages.length;
      return "/img/" + this.rewardImages[n] + ".svg";
    },
    getNextRewardImage: function () {
      let lastNumberOfCurrentRewards = this.rewards + "";
      lastNumberOfCurrentRewards =
        parseInt(
          lastNumberOfCurrentRewards.slice(
            lastNumberOfCurrentRewards.length - 1
          )
        ) || 0;

      let n = this.getDecimalPart(this.rewards);
      // only show the next reward animation if it can be reached on current success
      if (this.currentLevel + 1 + lastNumberOfCurrentRewards >= 10) {
        n++;
      }
      n = n % this.rewardImages.length;
      return "/img/" + this.rewardImages[n] + ".svg";
    },
    navBack: function () {
      try {
        this.$router.push(this.navBackPath);
        errorLogger.logInfo("Navigation back", { path: this.navBackPath });
      } catch (e) {
        errorLogger.logComponentError("Header", e, { action: "navBack" });
      }
    },
    playGameExplanation: function () {
      try {
        SoundUtils.playExplanation(this.sound);
      } catch (e) {
        errorLogger.logComponentError("Header", e, { action: "playGameExplanation" });
      }
    },
    showRewardPreview: function () {
      if (!this.isRewardPreviewActive) {
        this.isRewardPreviewActive = true;
        setTimeout(
          function () {
            this.isRewardPreviewActive = false;
          }.bind(this),
          2000
        );
      }
    },
    showReward: function (increaseRewardAmount) {
      increaseRewardAmount = parseInt(increaseRewardAmount) || 1;
      console.log('Header: showReward called with:', increaseRewardAmount);
      
      if (!this.isRewardShowActive) {
        // this is the first animation. within 4 seconds the big star will be shown and slowly merge to the header star
        // afterwards the header star will spin too
        this.isRewardShowActive = true;
        setTimeout(
          function () {
            this.isRewardShowActive = false;
          }.bind(this),
          4000
        );
        setTimeout(
          function () {
            // this is the second animation. the spinning star in the header
            // for every award we will let it spin 1 round in 1 second
            this.currentNewRewards = increaseRewardAmount;
            // Don't increment rewards here - wait for API response via rewards-updated event
            if (!this.isRewardFinalActive) {
              this.isRewardFinalActive = true;
              setTimeout(
                function () {
                  this.isRewardFinalActive = false;
                }.bind(this),
                increaseRewardAmount * 1000 + 1000
              );
            }
          }.bind(this),
          3500
        );
      }
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 35pt;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  // Mobile optimizations
  @media (max-width: 768px) {
    height: auto;
    min-height: 50pt;
    padding: 8px;
    border-radius: 12px;
    flex-wrap: nowrap;
    gap: 5px;
  }
  
  // Landscape mobile
  @media (max-width: 768px) and (orientation: landscape) {
    min-height: 44pt;
    padding: 6px;
  }
}

.logo-wrap { display:flex; align-items:center; gap:8px; margin-right:8px; }

.site-logo { height: 40px; }


.header-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: -3pt;
  width: 33.333%;
  gap: 3pt;
  
  @media (max-width: 768px) {
    width: auto;
    flex: 0 0 auto;
    gap: 5px;
    margin-right: 0;
  }
}

.header-left > div {
  margin-right: 3pt;
  
  @media (max-width: 768px) {
    margin-right: 0;
  }
}

.header-center {
  position: relative;
  width: 33.333%;
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 1pt;
  
  @media (max-width: 768px) {
    flex: 1;
    margin: 0;
  }
}

.header-right {
  width: 33.333%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    width: auto;
    flex: 0 0 auto;
    gap: 5px;
  }
}

.reward {
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
}

.reward > img {
  width: 35pt;
  height: 35pt;
  
  @media (max-width: 768px) {
    width: 30pt;
    height: 30pt;
  }
}

.reward-preview,
.reward-show {
  position: fixed;
  z-index: 999;
  left: 0;
  bottom: -90%;
  height: 100%;
  width: 100%;
  animation-name: reward-preview-animation;
  overflow: hidden;
  animation-duration: 2s;
  animation-direction: reverse;
}

.reward-show {
  animation-name: reward-show-animation;
  animation-duration: 4s;
  bottom: 0;
  animation-direction: normal;
}

@keyframes reward-preview-animation {
  0% {
    visibility: visible;
    transform: rotate(-45deg);
  }
  25% {
    transform: rotate(45deg);
  }
  37.5% {
    bottom: -40%;
  }
  50% {
    transform: rotate(-45deg);
  }
  75% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(-45deg);
    visibility: hidden;
    bottom: -90%;
  }
}

@keyframes reward-show-animation {
  0% {
    bottom: -100%;
    visibility: visible;
    transform: rotateZ(45deg);
  }
  37.5% {
    bottom: 0;
  }
  40% {
    transform: rotateZ(0deg) rotateY(720deg);
    width: 100%;
    height: 100%;
    left: 0;
  }
  60% {
    transform: rotateZ(0deg) rotateY(720deg);
    width: 100%;
    height: 100%;
    left: 0;
  }
  80% {
    width: 100%;
    height: 100%;
  }
  90% {
    left: -20%;
    bottom: 30%;
    transform: rotateZ(45deg) rotateY(1440deg);
  }
  100% {
    transform: rotateZ(45deg) rotateY(1800deg);
    width: 35pt;
    height: 35pt;
    left: calc(50% - 10pt);
    top: 0;
  }
}

.reward-final {
  animation-name: reward-final-animation;
  animation-duration: 1s;
  animation-iteration-count: 1;
}

@keyframes reward-final-animation {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

.guest-mode-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .guest-text {
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 600;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
}

.auth-button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}

.login-btn {
  background: transparent;
  color: #ffffff;
  border: 2px solid #ffffff;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.signup-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}
</style>

