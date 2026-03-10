const fs = require('fs');
const path = require('path');
const gtts = require('gtts');

// All 12 colors with their English and Filipino names
const colors = [
  { id: "red", en: "red", fil: "pula" },
  { id: "blue", en: "blue", fil: "asul" },
  { id: "yellow", en: "yellow", fil: "dilaw" },
  { id: "green", en: "green", fil: "berde" },
  { id: "orange", en: "orange", fil: "kahel" },
  { id: "purple", en: "purple", fil: "lila" },
  { id: "pink", en: "pink", fil: "rosas" },
  { id: "brown", en: "brown", fil: "kayumanggi" },
  { id: "black", en: "black", fil: "itim" },
  { id: "white", en: "white", fil: "puti" },
  { id: "cyan", en: "cyan", fil: "syan" },
  { id: "magenta", en: "magenta", fil: "magenta" }
];

const filipinoDir = path.join(__dirname, '../public/sounds/filipino/color');

if (!fs.existsSync(filipinoDir)) {
  fs.mkdirSync(filipinoDir, { recursive: true });
}

// Function to generate TTS file
function generateTTS(text, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(filipinoDir, `${filename}.mp3`);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`✓ File already exists: ${filename}.mp3`);
      resolve();
      return;
    }
    
    // Use English TTS for Filipino words for better pronunciation
    const tts = new gtts(text, 'en');
    
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

// Generate all possible Filipino combinations
async function generateAllFilipinoCombinations() {
  console.log('Generating missing Filipino mixed color sounds...\n');
  
  const combinations = [];
  
  // Generate all combinations
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const color1 = colors[i];
      const color2 = colors[j];
      
      // Sort alphabetically by Filipino names for consistent naming
      const sortedColors = [color1, color2].sort((a, b) => a.fil.localeCompare(b.fil));
      
      combinations.push({
        filename: `mixed_${sortedColors[0].fil}_${sortedColors[1].fil}`,
        text: `${sortedColors[0].fil} at ${sortedColors[1].fil} na halo`,
        colors: [sortedColors[0], sortedColors[1]]
      });
    }
  }
  
  console.log(`Total combinations to generate: ${combinations.length}\n`);
  
  // Generate each combination
  for (const combo of combinations) {
    try {
      await generateTTS(combo.text, combo.filename);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (error) {
      console.error(`Failed to generate ${combo.filename}:`, error);
    }
  }
  
  console.log('\n✅ Filipino mixed color sound generation complete!');
}

// Generate individual Filipino colors first
async function generateIndividualFilipino() {
  console.log('Generating individual Filipino color sounds...\n');
  
  for (const color of colors) {
    try {
      await generateTTS(color.fil, color.fil);
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to generate ${color.fil}:`, error);
    }
  }
}

async function main() {
  console.log('🔧 Generating Missing Filipino Color Sounds...\n');
  
  try {
    // Step 1: Generate individual colors
    await generateIndividualFilipino();
    
    // Step 2: Generate all mixed colors
    await generateAllFilipinoCombinations();
    
    // Check final count
    const files = fs.readdirSync(filipinoDir);
    console.log(`\n📊 Total Filipino color sound files: ${files.length}`);
    
  } catch (error) {
    console.error('❌ Error during Filipino sound generation:', error);
  }
}

main();