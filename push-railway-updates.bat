@echo off
echo ========================================
echo Pushing Railway Database Updates to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Setting up Git credentials...
git config user.name "EduKiz Developer"
git config user.email "developer@edukiz.com"

echo.
echo Adding all Railway deployment files...
git add .

echo.
echo Committing Railway database deployment...
git commit -m "feat: Railway database deployment complete

- Added Railway MySQL database configuration
- Created production environment files
- Added automated database deployment script
- Successfully deployed 14 tables with complete EduKiz schema
- Created admin user and tested connection
- Added comprehensive deployment guides and documentation

Database Features:
- User authentication and sessions
- Game progress tracking with BKT learning analytics
- Level system with stars and rewards
- Daily login streaks and rewards
- Multi-language support
- Admin dashboard functionality
- Complete learning management system

Files added:
- RAILWAY_DATABASE_DEPLOYMENT.md
- RAILWAY_QUICK_START.md
- RAILWAY_DEPLOYMENT_SUCCESS.md
- backend/.env.production
- backend/config/init-database-railway.sql
- backend/scripts/deploy-to-railway.js
- backend/railway.json
- test-railway-connection.bat"

echo.
echo Pushing to GitHub with personal access token...
git push origin main

echo.
echo ========================================
echo Railway Updates Pushed Successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Deploy backend to Railway from GitHub repo
echo 2. Set root directory to 'backend'
echo 3. Add environment variables in Railway dashboard
echo 4. Test your deployment
echo.

pause