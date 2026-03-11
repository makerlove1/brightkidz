# Railway Backend Troubleshooting Guide

## 🔴 Error: "Application failed to respond"

This error means your backend isn't starting properly on Railway.

## 🔍 Step-by-Step Diagnosis

### 1. Check Railway Deployment Logs

**In Railway Dashboard:**
1. Click on your `brightkidz` service
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. Look at the **logs** for error messages

**Common errors to look for:**
- `Error: connect ECONNREFUSED` - Database connection issue
- `Error: Cannot find module` - Missing dependencies
- `Port already in use` - Port configuration issue
- `Syntax error` - Code error

### 2. Verify Environment Variables

**Go to Railway → brightkidz → Variables tab**

Make sure ALL these variables are set:

```env
DB_HOST=mysql.railway.internal
DB_USER=root
DB_PASSWORD=apOqoyznINeyrtOBLjtmoSLbQngvzAeg
DB_NAME=railway
DB_PORT=3306
JWT_SECRET=edukiz-production-jwt-secret-2024-railway-secure-key
NODE_ENV=production
FRONTEND_URL=https://brightkidz.vercel.app
PORT=3000
```

### 3. Check Watch Paths Configuration

**In Railway → Settings → Source:**
- Make sure **Watch Paths** is set to: `/backend/**`
- Or **Root Directory** is set to: `backend`

### 4. Verify MySQL Service is Running

**In Railway Dashboard:**
1. Check if your MySQL service is active (green checkmark)
2. If it's stopped, restart it
3. Wait for it to be fully running before redeploying backend

### 5. Check Build Command

**In Railway → Settings → Build:**
- Build Command should be: `npm install` (or empty, Railway auto-detects)
- Start Command should be: `npm start`

## 🔧 Quick Fixes

### Fix 1: Redeploy with Correct Settings

1. Go to Railway → brightkidz service
2. Click **Settings** → **Source**
3. Set **Root Directory** to: `backend`
4. Go to **Variables** tab
5. Add `PORT=3000` if missing
6. Click **Deployments** → **Redeploy**

### Fix 2: Check Database Connection

The backend needs to connect to MySQL. Make sure:
- MySQL service is running
- `DB_HOST=mysql.railway.internal` (internal connection)
- Database credentials are correct

### Fix 3: Manual Redeploy

1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **"Redeploy"**
4. Watch the logs for errors

## 📋 Checklist

- [ ] MySQL service is running (green checkmark)
- [ ] All environment variables are set
- [ ] Root Directory is set to `backend`
- [ ] Watch Paths includes `/backend/**`
- [ ] PORT variable is set to 3000
- [ ] Latest code is pushed to GitHub
- [ ] Deployment logs show no errors

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'express'"
**Solution:** 
- Build command not running properly
- Go to Settings → Build → Set Build Command to `npm install`
- Redeploy

### Issue: "Error: connect ECONNREFUSED"
**Solution:**
- Database not accessible
- Check MySQL service is running
- Verify `DB_HOST=mysql.railway.internal`
- Check database credentials

### Issue: "Port 3000 is already in use"
**Solution:**
- Railway should handle this automatically
- Make sure `PORT` environment variable is set
- Railway will assign a port automatically

### Issue: "Application Error"
**Solution:**
- Check deployment logs for specific error
- Verify all environment variables
- Check if database is initialized

## 🔍 Debug Steps

### Step 1: Check Deployment Logs
```
Railway Dashboard → brightkidz → Deployments → Latest → View Logs
```

Look for:
- Build errors
- Start errors
- Database connection errors
- Missing environment variables

### Step 2: Verify Database
```
Railway Dashboard → MySQL service → Check status
```

Should show:
- Status: Active (green)
- Deployment: Successful

### Step 3: Test Database Connection Locally
```bash
cd backend
npm run deploy-db
```

If this works locally, the issue is with Railway configuration.

## 🚀 Force Fresh Deployment

If nothing works, try a fresh deployment:

1. **Delete the current service** (NOT the database!)
2. **Create new service from GitHub**
3. **Set Root Directory to `backend`**
4. **Add all environment variables**
5. **Deploy**

## 📞 Need More Help?

Check Railway logs and share the error message. Common log locations:
- Build logs: Shows npm install output
- Deploy logs: Shows application startup
- Runtime logs: Shows application errors

---

**Most Common Fix:** Set Root Directory to `backend` and add all environment variables, then redeploy.