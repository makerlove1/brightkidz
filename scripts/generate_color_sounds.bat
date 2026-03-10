@echo off
echo ========================================
echo Color Sound Generator with TTS
echo ========================================
echo.
echo This script will generate MP3 sound files for:
echo - 12 individual colors (English + Filipino)
echo - 16 mixed color combinations (English + Filipino)
echo - Explanation sounds (English + Filipino)
echo.
echo Total: 58 MP3 files
echo.
echo Checking dependencies...
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node-gtts is installed
node -e "require('node-gtts')" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo node-gtts is not installed. Installing now...
    echo.
    call npm install node-gtts
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install node-gtts
        pause
        exit /b 1
    )
)

echo.
echo Starting sound generation...
echo.

REM Run the script
node "%~dp0generate_color_sounds_fixed.js"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! All color sounds generated.
    echo ========================================
    echo.
    echo Sound files are located in:
    echo   public/sounds/english/color/
    echo   public/sounds/filipino/color/
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Sound generation failed!
    echo ========================================
    echo.
)

pause
