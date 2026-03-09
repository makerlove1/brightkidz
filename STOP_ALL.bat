@echo off
echo ========================================
echo   Stopping All Edukiz Servers
echo ========================================
echo.

echo Stopping backend (port 3000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process ID: %%a
    taskkill /F /PID %%a
)

echo.
echo Stopping frontend (port 8080)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo Killing process ID: %%a
    taskkill /F /PID %%a
)

echo.
echo ========================================
echo   All servers stopped!
echo ========================================
echo.
pause
