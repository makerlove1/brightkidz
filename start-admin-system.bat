@echo off
echo ========================================
echo EduKiz Admin System Startup
echo ========================================
echo.

echo Checking if Laragon MySQL is running...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL is running
) else (
    echo [WARNING] MySQL is not running. Please start Laragon first!
    echo.
    pause
    exit /b 1
)

echo.
echo Starting Backend Server...
start "EduKiz Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
start "EduKiz Frontend" cmd /k "npm run serve"

echo.
echo ========================================
echo Servers are starting...
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:8080
echo Admin:    http://localhost:8080/#/admin
echo.
echo Default Admin Login:
echo   Username: admin
echo   Password: admin123
echo.
echo Press any key to close this window...
pause >nul
