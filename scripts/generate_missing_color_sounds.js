#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Missing color results that need sound files
const MISSING_COLORS = {
  "red-orange": { en: 'red orange', tl: 'pula kahel' },
  "teal": { en: 'teal', tl: 'tiyel' },
  "indigo": { en: 'indigo', tl: 'indigo' },
  "yellow-green": { en: 'yellow green', tl: 'dilaw berde' },
  "gold": { en: 'gold', tl: 'ginto' },
  "sea-green": { en: 'sea green', tl: 'berde ng dagat' },
  "dark-red": { en: 'dark red', tl: 'madilim na pula' },
  "dark-blue": { en: 'dark blue', tl: 'madilim na asul' },
  "dark-green": { en: 'dark green', tl: 'madilim na berde' },
  "dark-orange": { en: 'dark orange', tl: 'madilim na kahel' }
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

  console.log('🎨 Missing Color Sound Generator');
  console.log('='.repeat(60));

  try {
    // Generate missing color sounds
    console.log('\n🎨 Generating Missing Color Sounds...');
    
    for (const [colorId, trans] of Object.entries(MISSING_COLORS)) {
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
      
      // Filipino (will likely fail due to language support, but we'll try)
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
    console.log(`   - Missing colors: ${Object.keys(MISSING_COLORS).length * 2} files (${Object.keys(MISSING_COLORS).length} EN + ${Object.keys(MISSING_COLORS).length} TL)`);
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