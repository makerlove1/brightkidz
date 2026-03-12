@echo off
echo ========================================
echo   EDUKIZ - Fresh Start
echo ========================================
echo.

echo Cleaning up any running servers...
echo.

REM Kill any process on port 3000 (backend)
echo [1/2] Stopping backend (port 3000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Kill any process on port 8080 (frontend)
echo [2/2] Stopping frontend (port 8080)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Waiting for ports to be released...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Starting Backend Server
echo ========================================
cd backend
start "Edukiz Backend" cmd /k "npm start"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

cd ..

echo.
echo ========================================
echo   Starting Frontend Server
echo ========================================
start "Edukiz Frontend" cmd /k "npm run serve"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:8080
echo.
echo Both servers are starting in separate windows.
echo Wait about 10-15 seconds for them to fully start.
echo.
echo Opening browser in 10 seconds...
timeout /t 10 /nobreak

start http://localhost:8080

echo.
echo ========================================
echo   System is running!
echo ========================================
echo.
echo To stop the servers:
echo   - Close the Backend and Frontend command windows
echo   - Or run STOP_ALL.bat
echo.
pause
