@echo off
echo ========================================
echo Update Frontend API URL for Railway
echo ========================================
echo.

set /p RAILWAY_URL="Enter your Railway backend URL (e.g., https://edukiz-backend-production.railway.app): "

if "%RAILWAY_URL%"=="" (
    echo Error: No URL provided
    pause
    exit /b 1
)

echo.
echo Updating .env.production with Railway backend URL...
echo # Production Backend API URL > .env.production
echo VUE_APP_API_URL=%RAILWAY_URL%/api >> .env.production

echo.
echo ✅ Frontend configuration updated!
echo.
echo Updated file: .env.production
echo API URL: %RAILWAY_URL%/api
echo.
echo Next steps:
echo 1. Test your frontend locally: npm run serve
echo 2. Deploy to Vercel for production
echo 3. Verify API calls work with Railway backend
echo.

pause