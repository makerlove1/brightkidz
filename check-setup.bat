@echo off
echo ========================================
echo EduKiz Admin System - Setup Checker
echo ========================================
echo.

set ERRORS=0

echo Checking Backend...
echo -------------------
if exist "backend\node_modules\" (
    echo [OK] Backend dependencies installed
) else (
    echo [ERROR] Backend dependencies not installed
    echo        Run: cd backend ^&^& npm install
    set /a ERRORS+=1
)

if exist "backend\.env" (
    echo [OK] Backend .env file exists
) else (
    echo [ERROR] Backend .env file missing
    set /a ERRORS+=1
)

if exist "backend\server.js" (
    echo [OK] Backend server file exists
) else (
    echo [ERROR] Backend server.js missing
    set /a ERRORS+=1
)

echo.
echo Checking Frontend...
echo -------------------
if exist "node_modules\" (
    echo [OK] Frontend dependencies installed
) else (
    echo [ERROR] Frontend dependencies not installed
    echo        Run: npm install
    set /a ERRORS+=1
)

if exist ".env" (
    echo [OK] Frontend .env file exists
) else (
    echo [ERROR] Frontend .env file missing
    set /a ERRORS+=1
)

if exist "src\services\authService.js" (
    echo [OK] Auth service exists
) else (
    echo [ERROR] Auth service missing
    set /a ERRORS+=1
)

echo.
echo Checking Laragon/MySQL...
echo -------------------------
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL is running
) else (
    echo [WARNING] MySQL is not running
    echo           Start Laragon to run MySQL
    set /a ERRORS+=1
)

echo.
echo Checking Database...
echo -------------------
echo [INFO] To verify database setup:
echo        1. Open Laragon ^> Database ^> Open
echo        2. Check if 'edukiz' database exists
echo        3. Check if tables exist: users, user_sessions, user_progress, game_statistics
echo.

echo ========================================
echo Summary
echo ========================================
if %ERRORS%==0 (
    echo [SUCCESS] All checks passed!
    echo.
    echo Next steps:
    echo 1. Verify database is set up ^(see above^)
    echo 2. Run: start-admin-system.bat
    echo 3. Open: http://localhost:8080/#/login
) else (
    echo [FAILED] Found %ERRORS% issue^(s^)
    echo.
    echo Please fix the issues above and run this script again.
    echo For help, see ADMIN_SETUP_GUIDE.md
)
echo.
pause
