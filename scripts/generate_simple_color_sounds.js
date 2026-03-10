const fs = require('fs');
const path = require('path');
const gTTS = require('gtts');

// Simple color results that need sounds
const colorSounds = {
  english: [
    { name: 'red', text: 'red' },
    { name: 'blue', text: 'blue' },
    { name: 'yellow', text: 'yellow' },
    { name: 'green', text: 'green' },
    { name: 'orange', text: 'orange' },
    { name: 'purple', text: 'purple' }
  ],
  filipino: [
    { name: 'pula', text: 'pula' },
    { name: 'asul', text: 'asul' },
    { name: 'dilaw', text: 'dilaw' },
    { name: 'berde', text: 'berde' },
    { name: 'kahel', text: 'kahel' },
    { name: 'lila', text: 'lila' }
  ]
};

async function generateColorSounds() {
  console.log('🎵 Generating simple color sounds...');
  
  // Create directories
  const englishDir = path.join(__dirname, '../public/sounds/english/color');
  const filipinoDir = path.join(__dirname, '../public/sounds/filipino/color');
  
  if (!fs.existsSync(englishDir)) {
    fs.mkdirSync(englishDir, { recursive: true });
  }
  if (!fs.existsSync(filipinoDir)) {
    fs.mkdirSync(filipinoDir, { recursive: true });
  }
  
  // Generate English sounds
  console.log('Generating English color sounds...');
  for (const color of colorSounds.english) {
    const gtts = new gTTS(color.text, 'en');
    const filePath = path.join(englishDir, `${color.name}.mp3`);
    
    await new Promise((resolve, reject) => {
      gtts.save(filePath, (err) => {
        if (err) {
          console.error(`❌ Error generating ${color.name}:`, err);
          reject(err);
        } else {
          console.log(`✅ Generated: ${color.name}.mp3`);
          resolve();
        }
      });
    });
    
    // Small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Generate Filipino sounds (using English TTS for better pronunciation)
  console.log('Generating Filipino color sounds...');
  for (const color of colorSounds.filipino) {
    const gtts = new gTTS(color.text, 'en'); // Using English TTS for Filipino words
    const filePath = path.join(filipinoDir, `${color.name}.mp3`);
    
    await new Promise((resolve, reject) => {
      gtts.save(filePath, (err) => {
        if (err) {
          console.error(`❌ Error generating ${color.name}:`, err);
          reject(err);
        } else {
          console.log(`✅ Generated: ${color.name}.mp3`);
          resolve();
        }
      });
    });
    
    // Small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('🎉 All simple color sounds generated successfully!');
}

// Run the generation
generateColorSounds().catch(console.error);