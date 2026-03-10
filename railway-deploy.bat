@echo off
echo ========================================
echo Railway Database Deployment Helper
echo ========================================
echo.

echo This script will help you deploy your EduKiz database to Railway.
echo.

echo Step 1: Make sure you have:
echo - Created a Railway account at https://railway.app
echo - Deployed a MySQL database service
echo - Copied your database connection details
echo.

echo Step 2: Update your environment variables
echo - Copy backend/.env.production.template to backend/.env.production
echo - Fill in your Railway MySQL connection details
echo.

echo Step 3: Initialize your database
echo - Use Railway's Query tab to run backend/config/init-database.sql
echo - Or connect with a MySQL client using Railway credentials
echo.

echo Step 4: Deploy your backend
echo - Create a new Railway service from your GitHub repo
echo - Set the root directory to 'backend'
echo - Add your environment variables in Railway dashboard
echo.

echo Step 5: Test your deployment
echo - Visit your Railway backend URL + /api/health
echo - Should return: {"status":"OK","message":"Server is running"}
echo.

echo ========================================
echo Quick Commands:
echo ========================================
echo.

echo To create admin user after deployment:
echo npm run create-admin
echo.

echo To test database connection locally:
echo cd backend
echo npm start
echo.

echo ========================================
echo Need help? Check RAILWAY_DATABASE_DEPLOYMENT.md
echo ========================================

pause