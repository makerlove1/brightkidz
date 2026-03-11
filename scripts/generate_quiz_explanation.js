#!/usr/bin/env node
const gtts = require('google-tts-api');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Quiz explanation texts
const QUIZ_EXPLANATIONS = {
  en: {
    text: 'Quiz Game - Identify objects, letters and numbers',
    lang: 'en'
  },
  tl: {
    text: 'Laro ng Pagsusulit - Kilalanin ang mga bagay, titik at numero',
    lang: 'tl'
  }
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

async function generateAudio(text, outputPath, lang) {
  try {
    const url = gtts.getAudioUrl(text, {
      lang: lang,
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
  const basePath = path.join(__dirname, '..', 'public', 'sounds');
  let success = 0;
  let errors = 0;

  console.log('🎙️ Quiz Explanation Audio Generator');
  console.log('='.repeat(50));

  try {
    // Generate English quiz explanation
    console.log('\n🇺🇸 Generating English quiz explanation...');
    const englishPath = path.join(basePath, 'english', 'explanation', 'quiz.mp3');
    if (await generateAudio(QUIZ_EXPLANATIONS.en.text, englishPath, QUIZ_EXPLANATIONS.en.lang)) {
      success++;
    } else {
      errors++;
    }

    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 300));

    // Generate Filipino quiz explanation
    console.log('\n🇵🇭 Generating Filipino quiz explanation...');
    const filipinoPath = path.join(basePath, 'filipino', 'explanation', 'quiz.mp3');
    if (await generateAudio(QUIZ_EXPLANATIONS.tl.text, filipinoPath, QUIZ_EXPLANATIONS.tl.lang)) {
      success++;
    } else {
      errors++;
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Success: ${success} files generated`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} files failed`);
    }
    console.log('\n🎯 Quiz explanation audio files ready!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { QUIZ_EXPLANATIONS, generateAudio };