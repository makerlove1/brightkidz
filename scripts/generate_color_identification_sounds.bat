@echo off
echo Generating Color Identification Sounds...
echo.

cd /d "%~dp0"
node generate_color_identification_sounds.js

echo.
echo Sound generation complete!
pause