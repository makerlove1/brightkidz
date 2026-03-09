@echo off
echo ========================================
echo Push to GitHub as makerlove1
echo ========================================
echo.

echo ✅ Git account changed to: makerlove1
echo ✅ Remote URL set to: https://github.com/makerlove1/brightkidz.git
echo.

echo ========================================
echo STEP 1: Create Personal Access Token
echo ========================================
echo.
echo 1. Login to GitHub as makerlove1
echo 2. Go to: https://github.com/settings/tokens
echo 3. Click "Generate new token (classic)"
echo 4. Select scopes: repo, workflow
echo 5. Copy the token
echo.

echo Opening GitHub tokens page...
start https://github.com/settings/tokens
echo.

pause
echo.

echo ========================================
echo STEP 2: Push to GitHub
echo ========================================
echo.
echo When prompted for credentials:
echo Username: makerlove1
echo Password: [PASTE YOUR TOKEN HERE]
echo.

echo Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ SUCCESS! 
    echo ========================================
    echo.
    echo Your code is now uploaded to:
    echo https://github.com/makerlove1/brightkidz
    echo.
    echo Next steps:
    echo 1. Verify upload at GitHub
    echo 2. Deploy to Vercel (follow DEPLOY_TO_VERCEL.md)
    echo 3. Deploy backend to Railway
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ Push failed
    echo ========================================
    echo.
    echo Possible solutions:
    echo 1. Make sure you used the Personal Access Token (not password)
    echo 2. Check if brightkidz repository exists under makerlove1
    echo 3. Try GitHub Desktop instead
    echo.
    echo Alternative: Use GitHub Desktop
    echo Download: https://desktop.github.com/
    echo.
)

pause