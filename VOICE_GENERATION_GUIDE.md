# 🎙️ Complete Voice Translation Guide

Kumpletuhin ang lahat ng AI voice translations para sa English at Filipino!

## 📋 Ano ang Gagawin

Ang script ay mag-generate ng:

### 1. **Letters & Numbers** (letters-numbers folder)
- A-Z letters (26 files × 2 languages = 52 files)
- Numbers 0-20 (21 files × 2 languages = 42 files)
- **Total: 94 files**

### 2. **Explanations** (explanation folder)
- Game instructions
- Drag and drop guides
- Memory game
- Text to speech
- **Total: 10 files** (5 × 2 languages)

### 3. **Helpers** (helpers folder)
- "But we need a" / "Ngunit kailangan natin ng"
- "This is a" / "Ito ay isang"
- "Next level" / "Susunod na antas"
- At iba pa...
- **Total: 16 files** (8 × 2 languages)

### 4. **Words** (words folder)
- Lahat ng words mula sa boy0, dad, girl0 folders
- Animals, colors, objects, names
- **Total: 200+ files** (100+ × 2 languages)

## 🚀 Paano Gamitin

### Para sa Windows (Pinakamadali):

1. Buksan ang Command Prompt o PowerShell
2. Pumunta sa scripts folder:
```cmd
cd C:\Users\Michael\OneDrive\Desktop\copm\edukiz\scripts
```

3. I-run ang batch file:
```cmd
generate_all_voices.bat
```

### Para sa Python:

1. Install ang requirements:
```cmd
pip install gtts
```

2. Run ang script:
```cmd
python generate_all_voices.py
```

## ⏱️ Gaano Katagal?

- Mga **5-10 minutes** para sa lahat ng files
- Kailangan ng internet connection (Google Text-to-Speech)
- Total files: **320+ MP3 files**

## 📁 Folder Structure After Generation

```
public/sounds/
├── english/
│   ├── letters-numbers/
│   │   ├── a.mp3, b.mp3, ..., z.mp3
│   │   └── 0.mp3, 1.mp3, ..., 20.mp3
│   ├── explanation/
│   │   ├── calculation0To18.mp3
│   │   ├── dragdrop_buildwords.mp3
│   │   └── ...
│   ├── helpers/
│   │   ├── aber_wir_brauchen_ein.mp3
│   │   ├── das_ist_eine.mp3
│   │   └── ...
│   └── words/
│       ├── ambulance.mp3
│       ├── bird.mp3
│       ├── cat.mp3
│       └── ... (100+ files)
│
└── filipino/
    ├── letters-numbers/
    │   ├── a.mp3, b.mp3, ..., z.mp3
    │   └── 0.mp3, 1.mp3, ..., 20.mp3
    ├── explanation/
    │   ├── calculation0To18.mp3
    │   ├── dragdrop_buildwords.mp3
    │   └── ...
    ├── helpers/
    │   ├── aber_wir_brauchen_ein.mp3
    │   ├── das_ist_eine.mp3
    │   └── ...
    └── words/
        ├── ambulance.mp3 (ambulansya)
        ├── bird.mp3 (ibon)
        ├── cat.mp3 (pusa)
        └── ... (100+ files)
```

## 🔤 Sample Translations

### Numbers
- 0 = zero / sero
- 1 = one / isa
- 2 = two / dalawa
- 10 = ten / sampu
- 20 = twenty / dalawampu

### Animals
- cat = pusa
- dog = aso
- bird = ibon
- fish = isda
- elephant = elepante

### Colors
- red = pula
- blue = asul
- green = berde
- yellow = dilaw
- black = itim

### Common Words
- yes = oo
- no = hindi
- hi = kumusta
- what = ano
- why = bakit

## ⚙️ Requirements

- **Python 3.7+**
- **pip** (Python package manager)
- **Internet connection** (for Google TTS)

## 🐛 Troubleshooting

### Error: "No module named 'gtts'"
```cmd
pip install gtts
```

### Error: "Python not found"
Install Python from: https://www.python.org/downloads/

### Slow generation?
Normal lang yan! Maraming files kaya medyo matagal.

### Connection error?
Check your internet connection. Kailangan ng Google TTS API.

## 📝 Notes

- Isang voice lang per language (consistent)
- Lahat ng filenames same as German originals
- MP3 format, good quality
- Ready to use sa app!

## ✅ After Generation

Tapos na! Ang app mo ay automatic na gagamit ng English o Filipino voices based sa selected language. No need to change any code!
