const fs = require('fs');
const path = require('path');

// All 12 colors
const colors = [
  { id: "red", hex: "#FF0000", name: "Red" },
  { id: "blue", hex: "#0000FF", name: "Blue" },
  { id: "yellow", hex: "#FFFF00", name: "Yellow" },
  { id: "green", hex: "#00FF00", name: "Green" },
  { id: "orange", hex: "#FFA500", name: "Orange" },
  { id: "purple", hex: "#800080", name: "Purple" },
  { id: "pink", hex: "#FFC0CB", name: "Pink" },
  { id: "brown", hex: "#A52A2A", name: "Brown" },
  { id: "black", hex: "#000000", name: "Black" },
  { id: "white", hex: "#FFFFFF", name: "White" },
  { id: "cyan", hex: "#00FFFF", name: "Cyan" },
  { id: "magenta", hex: "#FF00FF", name: "Magenta" }
];

// Mixed colors (common combinations)
const mixedColors = [
  { id: "purple_mixed", hex: "#800080", name: "Purple (Mixed)" },
  { id: "orange_mixed", hex: "#FFA500", name: "Orange (Mixed)" },
  { id: "green_mixed", hex: "#00FF00", name: "Green (Mixed)" },
  { id: "brown_mixed", hex: "#8B4513", name: "Brown (Mixed)" },
  { id: "gray_mixed", hex: "#808080", name: "Gray (Mixed)" },
  { id: "olive_mixed", hex: "#808000", name: "Olive (Mixed)" },
  { id: "navy_mixed", hex: "#000080", name: "Navy (Mixed)" },
  { id: "hot_pink_mixed", hex: "#FF69B4", name: "Hot Pink (Mixed)" },
  { id: "indigo_mixed", hex: "#4B0082", name: "Indigo (Mixed)" },
  { id: "light_green_mixed", hex: "#9AFF9A", name: "Light Green (Mixed)" }
];

// Create colors directory
const colorsDir = path.join(__dirname, '../public/img/colors');
if (!fs.existsSync(colorsDir)) {
  fs.mkdirSync(colorsDir, { recursive: true });
}

// Function to generate SVG for a color
function generateColorSVG(color, isMixed = false) {
  const strokeColor = color.hex === "#FFFFFF" ? "#CCCCCC" : "#FFFFFF";
  const textColor = color.hex === "#FFFFFF" || color.hex === "#FFFF00" || color.hex === "#FFC0CB" ? "#333333" : "#FFFFFF";
  
  // Create different shapes for variety
  const shapes = [
    // Circle
    `<circle cx="100" cy="100" r="80" fill="${color.hex}" stroke="${strokeColor}" stroke-width="4"/>`,
    // Square with rounded corners
    `<rect x="20" y="20" width="160" height="160" rx="20" fill="${color.hex}" stroke="${strokeColor}" stroke-width="4"/>`,
    // Star shape
    `<polygon points="100,20 120,70 170,70 130,110 150,160 100,130 50,160 70,110 30,70 80,70" fill="${color.hex}" stroke="${strokeColor}" stroke-width="4"/>`,
    // Heart shape
    `<path d="M100,180 C100,180 20,120 20,80 C20,50 50,20 80,20 C90,20 100,30 100,30 C100,30 110,20 120,20 C150,20 180,50 180,80 C180,120 100,180 100,180 Z" fill="${color.hex}" stroke="${strokeColor}" stroke-width="4"/>`,
    // Diamond
    `<polygon points="100,20 170,100 100,180 30,100" fill="${color.hex}" stroke="${strokeColor}" stroke-width="4"/>`
  ];
  
  // Use different shapes for different colors
  const allColorsList = [...colors, ...mixedColors];
  const shapeIndex = allColorsList.findIndex(c => c.id === color.id) % shapes.length;
  const shape = shapes[shapeIndex] || shapes[0]; // Fallback to first shape if not found
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
    <linearGradient id="gradient_${color.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color.hex};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustBrightness(color.hex, -20)};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle for better visibility -->
  <circle cx="100" cy="100" r="95" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  
  <!-- Main shape with gradient -->
  ${shape.replace(`fill="${color.hex}"`, `fill="url(#gradient_${color.id})"`)}
  
  <!-- Color name text -->
  <text x="100" y="100" text-anchor="middle" dominant-baseline="middle" 
        font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
        fill="${textColor}" stroke="rgba(0,0,0,0.5)" stroke-width="0.5">
    ${color.name}
  </text>
  
  ${isMixed ? `
  <!-- Mixed indicator -->
  <circle cx="170" cy="30" r="15" fill="rgba(255,255,255,0.9)" stroke="#333" stroke-width="2"/>
  <text x="170" y="30" text-anchor="middle" dominant-baseline="middle" 
        font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#333">
    MIX
  </text>
  ` : ''}
</svg>`;

  return svg;
}

// Function to adjust color brightness
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Generate individual color images
console.log('Generating individual color images...');
colors.forEach(color => {
  const svg = generateColorSVG(color, false);
  const filePath = path.join(colorsDir, `${color.id}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`✓ Generated: ${color.id}.svg`);
});

// Generate mixed color images
console.log('\nGenerating mixed color images...');
mixedColors.forEach(color => {
  const svg = generateColorSVG(color, true);
  const filePath = path.join(colorsDir, `${color.id}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`✓ Generated: ${color.id}.svg`);
});

// Create a color palette image showing all colors
console.log('\nGenerating color palette...');
const paletteWidth = 800;
const paletteHeight = 400;
const cols = 6;
const rows = 2;
const cellWidth = paletteWidth / cols;
const cellHeight = paletteHeight / rows;

let paletteSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${paletteWidth}" height="${paletteHeight}" viewBox="0 0 ${paletteWidth} ${paletteHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${paletteWidth}" height="${paletteHeight}" fill="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"/>
  
`;

colors.forEach((color, index) => {
  const col = index % cols;
  const row = Math.floor(index / cols);
  const x = col * cellWidth + cellWidth * 0.1;
  const y = row * cellHeight + cellHeight * 0.1;
  const width = cellWidth * 0.8;
  const height = cellHeight * 0.8;
  const textColor = color.hex === "#FFFFFF" || color.hex === "#FFFF00" || color.hex === "#FFC0CB" ? "#333333" : "#FFFFFF";
  
  paletteSVG += `
  <!-- ${color.name} -->
  <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="10" 
        fill="${color.hex}" stroke="#FFFFFF" stroke-width="3" filter="url(#shadow)"/>
  <text x="${x + width/2}" y="${y + height/2}" text-anchor="middle" dominant-baseline="middle" 
        font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
        fill="${textColor}" stroke="rgba(0,0,0,0.5)" stroke-width="0.5">
    ${color.name}
  </text>
  `;
});

paletteSVG += '</svg>';

const paletteFilePath = path.join(colorsDir, 'color_palette.svg');
fs.writeFileSync(paletteFilePath, paletteSVG);
console.log('✓ Generated: color_palette.svg');

console.log(`\n✅ Color image generation complete!`);
console.log(`Generated ${colors.length + mixedColors.length + 1} images in ${colorsDir}`);