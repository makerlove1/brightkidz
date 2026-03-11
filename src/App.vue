<template>
  <div class="content-window">
    <router-view></router-view>
    <ErrorDisplay />
    <LanguageSwitcher v-if="!isAdminPage" />
    <DailyLoginStreak ref="streakComponent" />
  </div>
</template>

<script>
import errorLogger from "@/utils/ErrorLogger";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import DailyLoginStreak from "@/components/DailyLoginStreak.vue";

export default {
  name: "App",
  components: { ErrorDisplay, LanguageSwitcher, DailyLoginStreak },
  computed: {
    isAdminPage() {
      return this.$route.path.startsWith('/admin');
    }
  },
  mounted() {
    errorLogger.logInfo("App mounted successfully");
    this.detectMobileDevice();
    this.setupViewportHandler();
    
    // Listen for streak modal event
    this.emitter.on('show-streak-modal', this.showStreakModal);
  },
  methods: {
    showStreakModal() {
      if (this.$refs.streakComponent) {
        this.$refs.streakComponent.showStreakModal();
      }
    },
    detectMobileDevice() {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
      
      if (isMobile) {
        document.body.classList.add('mobile-device');
        errorLogger.logInfo('Mobile device detected', { 
          userAgent: navigator.userAgent,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight
        });
      }
      
      if (isTablet) {
        document.body.classList.add('tablet-device');
      }
    },
    setupViewportHandler() {
      // Handle viewport changes (orientation, resize)
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('orientationchange', this.handleOrientationChange);
    },
    handleResize() {
      errorLogger.debug('Window resized', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    },
    handleOrientationChange() {
      errorLogger.logInfo('Orientation changed', {
        orientation: window.orientation || screen.orientation?.angle
      });
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    this.emitter.off('show-streak-modal');
  },
  errorCaptured(err, vm, info) {
    errorLogger.logComponentError(vm.$options.name || 'Unknown', err, { info });
    return false; // Propagate error
  }
};
</script>

<style lang="scss">
$generalPaddingRight: 10pt;
$generalPaddingLeft: 10pt;
$mobilePadding: 8pt;
$tabletPadding: 12pt;

.content-window {
  height: 100%;
  max-height: 100%;
  padding-right: $generalPaddingRight;
  padding-left: $generalPaddingLeft;
  width: calc(100% - #{$generalPaddingLeft} - #{$generalPaddingRight});
  max-width: calc(100% - #{$generalPaddingLeft} - #{$generalPaddingRight});
  top: 0;
  left: 0;
  position: absolute;
  margin: 0;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  overflow-x: hidden;
  
  // Mobile optimizations
  @media (max-width: 768px) {
    padding-right: $mobilePadding;
    padding-left: $mobilePadding;
    width: calc(100% - #{$mobilePadding} - #{$mobilePadding});
    max-width: calc(100% - #{$mobilePadding} - #{$mobilePadding});
  }
  
  // Tablet optimizations
  @media (min-width: 769px) and (max-width: 1024px) {
    padding-right: $tabletPadding;
    padding-left: $tabletPadding;
    width: calc(100% - #{$tabletPadding} - #{$tabletPadding});
    max-width: calc(100% - #{$tabletPadding} - #{$tabletPadding});
  }
}

.content {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
}

.clickable-elements,
.game-button {
  color: #ffffff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12pt;
  touch-action: manipulation;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.clickable-elements:hover,
.game-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.game-button {
  height: 30pt;
  width: 40pt;
  font-size: 1.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: manipulation;
  min-width: 40pt;
  min-height: 30pt;
  
  // Mobile optimizations - larger touch targets
  @media (max-width: 768px) {
    height: 44pt; // iOS recommended minimum touch target
    width: 44pt;
    font-size: 1.5rem;
    min-width: 44pt;
    min-height: 44pt;
  }
  
  // Active state for better mobile feedback
  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

.game-button > a {
  color: inherit;
  text-decoration: none;
  touch-action: manipulation;
}

/* base layouts handled in global.scss; keep local rules minimal */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.no-drag {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}

// Mobile-specific improvements
@media (max-width: 768px) {
  // Prevent text selection on mobile
  * {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    user-select: none;
  }
  
  // Allow text selection in input fields
  input, textarea {
    user-select: text;
    -webkit-user-select: text;
  }
  
  // Improve scrolling on iOS
  body {
    -webkit-overflow-scrolling: touch;
  }
  
  // Better font rendering on mobile
  body, html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

// Tablet-specific improvements
@media (min-width: 769px) and (max-width: 1024px) {
  .game-button {
    height: 36pt;
    width: 42pt;
    font-size: 1.6rem;
  }
}

// Landscape mobile optimizations
@media (max-width: 768px) and (orientation: landscape) {
  .content-window {
    padding-top: 5pt;
    padding-bottom: 5pt;
  }
  
  .game-button {
    height: 38pt;
    width: 42pt;
  }
}

// High DPI screens
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .game-button, .clickable-elements {
    border: 0.5px solid rgba(255, 255, 255, 0.1);
  }
}

// Dark mode support (if device prefers dark mode)
@media (prefers-color-scheme: dark) {
  .content-window {
    background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  }
}

// Reduced motion for accessibility
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
