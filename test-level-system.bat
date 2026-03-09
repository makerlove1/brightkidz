@echo off
echo ========================================
echo  Level System Test Script
echo ========================================
echo.
echo This script will help you test the level system
echo.

cd backend

echo.
echo Testing database connection...
node -e "const {testConnection} = require('./config/database'); testConnection().then(connected => { if(connected) { console.log('✓ Database connected'); process.exit(0); } else { console.log('✗ Database connection failed'); process.exit(1); } });"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Database connection failed. Please check your configuration.
    cd ..
    pause
    exit /b 1
)

echo.
echo Checking if new tables exist...
mysql -u root -p -e "USE edukiz_db; SHOW TABLES LIKE 'user_preferences'; SHOW TABLES LIKE 'bkt_skills'; SHOW TABLES LIKE 'bkt_history'; SHOW TABLES LIKE 'game_levels';"

echo.
echo Checking user_levels table structure...
mysql -u root -p -e "USE edukiz_db; DESCRIBE user_levels;"

echo.
echo ========================================
echo  Manual Testing Steps
echo ========================================
echo.
echo 1. Start the backend server (npm start)
echo 2. Start the frontend (npm run serve)
echo 3. Log in as a user
echo 4. Complete a game that awards stars
echo 5. Verify:
echo    - Star count increases in header
echo    - Progress bar updates
echo    - Level increases after 10 stars
echo    - Level up modal appears
echo.
echo 6. Test preferences:
echo    - Change language
echo    - Refresh page
echo    - Verify language persists
echo.
echo 7. Test game progress:
echo    - Play CalculateNumbers0To18
echo    - Complete levels
echo    - Refresh page
echo    - Verify progress persists
echo.

cd ..
pause
