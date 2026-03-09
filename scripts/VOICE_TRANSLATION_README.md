# AI Voice Translation Generator

This script generates AI-powered voice translations for English and Filipino (Tagalog) based on the German sound files in the `de` folder.

## Two Options Available

You can use either **Python** or **Node.js** - choose whichever you prefer!

---

## Option 1: Python (Recommended)

### Prerequisites
1. **Python 3.7+** installed on your system
2. **pip** (Python package manager)

### Installation
1. Navigate to the scripts directory:
```bash
cd edukiz/scripts
```

2. Install required Python packages:
```bash
pip install -r requirements_voice.txt
```

### Usage

**Windows:**
```bash
generate_voices.bat
```

**Mac/Linux:**
```bash
python generate_voice_translations.py
```

---

## Option 2: Node.js

### Prerequisites
1. **Node.js 14+** installed on your system
2. **npm** (comes with Node.js)

### Installation
Navigate to the scripts directory and install the package:
```bash
cd edukiz/scripts
npm install gtts-node
```

### Usage
```bash
node generate_voice_translations.js
```

## What It Does

The script will:
- Read the translation mappings from German to English and Filipino
- Generate MP3 audio files using Google Text-to-Speech (gTTS)
- Place files in the correct folders:
  - `public/sounds/english/explanation/` - English explanation files
  - `public/sounds/english/helpers/` - English helper files
  - `public/sounds/filipino/explanation/` - Filipino explanation files
  - `public/sounds/filipino/helpers/` - Filipino helper files

## Translations Included

### Explanations
- `calculation0To18.mp3` - Calculation instructions
- `dragdrop_buildwords.mp3` - Drag and drop word building
- `dragdrop_characters.mp3` - Drag and drop characters
- `memory.mp3` - Memory game
- `t2s.mp3` - Text to speech

### Helpers
- `aber_wir_brauchen_ein.mp3` - "But we need a"
- `das_ist_eine.mp3` - "This is a"
- `du_hast_ein.mp3` - "You have a"
- `next_level.mp3` - "Next level"
- `nicht_ganz_richtig.mp3` - "Not quite right"
- `super_und_jetzt_ein.mp3` - "Great! And now a"
- `und_eine.mp3` - "And a"
- `wir_schreiben_das_wort.mp3` - "We write the word"

## Adding More Translations

To add more translations, edit the `TRANSLATIONS` dictionary in `generate_voice_translations.py`:

```python
TRANSLATIONS = {
    'your_filename': {
        'en': 'English text',
        'tl': 'Filipino text',
        'category': 'helpers'  # or 'explanation'
    }
}
```

## Troubleshooting

### Error: "No module named 'gtts'"
Run: `pip install -r requirements_voice.txt`

### Error: "Connection error"
Make sure you have an active internet connection. gTTS requires internet to generate audio.

### Audio quality issues
The gTTS library uses Google's text-to-speech API which provides good quality. For professional-grade audio, consider using:
- Google Cloud Text-to-Speech API
- Amazon Polly
- Microsoft Azure Speech Services

## Notes

- Generated files are in MP3 format
- Language codes: `en` for English, `tl` for Filipino/Tagalog
- The script will overwrite existing files with the same name
