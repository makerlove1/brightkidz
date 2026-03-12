@echo off
echo ========================================
echo Using makerlove1 GitHub Account
echo ========================================
echo.

echo Step 1: Clearing all stored credentials...
echo.

REM Clear Git credential helper
git config --global --unset credential.helper
echo ✓ Git credential helper cleared

REM Clear Windows Credential Manager
echo.
echo Opening Windows Credential Manager...
echo Please delete any GitHub entries manually:
echo 1. Look for entries containing "github.com"
echo 2. Delete all GitHub-related credentials
echo 3. Close Credential Manager when done
echo.
start control /name Microsoft.CredentialManager
pause

echo.
echo Step 2: Setting new Git configuration...
git config --global user.name "makerlove1"
git config --global user.email "jakeworks800@gmail.com"
echo ✓ Git user set to makerlove1 (jakeworks800@gmail.com)

echo.
echo Step 3: Setting repository remote...
git remote set-url origin https://github.com/makerlove1/brightkidz.git
echo ✓ Remote URL updated

echo.
echo Step 4: Verifying configuration...
echo Current Git user: 
git config --global user.name
echo Current Git email:
git config --global user.email
echo Current remote:
git remote -v

echo.
echo ========================================
echo Account Switch Complete!
echo ========================================
echo.
echo Next: Create Personal Access Token
echo 1. Go to: https://github.com/settings/tokens
echo 2. Login as makerlove1
echo 3. Generate new token (classic)
echo 4. Select 'repo' and 'workflow' permissions
echo 5. Copy the token
echo.

echo Opening GitHub tokens page...
start https://github.com/settings/tokens

echo.
echo After creating token, run: push-with-makerlove1.bat
echo.
pause