@echo off
echo ========================================
echo Color Blending Game - Push Updates
echo ========================================
echo.
echo This script will push all color blending game updates to GitHub:
echo - ColorBlendingGame.vue component
echo - TTS sound files (58 MP3 files)
echo - Color blending icon (SVG)
echo - Route configuration
echo - Navigation updates
echo - Translation keys
echo - Documentation files
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo ERROR: Not in a git repository!
    echo Please run this from the edukiz project root directory.
    pause
    exit /b 1
)

echo Checking git status...
git status

echo.
echo Adding all color blending related files...

REM Add the main component
git add src/components/misc/ColorBlendingGame.vue
echo ✓ Added ColorBlendingGame.vue

REM Add route configuration
git add src/main.js
echo ✓ Added main.js (route configuration)

REM Add navigation updates
git add src/components/misc/MiscNavPage.vue
echo ✓ Added MiscNavPage.vue (navigation)

REM Add translations
git add src/utils/LanguageManager.js
echo ✓ Added LanguageManager.js (translations)

REM Add sound files
git add public/sounds/english/color/
git add public/sounds/filipino/color/
git add public/sounds/english/explanation/color_blending.mp3
git add public/sounds/filipino/explanation/color_blending.mp3
echo ✓ Added sound files (58 MP3 files)

REM Add game icon
git add public/img/games/ColorBlending.svg
echo ✓ Added ColorBlending.svg (game icon)

REM Add scripts
git add scripts/generate_color_sounds_fixed.js
git add scripts/generate_color_sounds_tts.js
git add scripts/generate_color_sounds.bat
git add scripts/generate_color_sounds.js
echo ✓ Added TTS generation scripts

REM Add documentation
git add COLOR_BLENDING_IMPLEMENTATION_SUMMARY.md
git add COLOR_SOUNDS_FIXED_SUMMARY.md
git add test-color-blending.html
git add test-color-game.bat
git add create-color-blending-icon.html
echo ✓ Added documentation files

echo.
echo Committing changes...
git commit -m "🎨 Add Color Blending Game with TTS sounds

Features:
- Complete color blending game with drag & drop
- 12 colors with English/Filipino sounds (24 files)
- 16 color mixing combinations with sounds (32 files)
- Color identification mini-game
- 4 difficulty levels
- Mobile-responsive design
- Custom SVG game icon
- Bilingual support (English/Filipino)
- TTS-generated sound effects (58 total files)

Technical:
- New route: /misc/color-blending
- Component: ColorBlendingGame.vue
- Sound generation scripts with Google TTS
- Updated navigation and translations
- No star system (as requested)

Files added:
- ColorBlendingGame.vue (main component)
- 58 MP3 sound files (colors + mixing + explanations)
- ColorBlending.svg (game icon)
- TTS generation scripts
- Documentation and test files"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Commit successful!
    echo.
    echo Pushing to GitHub...
    git push origin main
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo ✅ SUCCESS! Updates pushed to GitHub
        echo ========================================
        echo.
        echo Color Blending Game is now live with:
        echo ✓ Complete game functionality
        echo ✓ Real TTS sound effects (58 files)
        echo ✓ Custom game icon
        echo ✓ Bilingual support
        echo ✓ Mobile optimization
        echo.
        echo Access the game at: /misc/color-blending
        echo.
    ) else (
        echo.
        echo ❌ ERROR: Failed to push to GitHub
        echo Please check your internet connection and GitHub credentials.
        echo.
    )
) else (
    echo.
    echo ❌ ERROR: Commit failed
    echo Please check the git status and try again.
    echo.
)

echo Press any key to continue...
pause >nul