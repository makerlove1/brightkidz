@echo off
echo ========================================
echo  Database Migration: edukiz to brightkidz_db
echo ========================================
echo.
echo This will:
echo 1. Export your current edukiz database
echo 2. Create new brightkidz_db database
echo 3. Import all data to new database
echo.
pause

cd backend

echo.
echo Step 1: Exporting edukiz database...
mysqldump -u root -p1234 edukiz > ../edukiz_backup.sql

if %ERRORLEVEL% EQU 0 (
    echo ✓ Export successful!
) else (
    echo ✗ Export failed! Check if database exists.
    pause
    exit /b 1
)

echo.
echo Step 2: Creating brightkidz_db database...
mysql -u root -p1234 -e "CREATE DATABASE IF NOT EXISTS brightkidz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %ERRORLEVEL% EQU 0 (
    echo ✓ Database created!
) else (
    echo ✗ Database creation failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Importing data to brightkidz_db...
mysql -u root -p1234 brightkidz_db < ../edukiz_backup.sql

if %ERRORLEVEL% EQU 0 (
    echo ✓ Import successful!
) else (
    echo ✗ Import failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Migration Complete!
echo ========================================
echo.
echo ✓ Old database: edukiz (still exists)
echo ✓ New database: brightkidz_db (ready to use)
echo ✓ Backup file: edukiz_backup.sql
echo.
echo Next steps:
echo 1. Test the app with new database
echo 2. If everything works, you can drop old database:
echo    mysql -u root -p1234 -e "DROP DATABASE edukiz;"
echo.

cd ..
pause
