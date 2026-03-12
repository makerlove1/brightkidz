@echo off
echo ========================================
echo GitHub Upload Script
echo Repository: YoungMind
echo ========================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

echo Step 1: Initializing Git repository...
git init

echo.
echo Step 2: Adding remote repository...
git remote add origin https://github.com/Mic043-panget/YoungMind.git

echo.
echo Step 3: Adding all files...
git add .

echo.
echo Step 4: Creating commit...
git commit -m "Initial commit: Edukiz Educational Games with BKT Algorithm"

echo.
echo Step 5: Setting branch to main...
git branch -M main

echo.
echo Step 6: Pushing to GitHub...
echo (You may be asked for GitHub credentials)
git push -u origin main

echo.
echo ========================================
echo Upload Complete!
echo ========================================
echo.
echo Visit: https://github.com/Mic043-panget/YoungMind
echo.
pause
