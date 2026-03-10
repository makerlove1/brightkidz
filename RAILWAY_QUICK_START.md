# Railway Quick Start Guide

## 🚀 Deploy Your EduKiz Database to Railway in 5 Minutes

### Step 1: Create Railway MySQL Database
1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Provision MySQL"**
3. Wait for deployment (1-2 minutes)

### Step 2: Get Database Credentials
1. Click on your MySQL service
2. Go to **"Variables"** tab
3. Copy these values:
   - `MYSQL_HOST`
   - `MYSQL_PORT` 
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

### Step 3: Configure Your Backend
Your Railway database credentials are:
```env
DB_HOST=${{RAILWAY_PRIVATE_DOMAIN}}
DB_USER=root
DB_PASSWORD=${{MYSQL_ROOT_PASSWORD}}
DB_NAME=railway
DB_PORT=3306
```

✅ **Already configured in `backend/.env.production`**

### Step 4: Deploy Database Schema
```bash
cd backend
npm run deploy-db
```

### Step 5: Deploy Backend to Railway
1. In Railway dashboard: **"New"** → **"GitHub Repo"**
2. Select your repository
3. Set **Root Directory** to `backend`
4. Add environment variables from your `.env.production`
5. Deploy!

### Step 6: Create Admin User
After backend deployment:
```bash
npm run create-admin
```

### Step 7: Update Frontend
Update your frontend API URL to point to Railway:
```javascript
const API_BASE_URL = 'https://your-backend.railway.app/api'
```

## ✅ Verification
- Backend health check: `https://your-backend.railway.app/api/health`
- Should return: `{"status":"OK","message":"Server is running"}`

## 💡 Pro Tips
- Railway auto-generates secure passwords
- Free tier includes $5/month credit
- Automatic SSL certificates
- Built-in monitoring and logs
- Easy environment variable management

## 🆘 Need Help?
- Check Railway logs in dashboard
- Verify environment variables
- Ensure database schema was created
- Test connection with `npm run deploy-db`

---
**Total time: ~5 minutes** ⏱️