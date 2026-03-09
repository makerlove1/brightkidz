const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'routes/streaks.js',
  'routes/bkt.js', 
  'routes/preferences.js',
  'routes/gameLevels.js'
];

console.log('Fixing req.user.id references to req.userId...\n');

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace req.user.id with req.userId
  content = content.replace(/req\.user\.id/g, 'req.userId');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`ℹ No changes needed: ${file}`);
  }
});

console.log('\n✅ All files have been checked and fixed if needed.');
console.log('\nImportant: The auth middleware sets req.userId, not req.user.id');
console.log('Make sure to restart the backend server after making these changes.');