#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Explanation text for matching game
const EXPLANATIONS = {
  matching: { 
    en: 'Matching game. Find pairs of similar items by flipping cards.', 
    tl: 'Laro ng pagtugma. Hanapin ang mga pares ng magkaparehong bagay sa pamamagitan ng pagbalik ng mga kard.' 
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

  console.log('🎮 Matching Game Sound Generator');
  console.log('='.repeat(60));

  try {
    // Generate matching game explanation sound
    console.log('\n📚 Generating Matching Game Explanation...');
    
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

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Success: ${success} files generated`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} files failed`);
    }
    console.log('\n📊 Summary:');
    console.log(`   - Explanation: ${Object.keys(EXPLANATIONS).length * 2} files (${Object.keys(EXPLANATIONS).length} EN + ${Object.keys(EXPLANATIONS).length} TL)`);
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