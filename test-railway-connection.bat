@echo off
echo ========================================
echo Testing Railway Database Connection
echo ========================================
echo.

cd backend

echo Loading production environment...
copy .env.production .env

echo.
echo Testing database connection and deploying schema...
npm run deploy-db

echo.
echo ========================================
echo If successful, your database is ready!
echo Next: Deploy backend to Railway
echo ========================================

pause