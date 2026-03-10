const fs = require('fs');
const path = require('path');
const gtts = require('gtts');

// Create directories if they don't exist
const englishDir = path.join(__dirname, '../public/sounds/english/explanation');
const filipinoDir = path.join(__dirname, '../public/sounds/filipino/explanation');

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

// Generate explanation files
async function generateExplanations() {
  console.log('Generating color identification explanation sounds...\n');
  
  try {
    // English explanation
    await generateTTS(
      "Welcome to Color Identification! Look at the color and choose the correct name from the options below. Click on a color to hear its name.",
      "color_identification",
      "en"
    );
    
    // Filipino explanation (using English TTS for better pronunciation)
    await generateTTS(
      "Maligayang pagdating sa Pagkilala sa Kulay! Tingnan ang kulay at piliin ang tamang pangalan mula sa mga pagpipilian sa ibaba. I-click ang kulay para marinig ang pangalan nito.",
      "color_identification",
      "en"
    );
    
    console.log('\n✅ Color identification explanation sounds generated!');
  } catch (error) {
    console.error('Failed to generate explanation sounds:', error);
  }
}

generateExplanations();