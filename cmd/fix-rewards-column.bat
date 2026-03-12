@echo off
echo ========================================
echo   Fix Rewards Column Migration
echo ========================================
echo.

cd edukiz\backend

echo Running migration script...
node scripts/add-rewards-column.js

echo.
echo ========================================
echo   Migration Complete!
echo ========================================
echo.
echo The rewards column has been added to the database.
echo You can now restart your server and the level system will work properly.
echo.
pause
