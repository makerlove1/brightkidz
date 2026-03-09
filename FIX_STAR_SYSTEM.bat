@echo off
echo ========================================
echo FIXING STAR AND LEVEL SYSTEM
echo ========================================
echo.

echo Step 1: Checking database connection...
cd backend
node -e "const mysql = require('mysql2/promise'); const dotenv = require('dotenv'); dotenv.config(); const pool = mysql.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, port: process.env.DB_PORT, waitForConnections: true, connectionLimit: 10, queueLimit: 0 }); pool.query('SELECT 1 + 1 AS result').then(([rows]) => { console.log('✓ Database connection successful'); process.exit(0); }).catch(err => { console.error('✗ Database connection failed:', err.message); process.exit(1); });"
if %errorlevel% neq 0 (
  echo ✗ Database connection failed. Make sure MySQL is running (Laragon).
  pause
  exit /b 1
)

echo.
echo Step 2: Creating missing tables and columns...
node fix-level-tables.js
if %errorlevel% neq 0 (
  echo ✗ Failed to fix database tables.
  pause
  exit /b 1
)

echo.
echo Step 3: Starting backend server...
echo Note: Keep this window open and open a new terminal for next steps.
echo.
npm start

cd ..
pause