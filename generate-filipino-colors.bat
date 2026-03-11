@echo off
echo Generating Filipino color sounds for ColorBlendingGame...

cd /d "%~dp0"

echo Installing dependencies...
npm install google-tts-api

echo Running Filipino color sound generator...
node scripts/generate_filipino_color_sounds.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Successfully generated Filipino color sounds!
    echo Files created in: public/sounds/filipino/color/
    echo.
    echo The ColorBlendingGame should now work properly in Filipino language.
) else (
    echo.
    echo ❌ Failed to generate some color sounds
    echo Please check the error messages above
)

pause