@echo off
echo ========================================
echo AI Voice Translation Generator
echo English and Filipino Voice Files
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://www.python.org/
    pause
    exit /b 1
)

echo Installing required packages...
pip install gtts

echo.
echo Generating ALL voice files...
echo This will take a few minutes...
echo.

python generate_all_voices.py

echo.
echo ========================================
echo Process complete!
echo Check the english and filipino folders
echo ========================================
pause
