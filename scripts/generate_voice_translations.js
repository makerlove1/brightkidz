#!/usr/bin/env node
/**
 * Generate AI voice translations for Filipino and English based on German sound files.
 * 
 * Usage:
 *   npm install gtts-node
 *   node generate_voice_translations.js
 */

const gtts = require('gtts-node');
const fs = require('fs');
const path = require('path');

// Translation mappings from German to English and Filipino
const TRANSLATIONS = {
  // Explanations
  calculation0To18: {
    en: 'Calculation from 0 to 18',
    tl: 'Pagkalkula mula 0 hanggang 18',
    category: 'explanation'
  },
  dragdrop_buildwords: {
    en: 'Drag and drop to build words',
    tl: 'I-drag at i-drop upang bumuo ng mga salita',
    category: 'explanation'
  },
  dragdrop_characters: {
    en: 'Drag and drop the characters',
    tl: 'I-drag at i-drop ang mga karakter',
    category: 'explanation'
  },
  memory: {
    en: 'Memory game',
    tl: 'Larong memorya',
    category: 'explanation'
  },
  t2s: {
    en: 'Text to speech',
    tl: 'Teksto sa pananalita',
    category: 'explanation'
  },
  
  // Helpers
  aber_wir_brauchen_ein: {
    en: 'But we need a',
    tl: 'Ngunit kailangan natin ng',
    category: 'helpers'
  },
  das_ist_eine: {
    en: 'This is a',
    tl: 'Ito ay isang',
    category: 'helpers'
  },
  du_hast_ein: {
    en: 'You have a',
    tl: 'Mayroon kang',
    category: 'helpers'
  },
  next_level: {
    en: 'Next level',
    tl: 'Susunod na antas',
    category: 'helpers'
  },
  nicht_ganz_richtig: {
    en: 'Not quite right',
    tl: 'Hindi tama',
    category: 'helpers'
  },
  super_und_jetzt_ein: {
    en: 'Great! And now a',
    tl: 'Magaling! At ngayon ang',
    category: 'helpers'
  },
  und_eine: {
    en: 'And a',
    tl: 'At ang',
    category: 'helpers'
  },
  wir_schreiben_das_wort: {
    en: 'We write the word',
    tl: 'Isusulat natin ang salita',
    category: 'helpers'
  }
};

async function generateAudio(text, languageCode, outputPath) {
  try {
    // Ensure parent directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await new Promise((resolve, reject) => {
      gtts.save(outputPath, text, languageCode, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log(`✓ Generated: ${path.relative(process.cwd(), outputPath)}`);
    return true;
  } catch (error) {
    console.error(`✗ Error generating ${path.basename(outputPath)}: ${error.message}`);
    return false;
  }
}

async function processTranslations() {
  const basePath = path.join(__dirname, '..', 'public', 'sounds');
  
  let successCount = 0;
  let errorCount = 0;

  for (const [filename, data] of Object.entries(TRANSLATIONS)) {
    const category = data.category;
    
    // English
    const enPath = path.join(basePath, 'english', category, `${filename}.mp3`);
    if (await generateAudio(data.en, 'en', enPath)) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Filipino (Tagalog)
    const tlPath = path.join(basePath, 'filipino', category, `${filename}.mp3`);
    if (await generateAudio(data.tl, 'tl', tlPath)) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  return { successCount, errorCount };
}

async function main() {
  console.log('🎙️  AI Voice Translation Generator');
  console.log('='.repeat(60));
  console.log('Generating English and Filipino voice files...');
  console.log();

  const { successCount, errorCount } = await processTranslations();

  console.log();
  console.log('='.repeat(60));
  console.log(`✅ Successfully generated: ${successCount} files`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} files`);
  }
  console.log('Done!');
}

main().catch(console.error);
