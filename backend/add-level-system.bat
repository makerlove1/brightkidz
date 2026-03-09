@echo off
echo ========================================
echo Level System - Database Migration
echo ========================================
echo.

REM Load environment variables
if exist .env (
    echo Loading database configuration from .env...
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        if "%%a"=="DB_HOST" set DB_HOST=%%b
        if "%%a"=="DB_USER" set DB_USER=%%b
        if "%%a"=="DB_PASSWORD" set DB_PASSWORD=%%b
        if "%%a"=="DB_NAME" set DB_NAME=%%b
    )
) else (
    echo .env file not found, using defaults...
    set DB_HOST=localhost
    set DB_USER=root
    set DB_NAME=edukiz
)

echo Database: %DB_NAME%
echo Host: %DB_HOST%
echo User: %DB_USER%
echo.

REM Check if MySQL is available
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: MySQL command not found!
    echo Please ensure MySQL is installed and added to PATH.
    echo.
    pause
    exit /b 1
)

echo Running migration...
echo.

REM Run the migration
mysql -h %DB_HOST% -u %DB_USER% -p %DB_NAME% < migrations/add_level_system.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration completed successfully!
    echo ========================================
    echo.
    echo New tables created:
    echo   - user_levels
    echo   - level_history
    echo.
    echo Features:
    echo   - Infinite leveling system
    echo   - 10 stars per level
    echo   - Level up animations
    echo   - Milestone rewards
    echo   - Admin dashboard integration
    echo.
    echo You can now use the level system!
) else (
    echo.
    echo ========================================
    echo Migration failed!
    echo ========================================
    echo.
    echo Please check:
    echo   1. Database credentials in .env file
    echo   2. MySQL server is running
    echo   3. Database 'edukiz' exists
    echo   4. User has proper permissions
)

echo.
pause
