@echo off
echo ========================================
echo   Restarting Backend Server
echo ========================================
echo.

echo Step 1: Killing any process on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process ID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo Step 2: Waiting for port to be released...
timeout /t 2 /nobreak >nul

echo Step 3: Starting backend server...
cd backend
start "Edukiz Backend" cmd /k "npm start"

echo.
echo ========================================
echo   Backend server is starting...
echo ========================================
echo.
echo Backend will be available at: http://localhost:3000
echo.
echo Check the new window for server status.
echo.
pause
