#!/usr/bin/env node
const gtts = require('google-tts-api');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Color names in Filipino/Tagalog for the ColorBlendingGame
const COLORS = {
  // Basic colors (already exist but let's regenerate for consistency)
  'red': 'pula',
  'blue': 'asul', 
  'yellow': 'dilaw',
  'green': 'berde',
  'orange': 'kahel',
  'purple': 'lila',
  
  // Missing colors that the game needs
  'brown': 'kayumanggi',
  'red-orange': 'pula-kahel',
  'teal': 'tiyel',
  'indigo': 'indigo',
  'yellow-green': 'dilaw-berde',
  'gold': 'ginto',
  'sea-green': 'berde ng dagat',
  'dark-red': 'madilim na pula',
  'dark-blue': 'madilim na asul',
  'dark-green': 'madilim na berde',
  'dark-orange': 'madilim na kahel',
  
  // Additional colors for completeness
  'black': 'itim',
  'white': 'puti',
  'pink': 'rosas',
  'gray': 'kulay-abo',
  'light-blue': 'mapusyaw na asul',
  'violet': 'biyoleta'
};

function downloadAudio(url, outputPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ ${path.basename(outputPath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      console.log(`✗ ${path.basename(outputPath)}: ${err.message}`);
      reject(err);
    });
  });
}

async function generateAudio(text, outputPath) {
  try {
    const url = gtts.getAudioUrl(text, {
      lang: 'tl', // Tagalog/Filipino
      slow: false,
      host: 'https://translate.google.com',
    });
    await downloadAudio(url, outputPath);
    return true;
  } catch (error) {
    console.log(`✗ ${path.basename(outputPath)}: ${error.message}`);
    return false;
  }
}

async function main() {
  const basePath = path.join(__dirname, '..', 'public', 'sounds', 'filipino', 'color');
  let success = 0;
  let errors = 0;

  console.log('🎨 Filipino Color Sounds Generator');
  console.log('='.repeat(60));
  console.log(`Output directory: ${basePath}`);
  console.log('');

  try {
    // Generate all color sounds
    console.log('🎙️  Generating Filipino color sounds...');
    
    for (const [englishName, filipinoText] of Object.entries(COLORS)) {
      const outputPath = path.join(basePath, `${englishName}.mp3`);
      
      // Check if file already exists
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  ${englishName}.mp3 (already exists)`);
        continue;
      }
      
      console.log(`🔊 Generating: ${englishName} -> "${filipinoText}"`);
      
      if (await generateAudio(filipinoText, outputPath)) {
        success++;
      } else {
        errors++;
      }
      
      // Rate limit to avoid hitting Google TTS limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Success: ${success} new files generated`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} files failed`);
    }
    console.log('\n🎯 Color sounds ready for ColorBlendingGame!');
    console.log('Files generated in: public/sounds/filipino/color/');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { COLORS, generateAudio };