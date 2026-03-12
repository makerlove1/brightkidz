# Update Railway Backend URL

## 🌐 Your Railway Backend Setup

### Current Status:
- **Internal Domain**: `brightkidz.railway.internal` (only accessible within Railway)
- **Public Domain**: Need to generate this!

## 📋 Steps to Generate Public Domain

### 1. In Railway Dashboard
1. Click on your **brightkidz** service
2. Go to **"Networking"** section
3. Look for **"Generate Domain"** button
4. Click it to create a public URL

### 2. You'll Get a URL Like:
```
https://brightkidz-production-xxxx.railway.app
```

### 3. Test Your Backend
Once you have the public URL, test it:
```
https://brightkidz-production-xxxx.railway.app/api/health
```

Should return:
```json
{"status":"OK","message":"Server is running"}
```

## ✅ Update Frontend Configuration

Once you have your public Railway URL, update your frontend:

### File: `.env.production`
```env
VUE_APP_API_URL=https://brightkidz-production-xxxx.railway.app/api
```

Replace `brightkidz-production-xxxx.railway.app` with your actual Railway public domain.

## 🔧 Quick Update Script

Run this after you get your Railway URL:

**Windows (update-frontend-api.bat):**
```batch
@echo off
set RAILWAY_URL=https://brightkidz-production-xxxx.railway.app
echo VUE_APP_API_URL=%RAILWAY_URL%/api > .env.production
echo Frontend updated with Railway backend URL!
```

## 📝 Important Notes

### Internal vs Public Domain:
- **Internal** (`brightkidz.railway.internal`): Only for Railway services to communicate with each other
- **Public** (`brightkidz-production-xxxx.railway.app`): For external access (your frontend, users, etc.)

### Your Setup:
- **MySQL Database**: Uses internal domain (`mysql.railway.internal`)
- **Backend API**: Needs public domain for frontend to access
- **Frontend**: Will use the public backend URL

## 🎯 After Getting Public URL

1. **Copy the public URL** from Railway Networking section
2. **Update `.env.production`** with the URL
3. **Test the health endpoint**
4. **Deploy frontend to Vercel**
5. **Your app is live!** 🚀

---
**Next: Generate public domain in Railway Networking section**