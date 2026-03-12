# Railway Source Settings - Root Directory Guide

## 🎯 Where to Find Root Directory Setting

You mentioned seeing these sections:
- **Source** ← Click here!
- Networking
- Scaling  
- Build
- Deploy
- Config-as-code
- Danger

## 📍 Step-by-Step Instructions

### 1. Click on "Source"
This section contains your GitHub repository settings.

### 2. In the Source section, you'll see:
- **Repository**: makerlove1/brightkidz
- **Branch**: main (or master)
- **Root Directory**: ← Enter `backend` here
- **Watch Paths** (optional)

### 3. Set Root Directory
- In the "Root Directory" field, type: `backend`
- Press Enter or click outside the field to save
- Railway will automatically trigger a new deployment

## ✅ What Should Happen

After setting Root Directory to `backend`:
1. Railway will redeploy automatically
2. It will look for `package.json` in the `backend` folder
3. It will run `npm install` and `npm start`
4. Your backend should deploy successfully!

## 🔍 If You Don't See "Root Directory" Field

If the Root Directory field is not visible in the Source section, try this:

### Option 1: Check "Build" Section
Sometimes the Root Directory setting is in the **"Build"** section instead:
1. Click on **"Build"**
2. Look for **"Root Directory"** or **"Watch Paths"**
3. Set it to `backend`

### Option 2: Use Config-as-Code
1. Click on **"Config-as-code"**
2. Enable it if not already enabled
3. Railway will use the `railway.toml` file I created in your backend folder

## 📝 Configuration Files (Already Added)

I've added these files to help Railway find your backend:

**In `backend/railway.toml`:**
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/health"
```

**In `backend/nixpacks.toml`:**
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm install"]

[start]
cmd = "npm start"
```

These files tell Railway:
- This is a Node.js 20 project
- Install dependencies with `npm install`
- Start with `npm start`
- Health check at `/api/health`

## 🚀 Quick Fix: Try This Now

1. **In Railway, go to Source section**
2. **Find "Root Directory" field**
3. **Type**: `backend`
4. **Save and wait for redeployment**

OR

1. **Go to "Config-as-code" section**
2. **Enable "Use railway.toml"** if available
3. **Railway will use the config file from your backend folder**

## 📸 What You Should See

In the Source section, it should look like:
```
Repository: makerlove1/brightkidz
Branch: main
Root Directory: backend  ← Type this here
```

## ⚠️ Common Issues

**Issue**: "Not Found" error during deployment
**Solution**: Root Directory not set correctly

**Issue**: Can't find package.json
**Solution**: Make sure Root Directory is set to `backend`

**Issue**: Build fails
**Solution**: Check deployment logs for specific errors

---
**Once Root Directory is set to `backend`, your deployment should work!** 🎉