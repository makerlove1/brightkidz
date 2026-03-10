const fs = require('fs');
const path = require('path');

// Files we want to keep (simple color names only)
const keepFiles = [
  'red.mp3', 'blue.mp3', 'yellow.mp3', 'green.mp3', 'orange.mp3', 'purple.mp3',
  'pula.mp3', 'asul.mp3', 'dilaw.mp3', 'berde.mp3', 'kahel.mp3', 'lila.mp3'
];

function cleanupDirectory(dirPath, language) {
  console.log(`🧹 Cleaning up ${language} color sounds...`);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist, skipping.`);
    return;
  }
  
  const files = fs.readdirSync(dirPath);
  let deletedCount = 0;
  
  files.forEach(file => {
    if (!keepFiles.includes(file)) {
      const filePath = path.join(dirPath, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`❌ Deleted: ${file}`);
        deletedCount++;
      } catch (err) {
        console.error(`Error deleting ${file}:`, err.message);
      }
    } else {
      console.log(`✅ Kept: ${file}`);
    }
  });
  
  console.log(`${language} cleanup complete: ${deletedCount} files deleted, ${keepFiles.length} files kept.`);
}

// Clean up both directories
const englishDir = path.join(__dirname, '../public/sounds/english/color');
const filipinoDir = path.join(__dirname, '../public/sounds/filipino/color');

cleanupDirectory(englishDir, 'English');
cleanupDirectory(filipinoDir, 'Filipino');

console.log('🎉 Color sound cleanup complete!');