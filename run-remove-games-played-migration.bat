@echo off
echo ========================================
echo Remove Games Played Migration
echo ========================================
echo.
echo This will remove the games_played tracking from the database.
echo The pointing system uses stars instead.
echo.
pause

cd backend

echo Running migration...
mysql -u root -p edukiz < migrations/remove_games_played.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration completed successfully!
    echo ========================================
    echo.
    echo Changes made:
    echo - Removed total_games_played column from game_statistics table
    echo - Updated user_progress_summary view
    echo - Pointing system now uses stars only
    echo.
) else (
    echo.
    echo ========================================
    echo Migration failed!
    echo ========================================
    echo Please check the error messages above.
    echo.
)

pause
