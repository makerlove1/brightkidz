@echo off
echo ========================================
echo   EDUKIZ - Complete System Startup
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ERROR: backend folder not found!
    echo Please run this script from the edukiz root directory.
    pause
    exit /b 1
)

if not exist "src" (
    echo ERROR: src folder not found!
    echo Please run this script from the edukiz root directory.
    pause
    exit /b 1
)

echo Step 1: Setting up database...
echo ========================================
cd backend

REM Check if .env exists
if not exist ".env" (
    echo WARNING: .env file not found in backend folder!
    echo Please create .env file with your database credentials.
    echo.
    echo Example .env content:
    echo DB_HOST=localhost
    echo DB_USER=root
    echo DB_PASSWORD=your_password
    echo DB_NAME=edukiz
    echo JWT_SECRET=your_secret_key
    echo.
    pause
)

echo.
echo Running database migrations...
echo.

REM Run all migrations
echo [1/3] Creating base tables...
mysql -u root -p edukiz < config/init-database.sql
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Base database setup failed!
    echo Please check your MySQL credentials and try again.
    pause
    exit /b 1
)

echo [2/3] Adding streak system...
mysql -u root -p edukiz < migrations/add_login_streaks.sql
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Streak system migration failed or already exists.
)

echo [3/3] Adding level system...
mysql -u root -p edukiz < migrations/add_level_system.sql
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Level system migration failed or already exists.
)

echo.
echo Database setup complete!
echo.

echo Step 2: Installing backend dependencies...
echo ========================================
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed.
)

echo.
echo Step 3: Starting backend server...
echo ========================================
echo Backend will start on http://localhost:3000
echo.
start "Edukiz Backend" cmd /k "npm start"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

cd ..

echo.
echo Step 4: Installing frontend dependencies...
echo ========================================
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed.
)

echo.
echo Step 5: Starting frontend development server...
echo ========================================
echo Frontend will start on http://localhost:8080
echo.
start "Edukiz Frontend" cmd /k "npm run serve"

echo.
echo ========================================
echo   System Starting...
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:8080
echo.
echo Both servers are starting in separate windows.
echo Wait a few seconds for them to fully start.
echo.
echo Default Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo To create a new admin user, run:
echo   cd backend
echo   node scripts/create-admin.js
echo.
echo Press any key to open the app in your browser...
pause >nul

REM Wait a bit more to ensure servers are ready
timeout /t 5 /nobreak >nul

REM Open browser
start http://localhost:8080

echo.
echo ========================================
echo   System is running!
echo ========================================
echo.
echo To stop the servers:
echo   - Close the Backend and Frontend command windows
echo   - Or press Ctrl+C in each window
echo.
echo Enjoy using Edukiz!
echo.
pause
