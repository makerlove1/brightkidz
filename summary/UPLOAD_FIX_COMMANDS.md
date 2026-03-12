# 🔧 Fix and Upload Commands

## Issues Found

1. ❌ **Wrong remote repository** - Pointing to `timmalich/edukiz` instead of `Mic043-panget/YoungMind`
2. ❌ **Git identity not configured** - Need to set name and email
3. ⚠️ **LF/CRLF warnings** - Normal on Windows, can be ignored

## 🚀 Quick Fix

### Option 1: Run the Fix Script (Easiest)

Double-click: **`fix-and-upload.bat`**

### Option 2: Manual Commands

Copy and paste these commands one by one:

```powershell
# 1. Configure Git identity
git config user.email "mic043panget@gmail.com"
git config user.name "Mic043-panget"

# 2. Remove old remote
git remote remove origin

# 3. Add correct remote
git remote add origin https://github.com/Mic043-panget/YoungMind.git

# 4. Verify remote
git remote -v

# 5. Add all files
git add .

# 6. Commit
git commit -m "Initial commit: Edukiz Educational Games with BKT Algorithm"

# 7. Set branch to main
git branch -M main

# 8. Push to GitHub
git push -u origin main
```

## 🔐 Authentication

When asked for credentials:

**Username**: `Mic043-panget`

**Password**: Use a **Personal Access Token** (NOT your GitHub password)

### Get Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: "YoungMind Upload"
4. Select scope: **`repo`** (check the box)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

## ⚠️ About the Warnings

The LF/CRLF warnings are normal on Windows and can be safely ignored. They just mean Git is converting line endings for Windows compatibility.

To suppress these warnings (optional):
```powershell
git config core.autocrlf true
```

## ✅ Verification

After successful push, you should see:

```
Enumerating objects: 1234, done.
Counting objects: 100% (1234/1234), done.
Delta compression using up to 8 threads
Compressing objects: 100% (567/567), done.
Writing objects: 100% (1234/1234), 125.00 MiB | 5.00 MiB/s, done.
Total 1234 (delta 456), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (456/456), done.
To https://github.com/Mic043-panget/YoungMind.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

Then visit: **https://github.com/Mic043-panget/YoungMind**

## 🐛 Troubleshooting

### Error: "Permission denied"
- Make sure you're using the correct Personal Access Token
- Token must have `repo` scope enabled
- Username must be exactly: `Mic043-panget`

### Error: "Authentication failed"
- Don't use your GitHub password
- Use Personal Access Token instead
- Generate new token if needed

### Error: "Repository not found"
- Make sure the repository exists: https://github.com/Mic043-panget/YoungMind
- Check if you have access to it
- Verify the URL is correct

### Still having issues?

Try this alternative method:

```powershell
# Use SSH instead of HTTPS
git remote set-url origin git@github.com:Mic043-panget/YoungMind.git
git push -u origin main
```

Or use **GitHub Desktop** (easier):
1. Download: https://desktop.github.com/
2. Sign in with your GitHub account
3. Add local repository (edukiz folder)
4. Publish to GitHub as "YoungMind"

## 📝 Summary

**What to do**:
1. Run `fix-and-upload.bat` OR
2. Copy/paste the manual commands above
3. Enter username: `Mic043-panget`
4. Enter password: Your Personal Access Token
5. Wait for upload to complete
6. Visit: https://github.com/Mic043-panget/YoungMind

**That's it!** 🎉
