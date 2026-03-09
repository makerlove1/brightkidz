@echo off
echo ========================================
echo Create Repository and Push to GitHub
echo ========================================
echo.

echo The repository might not exist yet. Let's create it first.
echo.

echo ========================================
echo STEP 1: Create Repository on GitHub
echo ========================================
echo.
echo 1. Go to: https://github.com/new
echo 2. Login as makerlove1 (jakeworks800@gmail.com)
echo 3. Repository name: brightkidz
echo 4. Description: EduKiz Educational Platform with Admin System
echo 5. Make it Public (recommended) or Private
echo 6. DO NOT initialize with README (we have our own files)
echo 7. Click "Create repository"
echo.

echo Opening GitHub new repository page...
start https://github.com/new
echo.
echo Press any key AFTER you've created the repository...
pause

echo.
echo ========================================
echo STEP 2: Push Your Code
echo ========================================
echo.

echo Method 1: Using personal access token
git remote set-url origin https://[YOUR_TOKEN]@github.com/makerlove1/brightkidz.git
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo 🎉 SUCCESS! Code uploaded to GitHub!
    echo ========================================
    echo.
    echo ✅ Repository: https://github.com/makerlove1/brightkidz
    echo ✅ All your EduKiz files are now on GitHub
    echo ✅ Ready for deployment!
    echo.
    echo ========================================
    echo NEXT STEPS - DEPLOY TO VERCEL:
    echo ========================================
    echo.
    echo 1. Go to: https://vercel.com
    echo 2. Sign up/Login with GitHub (makerlove1)
    echo 3. Import your brightkidz repository
    echo 4. Follow the deployment guide: DEPLOY_TO_VERCEL.md
    echo.
    echo 🚀 Your EduKiz platform will be live soon!
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ Still having issues
    echo ========================================
    echo.
    echo Let's try alternative method:
    echo.
    echo Option 1: GitHub Desktop (Easiest)
    echo 1. Download: https://desktop.github.com/
    echo 2. Login as makerlove1
    echo 3. Add local repository (this folder)
    echo 4. Publish repository
    echo.
    echo Option 2: Create with different name
    echo 1. Go to: https://github.com/new
    echo 2. Name: edukiz-admin (different name)
    echo 3. Try pushing again
    echo.
    start https://desktop.github.com/
)

echo.
pause