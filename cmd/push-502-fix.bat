@echo off
echo ========================================
echo Pushing 502 Bad Gateway Fix to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Adding changes...
git add backend/server.js
git add RAILWAY_TROUBLESHOOTING.md

echo.
echo Committing changes...
git commit -m "Fix 502 Bad Gateway: Listen on 0.0.0.0 instead of localhost"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo Done! Railway will auto-deploy the fix.
echo ========================================
echo.
echo Next steps:
echo 1. Wait for Railway to redeploy (2-3 minutes)
echo 2. Test: https://brightkidz-production-b46c.up.railway.app/api/health
echo 3. Should return: {"status":"OK","message":"Server is running"}
echo.
pause
