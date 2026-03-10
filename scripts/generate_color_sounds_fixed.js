#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Color definitions with English and Filipino names
const COLORS = {
  red: { en: 'red', fil: 'pula' },
  blue: { en: 'blue', fil: 'asul' },
  yellow: { en: 'yellow', fil: 'dilaw' },
  green: { en: 'green', fil: 'berde' },
  orange: { en: 'orange', fil: 'kahel' },
  purple: { en: 'purple', fil: 'lila' },
  pink: { en: 'pink', fil: 'rosas' },
  brown: { en: 'brown', fil: 'kayumanggi' },
  black: { en: 'black', fil: 'itim' },
  white: { en: 'white', fil: 'puti' },
  cyan: { en: 'cyan', fil: 'syan' },
  magenta: { en: 'magenta', fil: 'magenta' }
};

// Mixed color combinations with descriptions
const MIXED_COLORS = [
  { 
    colors: ['red', 'blue'], 
    en: 'red and blue makes purple', 
    fil: 'pula at asul ay lila' 
  },
  { 
    colors: ['red', 'yellow'], 
    en: 'red and yellow makes orange', 
    fil: 'pula at dilaw ay kahel' 
  },
  { 
    colors: ['blue', 'yellow'], 
    en: 'blue and yellow makes green', 
    fil: 'asul at dilaw ay berde' 
  },
  { 
    colors: ['red', 'green'], 
    en: 'red and green makes brown', 
    fil: 'pula at berde ay kayumanggi' 
  },
  { 
    colors: ['blue', 'orange'], 
    en: 'blue and orange makes purple brown', 
    fil: 'asul at kahel ay lila kayumanggi' 
  },
  { 
    colors: ['yellow', 'purple'], 
    en: 'yellow and purple makes brown', 
    fil: 'dilaw at lila ay kayumanggi' 
  },
  { 
    colors: ['red', 'cyan'], 
    en: 'red and cyan makes magenta purple', 
    fil: 'pula at syan ay magenta lila' 
  },
  { 
    colors: ['blue', 'magenta'], 
    en: 'blue and magenta makes dark purple', 
    fil: 'asul at magenta ay madilim na lila' 
  },
  { 
    colors: ['yellow', 'cyan'], 
    en: 'yellow and cyan makes light green', 
    fil: 'dilaw at syan ay mapusyaw na berde' 
  },
  { 
    colors: ['green', 'orange'], 
    en: 'green and orange makes olive', 
    fil: 'berde at kahel ay oliba' 
  },
  { 
    colors: ['green', 'purple'], 
    en: 'green and purple makes dark green', 
    fil: 'berde at lila ay madilim na berde' 
  },
  { 
    colors: ['orange', 'purple'], 
    en: 'orange and purple makes brown orange', 
    fil: 'kahel at lila ay kayumanggi kahel' 
  },
  { 
    colors: ['black', 'white'], 
    en: 'black and white makes gray', 
    fil: 'itim at puti ay kulay abo' 
  },
  { 
    colors: ['red', 'white'], 
    en: 'red and white makes light red', 
    fil: 'pula at puti ay mapusyaw na pula' 
  },
  { 
    colors: ['blue', 'white'], 
    en: 'blue and white makes light blue', 
    fil: 'asul at puti ay mapusyaw na asul' 
  },
  { 
    colors: ['yellow', 'white'], 
    en: 'yellow and white makes light yellow', 
    fil: 'dilaw at puti ay mapusyaw na dilaw' 
  }
];

// Explanation text
const EXPLANATIONS = {
  color_blending: { 
    en: 'Color blending game. Mix colors together.', 
    fil: 'Laro ng paghahalo ng kulay. Paghaluin ang mga kulay.' 
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

  console.log('🎨 Color Sound Generator with TTS (Fixed)');
  console.log('='.repeat(60));
  console.log('Note: Using English TTS for Filipino words due to language support limitations');
  console.log('');

  try {
    // 1. Generate individual color sounds
    console.log('🎨 Generating Individual Color Sounds...');
    
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
      
      // Filipino (using English TTS with Filipino words)
      try {
        await generateAudio(
          trans.fil, 
          'en', // Using English TTS for Filipino words
          path.join(basePath, 'filipino', 'color', `${trans.fil}.mp3`)
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
        
        // Filipino mixed color sound (using English TTS)
        try {
          await generateAudio(
            mix.fil,
            'en', // Using English TTS for Filipino text
            path.join(basePath, 'filipino', 'color', `mixed_${color1.fil}_${color2.fil}.mp3`)
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
      
      // Filipino (using English TTS)
      try {
        await generateAudio(
          trans.fil,
          'en', // Using English TTS for Filipino text
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
    console.log(`   - Individual colors: ${Object.keys(COLORS).length * 2} files (${Object.keys(COLORS).length} EN + ${Object.keys(COLORS).length} FIL)`);
    console.log(`   - Mixed colors: ${MIXED_COLORS.length * 2} files (${MIXED_COLORS.length} EN + ${MIXED_COLORS.length} FIL)`);
    console.log(`   - Explanations: ${Object.keys(EXPLANATIONS).length * 2} files (${Object.keys(EXPLANATIONS).length} EN + ${Object.keys(EXPLANATIONS).length} FIL)`);
    console.log(`   - Total: ${(Object.keys(COLORS).length * 2) + (MIXED_COLORS.length * 2) + (Object.keys(EXPLANATIONS).length * 2)} files`);
    console.log('\n📝 Note: Filipino sounds use English TTS pronunciation');
    console.log('   For proper Filipino pronunciation, consider using a Filipino TTS service');
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