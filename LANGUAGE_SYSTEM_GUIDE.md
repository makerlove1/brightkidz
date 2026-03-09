# 🌍 Language System Guide

Complete bilingual/multilingual support for Edukiz app with synchronized UI and voice changes.

## 🎯 Features

- **3 Languages Supported**: English, Filipino (Tagalog), German
- **Automatic Voice Switching**: Changes sound files based on selected language
- **Persistent Settings**: Language preference saved in localStorage
- **Real-time Updates**: All components update instantly when language changes
- **Easy Integration**: Simple mixin for adding translations to any component

## 📁 Files Created

### Core System
- `src/utils/LanguageManager.js` - Main language management system
- `src/components/LanguageSwitcher.vue` - Language selector UI component
- `src/mixins/translationMixin.js` - Vue mixin for easy translation access

### Updated Files
- `src/components/utils/SoundUtils.js` - Updated to support multi-language audio
- `src/components/Header.vue` - Added language switcher
- `src/components/Home.vue` - Example of using translations

## 🚀 How to Use

### 1. Language Switcher (Already Added)

The language switcher is automatically added to the header on all pages. Users can click the flag icon to change languages.

### 2. Adding Translations to Components

#### Method A: Using the Mixin (Recommended)

```vue
<template>
  <div>
    <h1>{{ t('memory') }}</h1>
    <p>{{ t('memoryAlt') }}</p>
  </div>
</template>

<script>
import translationMixin from "@/mixins/translationMixin";

export default {
  name: "MyComponent",
  mixins: [translationMixin],
  // Now you have access to t() method
};
</script>
```

#### Method B: Direct Import

```vue
<template>
  <div>
    <h1>{{ languageManager.t('memory') }}</h1>
  </div>
</template>

<script>
import languageManager from "@/utils/LanguageManager";

export default {
  name: "MyComponent",
  data() {
    return {
      languageManager: languageManager
    };
  }
};
</script>
```

### 3. Adding New Translations

Edit `src/utils/LanguageManager.js`:

```javascript
this.translations = {
  en: {
    myNewKey: "My English Text",
    anotherKey: "Another Text"
  },
  tl: {
    myNewKey: "Aking Bagong Teksto",
    anotherKey: "Isa Pang Teksto"
  },
  de: {
    myNewKey: "Mein Neuer Text",
    anotherKey: "Ein Weiterer Text"
  }
};
```

### 4. Programmatic Language Change

```javascript
import languageManager from "@/utils/LanguageManager";

// Change language
languageManager.setLanguage('tl'); // Filipino
languageManager.setLanguage('en'); // English
languageManager.setLanguage('de'); // German

// Get current language
const currentLang = languageManager.getLanguage();

// Subscribe to language changes
const unsubscribe = languageManager.subscribe((newLang) => {
  console.log('Language changed to:', newLang);
});

// Unsubscribe when done
unsubscribe();
```

## 🔊 Audio System Integration

The sound system automatically switches audio files based on language:

### Folder Structure
```
public/sounds/
├── english/
│   ├── letters-numbers/  (a-z, 0-20)
│   ├── explanation/
│   ├── helpers/
│   └── words/
├── filipino/
│   ├── letters-numbers/  (a-z, 0-20)
│   ├── explanation/
│   ├── helpers/
│   └── words/
└── de/
    ├── characters/
    │   ├── boy0/
    │   └── girl0/
    ├── explanations/
    ├── helpers/
    └── words/
```

### How It Works

When you play a sound:
```javascript
import { SoundLib } from "@/components/utils/SoundUtils";

// This will automatically play from the correct language folder
SoundLib.cat.play(); // Plays "cat" in current language
SoundLib.a.play();   // Plays letter "a" in current language
```

**Language Mapping:**
- English (`en`) → `sounds/english/`
- Filipino (`tl`) → `sounds/filipino/`
- German (`de`) → `sounds/de/`

## 🎨 UI Components

### Language Switcher

The language switcher shows:
- Current language flag (🇺🇸 🇵🇭 🇩🇪)
- Dropdown with all available languages
- Active language highlighted
- Smooth animations

**Mobile Optimized:**
- Larger touch targets (44pt minimum)
- Responsive dropdown positioning
- Touch-friendly interactions

## 📝 Available Translations

### Current Keys

| Key | English | Filipino | German |
|-----|---------|----------|--------|
| `memory` | Memory | Memorya | Memory |
| `dragdrop` | Drag & Drop | Gumalaw | Ziehen & Ablegen |
| `misc` | More Games | Iba Pa | Mehr Spiele |
| `back` | Back | Bumalik | Zurück |
| `help` | Help | Tulong | Hilfe |
| `settings` | Settings | Mga Setting | Einstellungen |
| `language` | Language | Wika | Sprache |
| `voice` | Voice | Tinig | Stimme |
| `boyVoice` | Boy Voice | Tinig ng Lalaki | Jungenstimme |
| `girlVoice` | Girl Voice | Tinig ng Babae | Mädchenstimme |
| `english` | English | Ingles | Englisch |
| `filipino` | Filipino | Filipino | Filipino |
| `german` | German | Aleman | Deutsch |

## 🔧 Technical Details

### Language Manager API

```javascript
// Get/Set Language
languageManager.getLanguage()        // Returns: 'en', 'tl', or 'de'
languageManager.setLanguage('tl')    // Set language

// Translations
languageManager.translate('memory')  // Get translation
languageManager.t('memory')          // Shorthand

// Sound Path
languageManager.getSoundPath()       // Returns: 'english', 'filipino', or 'de'

// Available Languages
languageManager.getAvailableLanguages()
// Returns: [
//   { code: 'en', name: 'English', flag: '🇺🇸' },
//   { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
//   { code: 'de', name: 'German', flag: '🇩🇪' }
// ]

// Subscribe to Changes
const unsubscribe = languageManager.subscribe((newLang) => {
  console.log('Language changed:', newLang);
});
```

### Storage

Language preference is stored in `localStorage`:
```javascript
localStorage.getItem('appLanguage') // 'en', 'tl', or 'de'
```

## 🎯 Best Practices

1. **Always use translation keys** instead of hardcoded text
2. **Add translations for all 3 languages** when adding new keys
3. **Use the mixin** for components that need translations
4. **Test language switching** to ensure all text updates
5. **Keep translation keys descriptive** (e.g., `memoryGameTitle` not `title1`)

## 🐛 Troubleshooting

### Translations not updating?
- Make sure component uses the mixin or subscribes to language changes
- Check if translation key exists in LanguageManager
- Try `this.$forceUpdate()` if needed

### Audio not switching?
- Verify audio files exist in correct language folder
- Check browser console for audio loading errors
- Ensure SoundUtils is using `getLanguagePath()`

### Language not persisting?
- Check localStorage is enabled
- Verify no errors in browser console
- Clear cache and try again

## 📱 Mobile Considerations

- Language switcher has 44pt touch targets (iOS standard)
- Dropdown positioned to avoid screen edges
- Smooth animations with reduced motion support
- Works in both portrait and landscape

## ✨ Future Enhancements

Possible additions:
- More languages (Spanish, Chinese, etc.)
- Text-to-speech for UI elements
- Language auto-detection based on device
- Translation management UI
- Export/import translation files

---

**Ready to use!** The language system is fully integrated and working across all pages. Users can switch languages anytime, and both UI text and voice audio will update automatically! 🎉
