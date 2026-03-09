@echo off
echo ========================================
echo EduKiz Admin System Setup
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend installation failed!
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

echo Step 2: Installing Frontend Dependencies...
cd ..
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend installation failed!
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

echo Step 3: Database Setup
echo ========================================
echo Please complete these steps manually:
echo.
echo 1. Start Laragon (if not already running)
echo 2. Open HeidiSQL or phpMyAdmin from Laragon
echo 3. Run the SQL script: backend/config/init-database.sql
echo 4. After running the script, press any key to continue...
echo.
pause

echo.
echo Step 4: Creating Admin User...
cd backend
call npm run create-admin
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Admin user creation failed!
    echo Make sure the database is set up correctly.
    pause
    exit /b 1
)
cd ..
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Run 'start-admin-system.bat' to start both servers
echo 2. Open http://localhost:8080/#/login
echo 3. Login with:
echo    Username: admin
echo    Password: admin123
echo.
echo For detailed documentation, see ADMIN_SETUP_GUIDE.md
echo.
pause
