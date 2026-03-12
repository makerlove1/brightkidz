# Edukiz Setup & Updates

## Project Overview
Edukiz is an educational game platform built with Vue 3, designed for children to learn through interactive games including memory games, drag-and-drop activities, and more.

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (v10.8.2 or higher)

### Installation Steps
```bash
cd edukiz
npm install --legacy-peer-deps
```

### Running the Application
```bash
npm run serve
```
The app will be available at: http://localhost:8080

### Building for Production
```bash
npm run build
```

## Updates Made

### 1. Dependencies Updated
- **Vue**: Updated to latest version (3.5.13)
- **Vue Router**: Updated to latest version (4.5.0)
- **@vue/cli-service**: Updated to latest version (5.0.8)
- **@vue/cli-plugin-pwa**: Updated to latest version (5.0.8)

### 2. Configuration Fixes
- Added `transpileDependencies: []` to `vue.config.js` to fix compatibility issues with newer Vue CLI

### 3. Design Improvements

#### Color Scheme
- **Old**: Dark gray background (#37373e) with blue buttons (#4385f4)
- **New**: Modern purple gradient background (linear-gradient from #667eea to #764ba2)

#### UI Enhancements
- **Buttons**: 
  - Added gradient backgrounds with smooth transitions
  - Increased border radius from 5pt to 12pt for modern look
  - Added box shadows for depth (0 4px 15px rgba(0, 0, 0, 0.2))
  - Hover effects with transform and enhanced shadows
  - Smooth 0.3s transitions on all interactions

- **Header & Footer**:
  - Added glassmorphism effect with backdrop blur
  - Semi-transparent white background (rgba(255, 255, 255, 0.1))
  - Rounded corners (15px border-radius)
  - Subtle shadows for depth

- **Link Tiles**:
  - Enhanced text with bold font and text shadows
  - Increased font size from 1.05rem to 1.3rem
  - Added hover animations (scale and lift effect)
  - Active state feedback with scale down

- **Animations**:
  - Updated highlight animation with modern gradient transitions
  - Added scale effects for better visual feedback
  - Smooth color transitions throughout

#### Typography
- Added text shadows for better readability on gradient backgrounds
- Increased font weights for better hierarchy
- Enhanced contrast for accessibility

## Database Note
This is a frontend-only application with no backend or database requirements. All data is stored in browser localStorage.

## Browser Compatibility
- Modern browsers with ES6+ support
- Progressive Web App (PWA) enabled for offline functionality

## Known Issues
- Some deprecation warnings in dependencies (non-critical)
- Engine warnings due to Node.js version mismatch (app works fine)

## Future Improvements
- Consider migrating to Vite for faster build times
- Update remaining deprecated dependencies
- Add TypeScript support
- Implement backend API for cross-device progress sync
