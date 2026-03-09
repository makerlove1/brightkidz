/**
 * Translation Mixin
 * Provides translation methods to all components
 */

import languageManager from "@/utils/LanguageManager";

export const translationMixin = {
  data() {
    return {
      currentLanguage: languageManager.getLanguage(),
      languageUnsubscribe: null
    };
  },
  
  mounted() {
    // Subscribe to language changes
    this.languageUnsubscribe = languageManager.subscribe(() => {
      this.currentLanguage = languageManager.getLanguage();
      this.$forceUpdate(); // Force re-render when language changes
    });
  },
  
  beforeUnmount() {
    if (this.languageUnsubscribe) {
      this.languageUnsubscribe();
    }
  },
  
  methods: {
    /**
     * Translate a key
     * @param {string} key - Translation key
     * @returns {string} Translated text
     */
    t(key) {
      return languageManager.translate(key);
    },
    
    /**
     * Get current language code
     * @returns {string} Language code (en, tl, de)
     */
    getCurrentLanguage() {
      return languageManager.getLanguage();
    },
    
    /**
     * Set language
     * @param {string} lang - Language code
     */
    setLanguage(lang) {
      languageManager.setLanguage(lang);
    }
  }
};

export default translationMixin;
