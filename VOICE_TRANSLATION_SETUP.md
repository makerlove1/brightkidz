# 🎙️ Voice Translation Setup - Quick Start

AI-generated voice translations for English and Filipino have been set up for your Edukiz app!

## 📁 What Was Created

1. **Python Script** - `scripts/generate_voice_translations.py`
2. **Node.js Script** - `scripts/generate_voice_translations.js` (alternative)
3. **Windows Batch File** - `scripts/generate_voices.bat` (easy Windows execution)
4. **Requirements File** - `scripts/requirements_voice.txt`
5. **Documentation** - `scripts/VOICE_TRANSLATION_README.md`
6. **Translation Reference** - `scripts/TRANSLATIONS_REFERENCE.md`

## 🚀 Quick Start (Choose One)

### Windows Users (Easiest):
```bash
cd edukiz/scripts
generate_voices.bat
```

### Python Users:
```bash
cd edukiz/scripts
pip install -r requirements_voice.txt
python generate_voice_translations.py
```

### Node.js Users:
```bash
cd edukiz/scripts
npm install gtts-node
node generate_voice_translations.js
```

## 📊 What Gets Generated

The script will create **26 audio files** (13 English + 13 Filipino):

### English Files → `public/sounds/english/`
- 5 explanation files
- 8 helper files

### Filipino Files → `public/sounds/filipino/`
- 5 explanation files
- 8 helper files

## 📝 Translations Included

All German sound files from the `de` folder are translated:

**Explanations:**
- Calculation instructions
- Drag and drop guides
- Memory game
- Text to speech

**Helpers:**
- "But we need a" / "Ngunit kailangan natin ng"
- "This is a" / "Ito ay isang"
- "You have a" / "Mayroon kang"
- "Next level" / "Susunod na antas"
- "Not quite right" / "Hindi tama"
- "Great! And now a" / "Magaling! At ngayon ang"
- And more...

## 🔧 Requirements

- Internet connection (for Google Text-to-Speech API)
- Python 3.7+ OR Node.js 14+
- About 2-3 minutes to generate all files

## 📖 More Information

See `scripts/VOICE_TRANSLATION_README.md` for detailed documentation and troubleshooting.

## ✨ Next Steps

After generating the files, your app will automatically use the English and Filipino voice files based on the selected language!
