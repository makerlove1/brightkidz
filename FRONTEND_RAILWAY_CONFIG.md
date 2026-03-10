# Frontend Railway Configuration Guide

## Current Status ✅

Your frontend is already configured to work with Railway! Here's what's set up:

### Environment Files
- **Development**: `.env` → `http://localhost:3000/api`
- **Production**: `.env.production` → Railway backend URL (needs update)

### Service Files Using API_URL
All your services are properly configured:
- `src/services/authService.js` - Authentication
- `src/services/adminService.js` - Admin dashboard
- `src/services/progressService.js` - Game progress
- `src/services/gameLevelService.js` - Level management

## 🚀 Next Steps

### 1. Deploy Backend to Railway First
1. Go to [Railway.app](https://railway.app)
2. New → GitHub Repo → Select your repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy and get your Railway backend URL

### 2. Update Frontend Configuration
Once you have your Railway backend URL (e.g., `https://edukiz-backend-production.railway.app`), update:

**File: `.env.production`**
```env
# Production Backend API URL
VUE_APP_API_URL=https://your-actual-backend-url.railway.app/api
```

### 3. Deploy Frontend to Vercel
Your frontend will automatically use the production environment variables when deployed.

## 🔧 How It Works

Your frontend uses this pattern in all services:
```javascript
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';
```

- **Development**: Uses localhost backend
- **Production**: Uses Railway backend URL from environment variable

## ✅ What's Already Done

- ✅ All service files configured with environment variables
- ✅ Development environment pointing to localhost
- ✅ Production environment file created (needs Railway URL)
- ✅ Proper fallback configuration
- ✅ Authentication headers properly configured
- ✅ Error handling in place

## 🎯 Example Railway URLs

After deployment, your URLs will look like:
- Backend: `https://edukiz-backend-production.railway.app`
- API Base: `https://edukiz-backend-production.railway.app/api`
- Health Check: `https://edukiz-backend-production.railway.app/api/health`

## 📝 Quick Update Command

Once you have your Railway backend URL:
```bash
# Update the production environment file
echo VUE_APP_API_URL=https://your-backend-url.railway.app/api > .env.production
```

---
**Your frontend is ready for Railway! Just update the URL after backend deployment.** 🚀