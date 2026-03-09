#!/usr/bin/env python3
"""
Generate AI voice translations for Filipino and English based on German sound files.
This script translates the German filenames and generates corresponding audio files.

Usage:
    pip install -r requirements_voice.txt
    python generate_voice_translations.py
"""

import os
import re
from pathlib import Path
from gtts import gTTS

# Translation mappings from German to English and Filipino
TRANSLATIONS = {
    # Explanations
    'calculation0To18': {
        'en': 'Calculation from 0 to 18',
        'tl': 'Pagkalkula mula 0 hanggang 18',
        'category': 'explanation'
    },
    'dragdrop_buildwords': {
        'en': 'Drag and drop to build words',
        'tl': 'I-drag at i-drop upang bumuo ng mga salita',
        'category': 'explanation'
    },
    'dragdrop_characters': {
        'en': 'Drag and drop the characters',
        'tl': 'I-drag at i-drop ang mga karakter',
        'category': 'explanation'
    },
    'memory': {
        'en': 'Memory game',
        'tl': 'Larong memorya',
        'category': 'explanation'
    },
    't2s': {
        'en': 'Text to speech',
        'tl': 'Teksto sa pananalita',
        'category': 'explanation'
    },
    
    # Helpers
    'aber_wir_brauchen_ein': {
        'en': 'But we need a',
        'tl': 'Ngunit kailangan natin ng',
        'category': 'helpers'
    },
    'das_ist_eine': {
        'en': 'This is a',
        'tl': 'Ito ay isang',
        'category': 'helpers'
    },
    'du_hast_ein': {
        'en': 'You have a',
        'tl': 'Mayroon kang',
        'category': 'helpers'
    },
    'next_level': {
        'en': 'Next level',
        'tl': 'Susunod na antas',
        'category': 'helpers'
    },
    'nicht_ganz_richtig': {
        'en': 'Not quite right',
        'tl': 'Hindi tama',
        'category': 'helpers'
    },
    'super_und_jetzt_ein': {
        'en': 'Great! And now a',
        'tl': 'Magaling! At ngayon ang',
        'category': 'helpers'
    },
    'und_eine': {
        'en': 'And a',
        'tl': 'At ang',
        'category': 'helpers'
    },
    'wir_schreiben_das_wort': {
        'en': 'We write the word',
        'tl': 'Isusulat natin ang salita',
        'category': 'helpers'
    }
}

def generate_audio(text, language_code, output_path):
    """Generate audio file from text using gTTS."""
    try:
        # Ensure parent directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        tts = gTTS(text=text, lang=language_code, slow=False)
        tts.save(str(output_path))
        print(f"✓ Generated: {output_path.relative_to(Path.cwd())}")
        return True
    except Exception as e:
        print(f"✗ Error generating {output_path.name}: {e}")
        return False

def process_translations():
    """Process all translations and generate audio files."""
    base_path = Path(__file__).parent.parent / 'public' / 'sounds'
    
    success_count = 0
    error_count = 0
    
    # Process all translations
    for filename, data in TRANSLATIONS.items():
        category = data['category']
        
        # English
        en_path = base_path / 'english' / category / f'{filename}.mp3'
        if generate_audio(data['en'], 'en', en_path):
            success_count += 1
        else:
            error_count += 1
        
        # Filipino (Tagalog)
        tl_path = base_path / 'filipino' / category / f'{filename}.mp3'
        if generate_audio(data['tl'], 'tl', tl_path):
            success_count += 1
        else:
            error_count += 1
    
    return success_count, error_count

if __name__ == '__main__':
    print("🎙️  AI Voice Translation Generator")
    print("=" * 60)
    print("Generating English and Filipino voice files...")
    print()
    
    success, errors = process_translations()
    
    print()
    print("=" * 60)
    print(f"✅ Successfully generated: {success} files")
    if errors > 0:
        print(f"❌ Errors: {errors} files")
    print("Done!")
