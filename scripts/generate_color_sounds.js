#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Color definitions with English and Filipino names
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

// Mixed color combinations
const mixedColors = [
  { colors: ["red", "blue"], en: "red and blue makes purple", fil: "pula at asul ay lila" },
  { colors: ["red", "yellow"], en: "red and yellow makes orange", fil: "pula at dilaw ay kahel" },
  { colors: ["blue", "yellow"], en: "blue and yellow makes green", fil: "asul at dilaw ay berde" },
  { colors: ["red", "green"], en: "red and green makes brown", fil: "pula at berde ay kayumanggi" },
  { colors: ["blue", "orange"], en: "blue and orange makes purple brown", fil: "asul at kahel ay lila kayumanggi" },
  { colors: ["yellow", "purple"], en: "yellow and purple makes brown", fil: "dilaw at lila ay kayumanggi" },
  { colors: ["red", "cyan"], en: "red and cyan makes magenta purple", fil: "pula at syan ay magenta lila" },
  { colors: ["blue", "magenta"], en: "blue and magenta makes dark purple", fil: "asul at magenta ay madilim na lila" },
  { colors: ["yellow", "cyan"], en: "yellow and cyan makes light green", fil: "dilaw at syan ay mapusyaw na berde" },
  { colors: ["green", "orange"], en: "green and orange makes olive", fil: "berde at kahel ay oliba" },
  { colors: ["green", "purple"], en: "green and purple makes dark green", fil: "berde at lila ay madilim na berde" },
  { colors: ["orange", "purple"], en: "orange and purple makes brown orange", fil: "kahel at lila ay kayumanggi kahel" },
  { colors: ["black", "white"], en: "black and white makes gray", fil: "itim at puti ay kulay abo" },
  { colors: ["red", "white"], en: "red and white makes light red", fil: "pula at puti ay mapusyaw na pula" },
  { colors: ["blue", "white"], en: "blue and white makes light blue", fil: "asul at puti ay mapusyaw na asul" },
  { colors: ["yellow", "white"], en: "yellow and white makes light yellow", fil: "dilaw at puti ay mapusyaw na dilaw" }
];

// Create empty MP3 file (placeholder)
function createPlaceholderMP3(filePath) {
  // Create an empty file or copy a silent MP3 if available
  const silentMp3Path = path.join(__dirname, '..', 'public', 'sounds', 'silent.mp3');
  
  if (fs.existsSync(silentMp3Path)) {
    fs.copyFileSync(silentMp3Path, filePath);
    console.log(`Copied silent MP3 to: ${filePath}`);
  } else {
    // Create empty file as placeholder
    fs.writeFileSync(filePath, '');
    console.log(`Created placeholder: ${filePath}`);
  }
}

// Generate color sound files
function generateColorSounds() {
  console.log('Generating color sound files...');
  
  // Generate English color sounds
  colors.forEach(color => {
    const enPath = path.join(__dirname, '..', 'public', 'sounds', 'english', 'color', `${color.en}.mp3`);
    createPlaceholderMP3(enPath);
  });
  
  // Generate Filipino color sounds
  colors.forEach(color => {
    const filPath = path.join(__dirname, '..', 'public', 'sounds', 'filipino', 'color', `${color.fil}.mp3`);
    createPlaceholderMP3(filPath);
  });
  
  // Generate mixed color sounds
  mixedColors.forEach(mix => {
    const [color1, color2] = mix.colors;
    const color1Obj = colors.find(c => c.id === color1);
    const color2Obj = colors.find(c => c.id === color2);
    
    if (color1Obj && color2Obj) {
      // English mixed color sound
      const enMixPath = path.join(__dirname, '..', 'public', 'sounds', 'english', 'color', `mixed_${color1Obj.en}_${color2Obj.en}.mp3`);
      createPlaceholderMP3(enMixPath);
      
      // Filipino mixed color sound
      const filMixPath = path.join(__dirname, '..', 'public', 'sounds', 'filipino', 'color', `mixed_${color1Obj.fil}_${color2Obj.fil}.mp3`);
      createPlaceholderMP3(filMixPath);
    }
  });
  
  // Create explanation sound
  const explanationEn = path.join(__dirname, '..', 'public', 'sounds', 'english', 'explanation', 'color_blending.mp3');
  const explanationFil = path.join(__dirname, '..', 'public', 'sounds', 'filipino', 'explanation', 'color_blending.mp3');
  
  createPlaceholderMP3(explanationEn);
  createPlaceholderMP3(explanationFil);
  
  console.log('Color sound files generated successfully!');
  console.log(`Generated ${colors.length * 2} individual color sounds`);
  console.log(`Generated ${mixedColors.length * 2} mixed color sounds`);
  console.log('Note: These are placeholder files. Replace with actual TTS generated MP3 files.');
}

// Run the script
generateColorSounds();