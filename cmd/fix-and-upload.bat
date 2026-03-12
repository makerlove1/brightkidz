@echo off
echo ========================================
echo Fix Git Configuration and Upload
echo ========================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

echo Step 1: Configuring Git identity...
git config user.email "mic043panget@gmail.com"
git config user.name "Mic043-panget"
echo ✓ Git identity configured

echo.
echo Step 2: Removing old remote...
git remote remove origin
echo ✓ Old remote removed

echo.
echo Step 3: Adding correct remote...
git remote add origin https://github.com/Mic043-panget/YoungMind.git
echo ✓ New remote added

echo.
echo Step 4: Verifying remote...
git remote -v

echo.
echo Step 5: Adding all files...
git add .
echo ✓ Files added

echo.
echo Step 6: Creating commit...
git commit -m "Initial commit: Edukiz Educational Games with BKT Algorithm"
echo ✓ Commit created

echo.
echo Step 7: Setting branch to main...
git branch -M main
echo ✓ Branch set to main

echo.
echo Step 8: Pushing to GitHub...
echo (You will be asked for GitHub credentials)
echo Username: Mic043-panget
echo Password: Use your Personal Access Token
echo.
git push -u origin main

echo.
echo ========================================
echo Upload Complete!
echo ========================================
echo.
echo Visit: https://github.com/Mic043-panget/YoungMind
echo.
pause
