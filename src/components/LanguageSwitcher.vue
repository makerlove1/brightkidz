<template>
  <div 
    class="language-switcher-chathead"
    :style="chatheadStyle"
    ref="chathead"
  >
    <!-- Chat Head Button -->
    <div 
      class="chathead-draggable"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <button 
        @click="toggleDropdown" 
        @mousedown.stop
        @touchstart.stop
        class="chathead-button"
        :class="{ active: isOpen, dragging: isDraggingChathead }"
        :title="languageManager.t('language')"
      >
        <span class="flag-icon">{{ currentFlag }}</span>
        <span class="language-code">{{ currentLanguage.toUpperCase() }}</span>
      </button>
    </div>
    
    <!-- Backdrop -->
    <transition name="backdrop">
      <div v-if="isOpen" class="chathead-backdrop" @click="toggleDropdown"></div>
    </transition>
    
    <!-- Dropdown Menu -->
    <transition name="dropdown">
      <div v-if="isOpen" class="language-dropdown" :style="dropdownStyle">
        <div class="dropdown-header">
          <em class="fas fa-globe"></em>
          <span>{{ languageManager.t('language') }}</span>
          <button class="close-dropdown" @click="toggleDropdown">
            <em class="fas fa-times"></em>
          </button>
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
      unsubscribe: null,
      isDraggingChathead: false,
      dragStartX: 0,
      dragStartY: 0,
      dragStartLeft: 0,
      dragStartTop: 0,
      chatheadX: 0,
      chatheadY: 0
    };
  },
  computed: {
    currentFlag() {
      const lang = this.languages.find(l => l.code === this.currentLanguage);
      return lang ? lang.flag : '🌐';
    },
    chatheadStyle() {
      return {
        left: `${this.chatheadX}px`,
        top: `${this.chatheadY}px`,
        position: 'fixed',
        zIndex: 10000,
        cursor: this.isDraggingChathead ? 'grabbing' : 'grab'
      };
    },
    dropdownStyle() {
      if (!this.isOpen) return {};
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dropdownWidth = 300;
      const dropdownHeight = 400;
      
      // Position dropdown in the center of the screen
      let left = (viewportWidth - dropdownWidth) / 2;
      let top = (viewportHeight - dropdownHeight) / 2;
      
      // Ensure it stays within viewport bounds
      left = Math.max(20, Math.min(left, viewportWidth - dropdownWidth - 20));
      top = Math.max(20, Math.min(top, viewportHeight - dropdownHeight - 20));
      
      return {
        left: `${left}px`,
        top: `${top}px`,
        position: 'fixed',
        zIndex: 10001,
        width: `${dropdownWidth}px`,
        height: `${dropdownHeight}px`
      };
    }
  },
  mounted() {
    // Subscribe to language changes
    this.unsubscribe = languageManager.subscribe((newLang) => {
      this.currentLanguage = newLang;
      this.languages = languageManager.getAvailableLanguages();
    });
    
    // Load saved position or use default
    const savedPos = localStorage.getItem('chatheadPosition');
    if (savedPos) {
      const { x, y } = JSON.parse(savedPos);
      this.chatheadX = x;
      this.chatheadY = y;
    } else {
      // Default position (bottom right)
      this.chatheadX = window.innerWidth - 100;
      this.chatheadY = window.innerHeight - 100;
    }
    
    // Ensure drag functionality is properly initialized after DOM is ready
    this.$nextTick(() => {
      const draggableElement = this.$el.querySelector('.chathead-draggable');
      if (draggableElement) {
        // Ensure the element is properly set up for dragging
        draggableElement.style.cursor = 'grab';
        draggableElement.style.userSelect = 'none';
        draggableElement.style.touchAction = 'none';
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);
    this.removeDragEventListeners();
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
        this.$emit('languageChanged', code);
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
    },
    
    startDrag(e) {
      e.preventDefault();
      e.stopPropagation();
      
      this.isDraggingChathead = true;
      this.dragStartX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      this.dragStartY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      this.dragStartLeft = this.chatheadX;
      this.dragStartTop = this.chatheadY;
      
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('touchmove', this.onDrag, { passive: false });
      document.addEventListener('mouseup', this.stopDrag);
      document.addEventListener('touchend', this.stopDrag);
      document.addEventListener('touchcancel', this.stopDrag);
      
      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
    },
    
    onDrag(e) {
      if (!this.isDraggingChathead) return;
      
      e.preventDefault();
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      
      const deltaX = clientX - this.dragStartX;
      const deltaY = clientY - this.dragStartY;
      
      this.chatheadX = Math.max(0, Math.min(window.innerWidth - 60, this.dragStartLeft + deltaX));
      this.chatheadY = Math.max(0, Math.min(window.innerHeight - 60, this.dragStartTop + deltaY));
    },
    
    stopDrag() {
      this.isDraggingChathead = false;
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('touchmove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDrag);
      document.removeEventListener('touchend', this.stopDrag);
      document.removeEventListener('touchcancel', this.stopDrag);
      document.body.style.userSelect = '';
      
      // Save position to localStorage
      localStorage.setItem('chatheadPosition', JSON.stringify({
        x: this.chatheadX,
        y: this.chatheadY
      }));
    },
    
    handleResize() {
      // Keep chathead within bounds on resize
      this.chatheadX = Math.min(this.chatheadX, window.innerWidth - 60);
      this.chatheadY = Math.min(this.chatheadY, window.innerHeight - 60);
    },
    
    removeDragEventListeners() {
      const chathead = this.$refs.chathead;
      if (chathead) {
        chathead.removeEventListener('mousedown', this.startDrag);
        chathead.removeEventListener('touchstart', this.startDrag);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.language-switcher-chathead {
  position: fixed;
  z-index: 10000;
  user-select: none;
  touch-action: none;
}

.chathead-draggable {
  cursor: grab;
  user-select: none;
  touch-action: none;
  display: inline-block;
  
  &:active {
    cursor: grabbing;
  }
}

.chathead-button {
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
              0 4px 12px rgba(0, 0, 0, 0.3),
              0 0 0 2px rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  // Chat head shadow effect
  &::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    z-index: 1;
  }
  
  .flag-icon {
    font-size: 2rem;
    line-height: 1;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
  
  .language-code {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1px;
    position: relative;
    z-index: 2;
    opacity: 0.95;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5), 
                0 6px 16px rgba(0, 0, 0, 0.4),
                0 0 0 3px rgba(255, 255, 255, 0.2);
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
  
  &.dragging {
    opacity: 0.8;
    transform: scale(0.9);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
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
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 40, 0.98) 100%);
  border: 2px solid rgba(102, 126, 234, 0.4);
  border-radius: 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5),
              0 8px 24px rgba(102, 126, 234, 0.3);
  overflow: hidden;
  z-index: 9999;
  width: 300px;
  height: 400px;
  resize: none;
  backdrop-filter: blur(20px);
  
  @media (max-width: 768px) {
    width: 280px;
    height: 380px;
  }
  
  @media (max-width: 480px) {
    width: 260px;
    height: 360px;
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
}
</style>
