@echo off
echo Fixing Database Schema...
echo.

cd backend

echo Running migration to add rewards column...
mysql -u root -p edukiz < migrations/remove_localstorage_migration.sql

echo.
echo Checking if rewards column exists...
mysql -u root -p -e "USE edukiz; DESCRIBE user_levels;"

echo.
echo Migration complete!
echo.
pause
