# BrightKidz Mobile App Installation Guide

## ✅ Setup Complete!

BrightKidz is now configured as a mobile app using Capacitor! You can install it on Android and iOS devices.

---

## 📱 What Was Added

### 1. Capacitor Framework
- **@capacitor/core** - Core Capacitor functionality
- **@capacitor/cli** - Command-line tools
- **@capacitor/android** - Android platform support
- **@capacitor/ios** - iOS platform support (ready to add)

### 2. Configuration Files
- **capacitor.config.json** - Main Capacitor configuration
- **android/** - Native Android project folder

### 3. App Details
- **App Name**: BrightKidz
- **App ID**: com.brightkidz.app
- **Platform**: Android (iOS ready to add)

---

## 🚀 Building the Android App

### Prerequisites
1. **Android Studio** - Download from https://developer.android.com/studio
2. **Java JDK** - Version 11 or higher
3. **Node.js** - Already installed

### Build Steps

#### Step 1: Build the Web App
```bash
cd edukiz
npm run build
```

#### Step 2: Sync with Capacitor
```bash
npx cap sync
```

#### Step 3: Open in Android Studio
```bash
npx cap open android
```

This will open Android Studio with your project.

#### Step 4: Build APK in Android Studio
1. Wait for Gradle sync to complete
2. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build to complete
4. Click **locate** to find the APK file
5. APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📲 Installing on Android Device

### Method 1: Direct Install (USB)
1. Enable **Developer Options** on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
2. Enable **USB Debugging**:
   - Settings → Developer Options → USB Debugging
3. Connect device to computer via USB
4. In Android Studio, click **Run** (green play button)
5. Select your device from the list
6. App will install and launch automatically

### Method 2: APK File Transfer
1. Build the APK (see Step 4 above)
2. Transfer APK to your phone:
   - Email it to yourself
   - Use Google Drive
   - Use USB cable to copy
   - Use ADB: `adb install app-debug.apk`
3. On your phone:
   - Enable "Install from Unknown Sources"
   - Open the APK file
   - Tap "Install"

### Method 3: Using ADB (Android Debug Bridge)
```bash
# Install ADB if not already installed
# Then run:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🍎 Building for iOS (Optional)

### Prerequisites
1. **macOS** - Required for iOS development
2. **Xcode** - Download from Mac App Store
3. **Apple Developer Account** - For device testing

### Steps
```bash
# Add iOS platform
npx cap add ios

# Build web app
npm run build

# Sync with Capacitor
npx cap sync

# Open in Xcode
npx cap open ios
```

Then build and run from Xcode.

---

## 🔧 Development Workflow

### Making Changes
1. **Edit your code** in the `src/` folder
2. **Build**: `npm run build`
3. **Sync**: `npx cap sync`
4. **Run**: `npx cap open android` (or `ios`)

### Live Reload (Development)
```bash
# Start dev server
npm run serve

# In capacitor.config.json, add:
{
  "server": {
    "url": "http://192.168.0.10:8080",
    "cleartext": true
  }
}

# Sync and run
npx cap sync
npx cap open android
```

The app will now reload automatically when you make changes!

---

## 📦 Creating Release APK

### Step 1: Generate Signing Key
```bash
keytool -genkey -v -keystore brightkidz-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias brightkidz
```

### Step 2: Configure Signing
Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../../brightkidz-release-key.jks')
            storePassword 'your-password'
            keyAlias 'brightkidz'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Build Release APK
In Android Studio:
1. **Build** → **Generate Signed Bundle / APK**
2. Select **APK**
3. Choose your keystore file
4. Enter passwords
5. Select **release** build variant
6. Click **Finish**

Release APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🎨 App Icon and Splash Screen

### App Icon
1. Create icon images (512x512 PNG recommended)
2. Use Android Studio's Image Asset Studio:
   - Right-click `android/app/src/main/res`
   - New → Image Asset
   - Follow wizard

### Splash Screen
1. Create splash screen image
2. Place in `android/app/src/main/res/drawable/`
3. Configure in `capacitor.config.json`:

```json
{
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#667eea",
      "androidSplashResourceName": "splash",
      "showSpinner": false
    }
  }
}
```

---

## 📱 App Permissions

The app currently uses these permissions (automatically added):
- **INTERNET** - For loading web content
- **ACCESS_NETWORK_STATE** - For checking connectivity

To add more permissions, edit `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

---

## 🔍 Troubleshooting

### Build Fails
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run build
npx cap sync
```

### App Won't Install
- Check if "Install from Unknown Sources" is enabled
- Uninstall old version first
- Check device storage space

### App Crashes
- Check Android Studio Logcat for errors
- Ensure all assets are in `dist/` folder
- Run `npx cap sync` after changes

### White Screen on Launch
- Check if `dist/` folder exists
- Run `npm run build` first
- Check browser console in Android Studio

---

## 📊 App Size Optimization

### Reduce APK Size
1. **Remove unused assets**:
   - Delete unused images
   - Optimize image sizes
   - Use WebP format

2. **Enable ProGuard** (in `build.gradle`):
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
    }
}
```

3. **Split APKs by architecture**:
```gradle
android {
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a'
        }
    }
}
```

---

## 🚀 Publishing to Google Play Store

### Prerequisites
1. Google Play Developer Account ($25 one-time fee)
2. Release APK or AAB (Android App Bundle)
3. App icon, screenshots, description

### Steps
1. **Create App Bundle** (recommended over APK):
   ```bash
   # In Android Studio
   Build → Generate Signed Bundle / APK → Android App Bundle
   ```

2. **Go to Google Play Console**:
   - https://play.google.com/console

3. **Create New App**:
   - Fill in app details
   - Upload screenshots
   - Write description
   - Set content rating
   - Upload AAB file

4. **Submit for Review**:
   - Review can take 1-7 days
   - Fix any issues reported
   - App goes live after approval

---

## 📝 Quick Commands Reference

```bash
# Build web app
npm run build

# Sync with native projects
npx cap sync

# Open Android Studio
npx cap open android

# Open Xcode (macOS only)
npx cap open ios

# Add platforms
npx cap add android
npx cap add ios

# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest
npx cap sync

# Run on device
npx cap run android
npx cap run ios

# Check Capacitor doctor
npx cap doctor
```

---

## 🎯 Current Status

### ✅ Completed
- [x] Capacitor installed and configured
- [x] Android platform added
- [x] Web app built successfully
- [x] Synced with Capacitor
- [x] Ready to open in Android Studio

### ⚠️ Next Steps
1. Open in Android Studio: `npx cap open android`
2. Build APK
3. Install on device
4. Test functionality
5. Create app icon
6. Add splash screen
7. Build release version
8. Publish to Play Store (optional)

---

## 📞 Support

### Resources
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Studio**: https://developer.android.com/studio
- **Vue.js**: https://vuejs.org/
- **BrightKidz Docs**: See other .md files in this project

### Common Issues
- **Gradle sync fails**: Update Android Studio and Gradle
- **Build errors**: Check Java version (needs JDK 11+)
- **App crashes**: Check Logcat in Android Studio
- **White screen**: Ensure `npm run build` was run

---

## 🎉 Success!

Your BrightKidz app is now ready to be installed on mobile devices!

**Next Command:**
```bash
npx cap open android
```

This will open Android Studio where you can build and run the app on your device or emulator.

---

**Setup Date**: November 23, 2025
**Status**: ✅ Ready for Mobile
**Platform**: Android (iOS ready to add)
**App Name**: BrightKidz
**App ID**: com.brightkidz.app
