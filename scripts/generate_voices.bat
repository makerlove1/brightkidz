@echo off
echo ========================================
echo AI Voice Translation Generator
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
pip install -r requirements_voice.txt

echo.
echo Generating voice files...
echo.

python generate_voice_translations.py

echo.
echo ========================================
echo Process complete!
echo ========================================
pause
