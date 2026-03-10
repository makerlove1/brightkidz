#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Color definitions with English and Filipino names
const COLORS = {
  red: { en: 'red', tl: 'pula' },
  blue: { en: 'blue', tl: 'asul' },
  yellow: { en: 'yellow', tl: 'dilaw' },
  green: { en: 'green', tl: 'berde' },
  orange: { en: 'orange', tl: 'kahel' },
  purple: { en: 'purple', tl: 'lila' },
  pink: { en: 'pink', tl: 'rosas' },
  brown: { en: 'brown', tl: 'kayumanggi' },
  black: { en: 'black', tl: 'itim' },
  white: { en: 'white', tl: 'puti' },
  cyan: { en: 'cyan', tl: 'syan' },
  magenta: { en: 'magenta', tl: 'magenta' }
};

// Mixed color combinations with descriptions
const MIXED_COLORS = [
  { 
    colors: ['red', 'blue'], 
    en: 'red and blue makes purple', 
    tl: 'pula at asul ay lila' 
  },
  { 
    colors: ['red', 'yellow'], 
    en: 'red and yellow makes orange', 
    tl: 'pula at dilaw ay kahel' 
  },
  { 
    colors: ['blue', 'yellow'], 
    en: 'blue and yellow makes green', 
    tl: 'asul at dilaw ay berde' 
  },
  { 
    colors: ['red', 'green'], 
    en: 'red and green makes brown', 
    tl: 'pula at berde ay kayumanggi' 
  },
  { 
    colors: ['blue', 'orange'], 
    en: 'blue and orange makes purple brown', 
    tl: 'asul at kahel ay lila kayumanggi' 
  },
  { 
    colors: ['yellow', 'purple'], 
    en: 'yellow and purple makes brown', 
    tl: 'dilaw at lila ay kayumanggi' 
  },
  { 
    colors: ['red', 'cyan'], 
    en: 'red and cyan makes magenta purple', 
    tl: 'pula at syan ay magenta lila' 
  },
  { 
    colors: ['blue', 'magenta'], 
    en: 'blue and magenta makes dark purple', 
    tl: 'asul at magenta ay madilim na lila' 
  },
  { 
    colors: ['yellow', 'cyan'], 
    en: 'yellow and cyan makes light green', 
    tl: 'dilaw at syan ay mapusyaw na berde' 
  },
  { 
    colors: ['green', 'orange'], 
    en: 'green and orange makes olive', 
    tl: 'berde at kahel ay oliba' 
  },
  { 
    colors: ['green', 'purple'], 
    en: 'green and purple makes dark green', 
    tl: 'berde at lila ay madilim na berde' 
  },
  { 
    colors: ['orange', 'purple'], 
    en: 'orange and purple makes brown orange', 
    tl: 'kahel at lila ay kayumanggi kahel' 
  },
  { 
    colors: ['black', 'white'], 
    en: 'black and white makes gray', 
    tl: 'itim at puti ay kulay abo' 
  },
  { 
    colors: ['red', 'white'], 
    en: 'red and white makes light red', 
    tl: 'pula at puti ay mapusyaw na pula' 
  },
  { 
    colors: ['blue', 'white'], 
    en: 'blue and white makes light blue', 
    tl: 'asul at puti ay mapusyaw na asul' 
  },
  { 
    colors: ['yellow', 'white'], 
    en: 'yellow and white makes light yellow', 
    tl: 'dilaw at puti ay mapusyaw na dilaw' 
  }
];

// Explanation text
const EXPLANATIONS = {
  color_blending: { 
    en: 'Color blending game. Mix colors together.', 
    tl: 'Laro ng paghahalo ng kulay. Paghaluin ang mga kulay.' 
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

  console.log('🎨 Color Sound Generator with TTS');
  console.log('='.repeat(60));

  try {
    // 1. Generate individual color sounds
    console.log('\n🎨 Generating Individual Color Sounds...');
    
    for (const [colorId, trans] of Object.entries(COLORS)) {
      // English
      try {
        await generateAudio(
          trans.en, 
          'en', 
          path.join(basePath, 'english', 'color', `${trans.en}.mp3`)
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
          path.join(basePath, 'filipino', 'color', `${trans.tl}.mp3`)
        );
        success++;
      } catch (e) { 
        errors++; 
      }
    }

    // 2. Generate mixed color sounds
    console.log('\n🎨 Generating Mixed Color Sounds...');
    
    for (const mix of MIXED_COLORS) {
      const [color1Id, color2Id] = mix.colors;
      const color1 = COLORS[color1Id];
      const color2 = COLORS[color2Id];
      
      if (color1 && color2) {
        // English mixed color sound
        try {
          await generateAudio(
            mix.en,
            'en',
            path.join(basePath, 'english', 'color', `mixed_${color1.en}_${color2.en}.mp3`)
          );
          success++;
        } catch (e) { 
          errors++; 
        }
        
        // Filipino mixed color sound
        try {
          await generateAudio(
            mix.tl,
            'tl',
            path.join(basePath, 'filipino', 'color', `mixed_${color1.tl}_${color2.tl}.mp3`)
          );
          success++;
        } catch (e) { 
          errors++; 
        }
      }
    }

    // 3. Generate explanation sounds
    console.log('\n📚 Generating Explanation Sounds...');
    
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
    console.log(`   - Individual colors: ${Object.keys(COLORS).length * 2} files (${Object.keys(COLORS).length} EN + ${Object.keys(COLORS).length} TL)`);
    console.log(`   - Mixed colors: ${MIXED_COLORS.length * 2} files (${MIXED_COLORS.length} EN + ${MIXED_COLORS.length} TL)`);
    console.log(`   - Explanations: ${Object.keys(EXPLANATIONS).length * 2} files (${Object.keys(EXPLANATIONS).length} EN + ${Object.keys(EXPLANATIONS).length} TL)`);
    console.log(`   - Total: ${(Object.keys(COLORS).length * 2) + (MIXED_COLORS.length * 2) + (Object.keys(EXPLANATIONS).length * 2)} files`);
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
