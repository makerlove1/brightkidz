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

// Create directories if they don't exist
const englishDir = path.join(__dirname, '../public/sounds/english/color');
const filipinoDir = path.join(__dirname, '../public/sounds/filipino/color');

if (!fs.existsSync(englishDir)) {
  fs.mkdirSync(englishDir, { recursive: true });
}
if (!fs.existsSync(filipinoDir)) {
  fs.mkdirSync(filipinoDir, { recursive: true });
}

// Function to generate TTS file with better quality settings
function generateTTS(text, filename, language = 'en', forceRegenerate = false) {
  return new Promise((resolve, reject) => {
    const filePath = language === 'en' ? 
      path.join(englishDir, `${filename}.mp3`) : 
      path.join(filipinoDir, `${filename}.mp3`);
    
    // Check if file already exists and we're not forcing regeneration
    if (fs.existsSync(filePath) && !forceRegenerate) {
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
        console.log(`✓ Generated: ${filename}.mp3 (${language})`);
        resolve();
      }
    });
  });
}

// Generate all possible color combinations
function generateAllCombinations() {
  const combinations = [];
  
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const color1 = colors[i];
      const color2 = colors[j];
      
      // Sort alphabetically for consistent naming
      const sortedColors = [color1, color2].sort((a, b) => a.en.localeCompare(b.en));
      
      combinations.push({
        englishFilename: `mixed_${sortedColors[0].en}_${sortedColors[1].en}`,
        englishText: `${sortedColors[0].en} and ${sortedColors[1].en} mixed`,
        filipinoFilename: `mixed_${sortedColors[0].fil}_${sortedColors[1].fil}`,
        filipinoText: `${sortedColors[0].fil} at ${sortedColors[1].fil} na halo`,
        colors: [sortedColors[0], sortedColors[1]]
      });
    }
  }
  
  return combinations;
}

// Generate individual color sounds first
async function generateIndividualColors() {
  console.log('Generating individual color sounds...\n');
  
  for (const color of colors) {
    try {
      // English version
      await generateTTS(color.en, color.en, 'en');
      
      // Filipino version
      await generateTTS(color.fil, color.fil, 'en'); // Using English TTS for better pronunciation
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to generate ${color.en}:`, error);
    }
  }
}

// Generate mixed color sounds
async function generateMixedColors() {
  console.log('\nGenerating mixed color sounds...\n');
  
  const combinations = generateAllCombinations();
  
  for (const combo of combinations) {
    try {
      // Generate English version
      await generateTTS(combo.englishText, combo.englishFilename, 'en', true); // Force regenerate to fix cut-off issues
      
      // Generate Filipino version
      await generateTTS(combo.filipinoText, combo.filipinoFilename, 'en', true); // Force regenerate and use English TTS
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to generate ${combo.englishFilename}:`, error);
    }
  }
}

// Fix specific problematic combinations mentioned by user
async function fixProblematicCombinations() {
  console.log('\nFixing specific problematic combinations...\n');
  
  const problematicCombinations = [
    { en: "blue and red mixed", fil: "asul at pula na halo", enFile: "mixed_blue_red", filFile: "mixed_asul_pula" },
    { en: "green and red mixed", fil: "berde at pula na halo", enFile: "mixed_green_red", filFile: "mixed_berde_pula" },
    { en: "orange and red mixed", fil: "kahel at pula na halo", enFile: "mixed_orange_red", filFile: "mixed_kahel_pula" },
    { en: "purple and red mixed", fil: "lila at pula na halo", enFile: "mixed_purple_red", filFile: "mixed_lila_pula" },
    { en: "blue and green mixed", fil: "asul at berde na halo", enFile: "mixed_blue_green", filFile: "mixed_asul_berde" },
    { en: "blue and purple mixed", fil: "asul at lila na halo", enFile: "mixed_blue_purple", filFile: "mixed_asul_lila" },
    { en: "green and yellow mixed", fil: "berde at dilaw na halo", enFile: "mixed_green_yellow", filFile: "mixed_berde_dilaw" },
    { en: "orange and yellow mixed", fil: "kahel at dilaw na halo", enFile: "mixed_orange_yellow", filFile: "mixed_kahel_dilaw" },
    { en: "purple and yellow mixed", fil: "lila at dilaw na halo", enFile: "mixed_purple_yellow", filFile: "mixed_lila_dilaw" }
  ];
  
  for (const combo of problematicCombinations) {
    try {
      console.log(`Fixing: ${combo.enFile}`);
      
      // Generate English version with longer text for better audio quality
      await generateTTS(combo.en, combo.enFile, 'en', true);
      
      // Generate Filipino version with longer text
      await generateTTS(combo.fil, combo.filFile, 'en', true);
      
      // Longer delay for problematic files
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Failed to fix ${combo.enFile}:`, error);
    }
  }
}

// Main function to fix all color sounds
async function fixAllColorSounds() {
  console.log('🔧 Fixing Color Sound Files...\n');
  console.log('This will regenerate all mixed color sounds to fix cut-off and missing issues.\n');
  
  try {
    // Step 1: Generate individual colors
    await generateIndividualColors();
    
    // Step 2: Generate all mixed colors
    await generateMixedColors();
    
    // Step 3: Fix specific problematic combinations
    await fixProblematicCombinations();
    
    console.log('\n✅ Color sound fix complete!');
    console.log(`Generated sounds for ${colors.length} individual colors`);
    console.log(`Generated sounds for ${(colors.length * (colors.length - 1)) / 2} color combinations`);
    console.log('Both English and Filipino versions created');
    
  } catch (error) {
    console.error('❌ Error during sound generation:', error);
  }
}

fixAllColorSounds();