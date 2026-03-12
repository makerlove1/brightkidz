@echo off
echo ========================================
echo  Remove localStorage Migration
echo ========================================
echo.
echo This will add database tables to replace localStorage usage
echo.

cd backend

echo Running migration...
mysql -u root -p edukiz_db < migrations/remove_localstorage_migration.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  Migration completed successfully!
    echo ========================================
    echo.
    echo New tables added:
    echo - user_preferences (language, voice)
    echo - bkt_skills (Bayesian Knowledge Tracing)
    echo - bkt_history (learning history)
    echo - game_levels (game progress)
    echo.
    echo The rewards column was added to user_levels table.
    echo.
) else (
    echo.
    echo ========================================
    echo  Migration failed!
    echo ========================================
    echo.
    echo Please check your database credentials and try again.
    echo.
)

cd ..
pause
