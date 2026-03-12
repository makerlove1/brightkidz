@echo off
echo ========================================
echo Push EduKiz to GitHub (makerlove1)
echo ========================================
echo.

echo ✅ Current Configuration:
echo Username: makerlove1
echo Email: jakeworks800@gmail.com
echo Repository: https://github.com/makerlove1/brightkidz.git
echo.

echo ========================================
echo STEP 1: Get Personal Access Token
echo ========================================
echo.
echo 1. Login to GitHub as makerlove1 (jakeworks800@gmail.com)
echo 2. Go to: https://github.com/settings/tokens
echo 3. Click "Generate new token (classic)"
echo 4. Name: "EduKiz Upload"
echo 5. Select scopes: ✓ repo, ✓ workflow
echo 6. Click "Generate token"
echo 7. COPY THE TOKEN (you won't see it again!)
echo.

echo Opening GitHub tokens page...
start https://github.com/settings/tokens
echo.
echo Press any key after you have your token ready...
pause

echo.
echo ========================================
echo STEP 2: Push to GitHub
echo ========================================
echo.
echo When Git asks for credentials:
echo Username: makerlove1
echo Password: [PASTE YOUR PERSONAL ACCESS TOKEN]
echo.
echo Pushing to GitHub...
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo 🎉 SUCCESS! Your code is on GitHub!
    echo ========================================
    echo.
    echo ✅ Repository: https://github.com/makerlove1/brightkidz
    echo ✅ All files uploaded successfully
    echo ✅ Ready for deployment!
    echo.
    echo ========================================
    echo NEXT STEPS:
    echo ========================================
    echo.
    echo 1. Verify upload: https://github.com/makerlove1/brightkidz
    echo 2. Deploy to Vercel: Follow DEPLOY_TO_VERCEL.md
    echo 3. Deploy backend to Railway
    echo 4. Your app will be live!
    echo.
    echo 🚀 Ready to deploy your amazing EduKiz platform!
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ Upload Failed
    echo ========================================
    echo.
    echo Common solutions:
    echo 1. Make sure you used Personal Access Token (not password)
    echo 2. Check if makerlove1 account exists
    echo 3. Verify brightkidz repository exists
    echo 4. Try GitHub Desktop: https://desktop.github.com/
    echo.
    echo Alternative: Create new repository
    echo Go to: https://github.com/new
    echo Name: brightkidz-admin
    echo Then run this script again
    echo.
)

echo.
pause