@echo off
echo ========================================
echo GitHub Upload Helper
echo ========================================
echo.

echo Current Git Configuration:
git config --global user.name
git config --global user.email
echo.

echo Repository Status:
git remote -v
echo.

echo ========================================
echo Choose Upload Method:
echo ========================================
echo.
echo 1. Use makerlove1 account (current)
echo 2. Use GitHub Desktop
echo 4. Show help
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto use_current
if "%choice%"=="2" goto use_token
if "%choice%"=="3" goto github_desktop
if "%choice%"=="4" goto show_help

:use_current
echo.
echo ========================================
echo Using Current Account (makerlove1)
echo ========================================
echo.
echo IMPORTANT: You need to create 'brightkidz' repository first!
echo Go to: https://github.com/new
echo Repository name: brightkidz
echo.
pause
echo.
echo Updating remote URL...
git remote set-url origin https://github.com/makerlove1/brightkidz.git
echo.
echo Pushing to GitHub...
git push -u origin main
goto end

:use_token
echo.
echo ========================================
echo Using makerlove1 Account with Token
echo ========================================
echo.
echo 1. Go to: https://github.com/settings/tokens
echo 2. Generate new token (classic)
echo 3. Select 'repo' permissions
echo 4. Copy the token
echo.
set /p token="Paste your token here: "
echo.
echo Pushing with token...
git push https://%token%@github.com/makerlove1/brightkidz.git main
goto end

:github_desktop
echo.
echo ========================================
echo Opening GitHub Desktop
echo ========================================
echo.
echo 1. Download from: https://desktop.github.com/
echo 2. Install and sign in with correct account
echo 3. Add local repository (this folder)
echo 4. Publish repository
echo.
start https://desktop.github.com/
goto end

:show_help
echo.
echo ========================================
echo Help Information
echo ========================================
echo.
echo Account configured correctly for makerlove1
echo.
echo Files to read:
echo - FIX_GITHUB_AUTH.md
echo - PUSH_TO_EXISTING_REPO.md
echo.
pause
goto end

:end
echo.
echo ========================================
echo Next Steps After Upload:
echo ========================================
echo.
echo 1. Verify upload at GitHub
echo 2. Follow DEPLOY_TO_VERCEL.md
echo 3. Deploy to Vercel + Railway
echo.
pause