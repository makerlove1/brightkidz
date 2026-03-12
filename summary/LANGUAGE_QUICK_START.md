# 🚀 Language System - Quick Start

## For Users

### How to Change Language

1. **Look at the top-right corner** of any page
2. **Click the flag icon** (🇺🇸 🇵🇭 or 🇩🇪)
3. **Select your language** from the dropdown
4. **Done!** Everything updates instantly

### What Changes?

✅ **All text** on the screen  
✅ **All voice audio** (letters, numbers, words)  
✅ **Game instructions**  
✅ **Helper messages**  

### Available Languages

| Flag | Language | Audio Files |
|------|----------|-------------|
| 🇺🇸 | English | 174 files |
| 🇵🇭 | Filipino (Tagalog) | 174 files |
| 🇩🇪 | German (Deutsch) | Full set |

---

## For Developers

### Add Translations to Your Component

```vue
<template>
  <div>
    <h1>{{ t('memory') }}</h1>
  </div>
</template>

<script>
import translationMixin from "@/mixins/translationMixin";

export default {
  mixins: [translationMixin]
};
</script>
```

### Add New Translation Keys

Edit `src/utils/LanguageManager.js`:

```javascript
this.translations = {
  en: {
    myKey: "My English Text"
  },
  tl: {
    myKey: "Aking Teksto"
  },
  de: {
    myKey: "Mein Text"
  }
};
```

### Play Audio (Auto-switches language)

```javascript
import { SoundLib } from "@/components/utils/SoundUtils";

SoundLib.cat.play();  // Plays "cat" in current language
SoundLib.a.play();    // Plays letter "a" in current language
```

---

## File Locations

```
edukiz/
├── src/
│   ├── utils/
│   │   └── LanguageManager.js       ← Main system
│   ├── components/
│   │   ├── LanguageSwitcher.vue     ← UI component
│   │   ├── Header.vue               ← Updated
│   │   └── Home.vue                 ← Example
│   └── mixins/
│       └── translationMixin.js      ← Helper mixin
└── public/
    └── sounds/
        ├── english/                  ← 174 files
        ├── filipino/                 ← 174 files
        └── de/                       ← German files
```

---

## Quick Reference

### Translation Method
```javascript
t('key')  // Returns translated text
```

### Change Language
```javascript
languageManager.setLanguage('tl')  // Filipino
languageManager.setLanguage('en')  // English
languageManager.setLanguage('de')  // German
```

### Get Current Language
```javascript
languageManager.getLanguage()  // Returns: 'en', 'tl', or 'de'
```

---

## That's It! 🎉

The system is ready to use. Just add the mixin to your components and use `t('key')` for translations!

For more details, see `LANGUAGE_SYSTEM_GUIDE.md`
