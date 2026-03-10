const fs = require('fs');
const path = require('path');
const gtts = require('gtts');

// All 12 colors
const colors = [
  { id: "red", sound: { en: "red", fil: "pula" } },
  { id: "blue", sound: { en: "blue", fil: "asul" } },
  { id: "yellow", sound: { en: "yellow", fil: "dilaw" } },
  { id: "green", sound: { en: "green", fil: "berde" } },
  { id: "orange", sound: { en: "orange", fil: "kahel" } },
  { id: "purple", sound: { en: "purple", fil: "lila" } },
  { id: "pink", sound: { en: "pink", fil: "rosas" } },
  { id: "brown", sound: { en: "brown", fil: "kayumanggi" } },
  { id: "black", sound: { en: "black", fil: "itim" } },
  { id: "white", sound: { en: "white", fil: "puti" } },
  { id: "cyan", sound: { en: "cyan", fil: "syan" } },
  { id: "magenta", sound: { en: "magenta", fil: "magenta" } }
];

// Generate all possible combinations
const combinations = [];
for (let i = 0; i < colors.length; i++) {
  for (let j = i + 1; j < colors.length; j++) {
    const color1 = colors[i];
    const color2 = colors[j];
    
    // Sort alphabetically for consistent naming
    const sortedColors = [color1, color2].sort((a, b) => a.id.localeCompare(b.id));
    
    combinations.push({
      filename: `mixed_${sortedColors[0].sound.en}_${sortedColors[1].sound.en}`,
      text: `${sortedColors[0].sound.en} and ${sortedColors[1].sound.en} mixed`,
      filenameFilipino: `mixed_${sortedColors[0].sound.fil}_${sortedColors[1].sound.fil}`,
      textFilipino: `${sortedColors[0].sound.fil} at ${sortedColors[1].sound.fil} na halo`
    });
  }
}

console.log(`Total combinations to generate: ${combinations.length}`);

// Create directories if they don't exist
const englishDir = path.join(__dirname, '../public/sounds/english/color');
const filipinoDir = path.join(__dirname, '../public/sounds/filipino/color');

if (!fs.existsSync(englishDir)) {
  fs.mkdirSync(englishDir, { recursive: true });
}
if (!fs.existsSync(filipinoDir)) {
  fs.mkdirSync(filipinoDir, { recursive: true });
}

// Function to generate TTS file
function generateTTS(text, filename, language = 'en') {
  return new Promise((resolve, reject) => {
    const tts = new gtts(text, language);
    const filePath = language === 'en' ? 
      path.join(englishDir, `${filename}.mp3`) : 
      path.join(filipinoDir, `${filename}.mp3`);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`✓ File already exists: ${filename}.mp3`);
      resolve();
      return;
    }
    
    tts.save(filePath, (err) => {
      if (err) {
        console.error(`✗ Error generating ${filename}.mp3:`, err);
        reject(err);
      } else {
        console.log(`✓ Generated: ${filename}.mp3`);
        resolve();
      }
    });
  });
}

// Generate all missing files
async function generateAllMissing() {
  console.log('Generating missing mixed color sound files...\n');
  
  for (const combo of combinations) {
    try {
      // Generate English version
      await generateTTS(combo.text, combo.filename, 'en');
      
      // Generate Filipino version (using English TTS for better pronunciation)
      await generateTTS(combo.textFilipino, combo.filenameFilipino, 'en');
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to generate ${combo.filename}:`, error);
    }
  }
  
  console.log('\n✅ Mixed color sound generation complete!');
}

generateAllMissing().catch(console.error);