@echo off
echo Pushing Color Identification Game Fixes to GitHub...
echo.

cd /d "%~dp0"

echo Setting up Git credentials...
git config user.name "EduKiz Developer"
git config user.email "developer@edukiz.com"

echo Adding all changes...
git add .

echo Committing changes...
git commit -m "Fix Color Identification Game: translation errors, 12 color wheel colors, missing sounds"

echo Pushing to GitHub...
git push origin main

echo.
echo ✅ Color Identification Game fixes pushed to GitHub!
echo.
echo Changes pushed:
echo - Fixed translation mixin import and $t() function calls
echo - Updated to use exactly 12 color wheel colors
echo - Fixed sound implementation to match working ColorBlendingGame
echo - Generated missing color_identification.mp3 explanation sound
echo - Generated all 12 color wheel sound files
echo.
pause