@echo off
echo ========================================
echo Pushing 502 Fix + New Domain Config
echo ========================================
echo.
echo New Railway Domain: brightkidz-production-43d4.up.railway.app
echo Custom Port: 3000
echo.

cd /d "%~dp0"

echo Configuring Git credentials...
git config user.name "makerlove1"
git config user.email "your-email@example.com"

echo.
echo Adding changes...
git add backend/server.js
git add .env.production
git add backend/.env.production
git add RAILWAY_TROUBLESHOOTING.md
git add 502_FIX_COMPLETE.md
git add push-502-fix.bat

echo.
echo Committing changes...
git commit -m "Fix 502: Listen on 0.0.0.0, update to new Railway domain"

echo.
echo Pushing to GitHub with token...
echo NOTE: Use your personal access token when prompted
git push origin main

echo.
echo ========================================
echo Done! Railway will auto-deploy.
echo ========================================
echo.
echo Next steps:
echo 1. Wait for Railway to redeploy (2-3 minutes)
echo 2. Test: https://brightkidz-production-43d4.up.railway.app/api/health
echo 3. Update Vercel environment variable:
echo    VUE_APP_API_URL=https://brightkidz-production-43d4.up.railway.app/api
echo 4. Redeploy Vercel frontend
echo.
pause
