# 🔄 Git Account Configuration for makerlove1

## 🎯 Quick Commands to Change Account

### Step 1: Update Git Configuration

```bash
# Change global Git username
git config --global user.name "makerlove1"

# Change global Git email (use makerlove1's email)
git config --global user.email "your-makerlove1-email@example.com"
```

### Step 2: Clear Stored Credentials

```bash
# Clear Windows credential manager
git config --global --unset credential.helper

# Or use this to reset credentials
git credential-manager-core erase
```

### Step 3: Update Remote URL

```bash
# Make sure remote points to makerlove1 repository
git remote set-url origin https://github.com/makerlove1/brightkidz.git
```

### Step 4: Push with New Account

```bash
# This will prompt for new credentials
git push -u origin main
```

When prompted:
- **Username**: `makerlove1`
- **Password**: Use a Personal Access Token (not your GitHub password)

## 🔑 Create Personal Access Token

1. **Login to GitHub as makerlove1**
   - Go to https://github.com/login

2. **Create Token**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `workflow`
   - Copy the token (save it somewhere safe!)

3. **Use Token as Password**
   - When git asks for password, paste the token

## 🚀 Complete Commands (Copy & Paste)

```bash
# Navigate to your project
cd C:\Users\Michael\OneDrive\Desktop\copm\edukiz

# Update Git config
git config --global user.name "makerlove1"
git config --global user.email "makerlove1@example.com"

# Clear credentials
git config --global --unset credential.helper

# Update remote
git remote set-url origin https://github.com/makerlove1/brightkidz.git

# Push (will prompt for credentials)
git push -u origin main
```

## 🔍 Verify Changes

```bash
# Check current configuration
git config --global user.name
git config --global user.email

# Check remote URL
git remote -v
```

## 🆘 Alternative: Use Token Directly

If you keep getting prompted, use token directly in URL:

```bash
# Replace YOUR_TOKEN with actual token
git remote set-url origin https://YOUR_TOKEN@github.com/makerlove1/brightkidz.git
git push -u origin main
```

## 📱 Windows Credential Manager

If you're still having issues, clear Windows credentials:

1. **Open Credential Manager**
   - Press `Win + R`
   - Type `control /name Microsoft.CredentialManager`
   - Press Enter

2. **Remove GitHub Credentials**
   - Look for entries with `github.com`
   - Delete them

3. **Try Push Again**
   - Git will prompt for new credentials

## ✅ Success Check

After successful push:
1. Go to https://github.com/makerlove1/brightkidz
2. Verify your files are uploaded
3. Check commit shows "makerlove1" as author

## 🎉 Next Steps

Once uploaded successfully:
1. **Deploy to Vercel** - Follow `DEPLOY_TO_VERCEL.md`
2. **Deploy Backend to Railway**
3. **Test your live app!**

---

**The key is using a Personal Access Token instead of your GitHub password!**