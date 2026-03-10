#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// 12 colors from the color wheel with English and Filipino names
const COLORS = {
  red: { en: 'red', tl: 'pula' },
  'red-orange': { en: 'red orange', tl: 'pula kahel' },
  orange: { en: 'orange', tl: 'kahel' },
  'yellow-orange': { en: 'yellow orange', tl: 'dilaw kahel' },
  yellow: { en: 'yellow', tl: 'dilaw' },
  'yellow-green': { en: 'yellow green', tl: 'dilaw berde' },
  green: { en: 'green', tl: 'berde' },
  'blue-green': { en: 'blue green', tl: 'asul berde' },
  blue: { en: 'blue', tl: 'asul' },
  'blue-violet': { en: 'blue violet', tl: 'asul lila' },
  violet: { en: 'violet', tl: 'lila' },
  'red-violet': { en: 'red violet', tl: 'pula lila' }
};

// Explanation text for color identification game
const EXPLANATIONS = {
  color_identification: { 
    en: 'Color identification game. Identify the colors you see.', 
    tl: 'Laro ng pagkilala sa kulay. Kilalanin ang mga kulay na nakikita mo.' 
  }
};

function generateAudio(text, lang, outputPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      const tts = require('node-gtts')(lang);
      tts.save(outputPath, text, (err) => {
        if (err) {
          console.log(`✗ ${path.basename(outputPath)} - ${err.message}`);
          reject(err);
        } else {
          console.log(`✓ ${path.basename(outputPath)}`);
          resolve();
        }
      });
    } catch (error) {
      console.log(`✗ ${path.basename(outputPath)} - ${error.message}`);
      reject(error);
    }
  });
}

async function main() {
  const basePath = path.join(__dirname, '..', 'public', 'sounds');
  let success = 0;
  let errors = 0;

  console.log('🎨 Color Identification Sound Generator');
  console.log('='.repeat(60));

  try {
    // 1. Generate color identification explanation sound
    console.log('\n📚 Generating Color Identification Explanation...');
    
    for (const [filename, trans] of Object.entries(EXPLANATIONS)) {
      // English
      try {
        await generateAudio(
          trans.en,
          'en',
          path.join(basePath, 'english', 'explanation', `${filename}.mp3`)
        );
        success++;
      } catch (e) { 
        errors++; 
      }
      
      // Filipino
      try {
        await generateAudio(
          trans.tl,
          'tl',
          path.join(basePath, 'filipino', 'explanation', `${filename}.mp3`)
        );
        success++;
      } catch (e) { 
        errors++; 
      }
    }

    // 2. Generate individual color sounds for 12 color wheel colors
    console.log('\n🎨 Generating 12 Color Wheel Sounds...');
    
    for (const [colorId, trans] of Object.entries(COLORS)) {
      // English
      try {
        await generateAudio(
          trans.en, 
          'en', 
          path.join(basePath, 'english', 'color', `${colorId}.mp3`)
        );
        success++;
      } catch (e) { 
        errors++; 
      }
      
      // Filipino
      try {
        await generateAudio(
          trans.tl, 
          'tl', 
          path.join(basePath, 'filipino', 'color', `${colorId}.mp3`)
        );
        success++;
      } catch (e) { 
        errors++; 
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Success: ${success} files generated`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} files failed`);
    }
    console.log('\n📊 Summary:');
    console.log(`   - Explanation: ${Object.keys(EXPLANATIONS).length * 2} files (${Object.keys(EXPLANATIONS).length} EN + ${Object.keys(EXPLANATIONS).length} TL)`);
    console.log(`   - Color wheel colors: ${Object.keys(COLORS).length * 2} files (${Object.keys(COLORS).length} EN + ${Object.keys(COLORS).length} TL)`);
    console.log(`   - Total: ${(Object.keys(EXPLANATIONS).length * 2) + (Object.keys(COLORS).length * 2)} files`);
    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Fatal Error:', error);
    process.exit(1);
  }
}

// Check if node-gtts is installed
try {
  require('node-gtts');
  main();
} catch (error) {
  console.error('❌ Error: node-gtts is not installed!');
  console.error('Please install it by running:');
  console.error('  npm install node-gtts');
  console.error('\nOr install all dependencies:');
  console.error('  npm install');
  process.exit(1);
}