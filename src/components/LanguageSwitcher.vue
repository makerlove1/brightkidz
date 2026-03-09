<template>
  <div class="language-switcher-fab">
    <!-- Floating Action Button -->
    <button 
      @click="toggleDropdown" 
      class="fab-button"
      :class="{ active: isOpen }"
      :title="languageManager.t('language')"
    >
      <span class="flag-icon">{{ currentFlag }}</span>
      <span class="language-code">{{ currentLanguage.toUpperCase() }}</span>
    </button>
    
    <!-- Backdrop -->
    <transition name="backdrop">
      <div v-if="isOpen" class="fab-backdrop" @click="toggleDropdown"></div>
    </transition>
    
    <!-- Dropdown Menu -->
    <transition name="dropdown">
      <div v-if="isOpen" class="language-dropdown">
        <div class="dropdown-header">
          <em class="fas fa-globe"></em>
          <span>{{ languageManager.t('language') }}</span>
        </div>
        <div class="language-options">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="selectLanguage(lang.code)"
            class="language-option"
            :class="{ active: currentLanguage === lang.code }"
          >
            <span class="flag">{{ lang.flag }}</span>
            <div class="lang-info">
              <span class="name">{{ lang.name }}</span>
              <span class="code">{{ lang.code.toUpperCase() }}</span>
            </div>
            <span v-if="currentLanguage === lang.code" class="check">✓</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import languageManager from "@/utils/LanguageManager";
import errorLogger from "@/utils/ErrorLogger";

export default {
  name: "LanguageSwitcher",
  data() {
    return {
      languageManager: languageManager,
      isOpen: false,
      currentLanguage: languageManager.currentLanguage || 'en',
      languages: languageManager.getAvailableLanguages(),
      unsubscribe: null
    };
  },
  computed: {
    currentFlag() {
      const lang = this.languages.find(l => l.code === this.currentLanguage);
      return lang ? lang.flag : '🌐';
    }
  },
  mounted() {
    // Subscribe to language changes
    this.unsubscribe = languageManager.subscribe((newLang) => {
      this.currentLanguage = newLang;
      this.languages = languageManager.getAvailableLanguages();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectLanguage(code) {
      try {
        languageManager.setLanguage(code);
        this.currentLanguage = code;
        this.isOpen = false;
        
        // Emit event for parent components
        this.emitter.emit('languageChanged', code);
        
        errorLogger.logInfo('Language switched', { language: code });
      } catch (e) {
        errorLogger.logError('Language switch failed', e);
      }
    },
    handleClickOutside(event) {
      const switcher = this.$el;
      if (switcher && !switcher.contains(event.target)) {
        this.isOpen = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.language-switcher-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
  }
}

.fab-button {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4), 
              0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  // Ripple effect background
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  .flag-icon {
    font-size: 2rem;
    line-height: 1;
    position: relative;
    z-index: 1;
  }
  
  .language-code {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1px;
    position: relative;
    z-index: 1;
    opacity: 0.95;
  }
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5), 
                0 6px 16px rgba(0, 0, 0, 0.4);
    
    &::before {
      width: 100%;
      height: 100%;
    }
  }
  
  &:active {
    transform: scale(0.95);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3), 
                0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  &.active {
    transform: scale(1.05);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.3),
                0 12px 32px rgba(102, 126, 234, 0.5);
    animation: pulse 2s infinite;
  }
  
  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    
    .flag-icon {
      font-size: 1.8rem;
    }
    
    .language-code {
      font-size: 0.65rem;
    }
  }
}

// Pulse animation for active state
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.3),
                0 12px 32px rgba(102, 126, 234, 0.5);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(102, 126, 234, 0.2),
                0 12px 32px rgba(102, 126, 234, 0.6);
  }
}

// Backdrop overlay
.fab-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  backdrop-filter: blur(4px);
}

.language-dropdown {
  position: fixed;
  bottom: 110px;
  right: 24px;
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 40, 0.98) 100%);
  border: 2px solid rgba(102, 126, 234, 0.4);
  border-radius: 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5),
              0 8px 24px rgba(102, 126, 234, 0.3);
  overflow: hidden;
  z-index: 9999;
  min-width: 240px;
  max-width: 280px;
  backdrop-filter: blur(20px);
  
  @media (max-width: 768px) {
    bottom: 100px;
    right: 20px;
    min-width: 220px;
    max-width: calc(100vw - 40px);
  }
  
  @media (max-width: 480px) {
    right: 50%;
    transform: translateX(50%);
    min-width: 260px;
  }
}

.dropdown-header {
  padding: 12px 16px;
  background: rgba(102, 126, 234, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  
  em {
    font-size: 1.1rem;
    opacity: 0.9;
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.9rem;
  }
}

.language-options {
  padding: 8px 0;
}

.language-option {
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.2s ease;
  font-size: 1rem;
  position: relative;
  
  .flag {
    font-size: 1.6rem;
    line-height: 1;
    flex-shrink: 0;
  }
  
  .lang-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    
    .name {
      font-size: 0.95rem;
      font-weight: 500;
      line-height: 1.2;
    }
    
    .code {
      font-size: 0.75rem;
      opacity: 0.6;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
  
  .check {
    font-size: 1.2rem;
    color: #4ade80;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    padding-left: 20px;
  }
  
  &.active {
    background: rgba(102, 126, 234, 0.3);
    border-left: 3px solid #667eea;
    
    .lang-info .name {
      font-weight: 600;
    }
    
    .lang-info .code {
      opacity: 0.8;
    }
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  @media (max-width: 768px) {
    padding: 16px 14px;
    font-size: 0.95rem;
    gap: 12px;
    
    .flag {
      font-size: 1.5rem;
    }
    
    .lang-info .name {
      font-size: 0.9rem;
    }
    
    .lang-info .code {
      font-size: 0.7rem;
    }
    
    &:hover {
      padding-left: 18px;
    }
  }
}

// Backdrop animation
.backdrop-enter-active,
.backdrop-leave-active {
  transition: all 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

// Dropdown animation
.dropdown-enter-active {
  animation: dropdown-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-leave-active {
  animation: dropdown-out 0.3s ease-in;
}

@keyframes dropdown-in {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdown-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
}

// Mobile specific adjustments
@media (max-width: 480px) {
  @keyframes dropdown-in {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(20px) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
  }
  
  @keyframes dropdown-out {
    0% {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(20px) scale(0.8);
    }
  }
}
</style>
