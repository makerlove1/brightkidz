@echo off
echo ========================================
echo   Killing Process on Port 3000
echo ========================================
echo.

echo Finding process using port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Found process ID: %%a
    echo Killing process...
    taskkill /F /PID %%a
    if %ERRORLEVEL% EQU 0 (
        echo Process killed successfully!
    ) else (
        echo Failed to kill process or process not found.
    )
)

echo.
echo Port 3000 should now be free.
echo You can now run: npm start
echo.
pause
