# 🚀 Deploy to Vercel - Quick Guide

## TL;DR

You need TWO deployments:
1. **Backend + Database** → Railway (Free)
2. **Frontend** → Vercel (Free)

## 📋 Prerequisites

- GitHub account
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Your code pushed to GitHub

## 🎯 Step 1: Deploy Backend to Railway (5 min)

### A. Create Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### B. Add MySQL
1. Click "+ New" in your project
2. Select "Database" → "MySQL"
3. Wait for provisioning

### C. Configure Backend
1. Click on your backend service
2. Go to "Variables"
3. Add these variables:
   ```
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   JWT_SECRET=change-this-to-random-string
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

### D. Initialize Database
1. Click MySQL service → "Connect"
2. Copy connection command
3. Connect and run `backend/config/init-database.sql`
4. Create admin user:
   ```sql
   -- Use bcrypt to hash password first
   INSERT INTO users (username, email, password, full_name, role) 
   VALUES ('admin', 'admin@edukiz.com', 'hashed-password', 'Administrator', 'admin');
   ```

### E. Get Backend URL
1. Click backend service
2. Go to "Settings" → "Networking"  
3. Copy the URL (e.g., `https://edukiz-backend.railway.app`)

## 🎯 Step 2: Deploy Frontend to Vercel (3 min)

### A. Update Config
Edit `.env.production`:
```
VUE_APP_API_URL=https://your-backend.railway.app/api
```

### B. Deploy via Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework**: Vue.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`
4. Add Environment Variable:
   - **Name**: `VUE_APP_API_URL`
   - **Value**: `https://your-backend.railway.app/api`
5. Click "Deploy"

### C. Update Railway CORS
Go back to Railway backend variables and update:
```
FRONTEND_URL=https://your-app.vercel.app
```

## ✅ Test Your Deployment

1. Visit: `https://your-app.vercel.app/#/login`
2. Login with admin credentials
3. Check if dashboard loads data

## 🐛 Common Issues

### "Network Error" or "Failed to fetch"
- Check backend URL in `.env.production`
- Verify Railway backend is running
- Check CORS settings

### "Database connection failed"
- Verify Railway MySQL is running
- Check environment variables
- Test connection from Railway CLI

### Build failed on Vercel
- Use install command: `npm install --legacy-peer-deps`
- Check build logs
- Verify `package.json` scripts

## 🔒 Security Checklist

Before sharing your app:

- [ ] Change JWT_SECRET to random string
- [ ] Change admin password
- [ ] Update CORS to only allow your Vercel domain
- [ ] Use strong database password
- [ ] Enable Railway database backups

## 💡 Pro Tips

1. **Custom Domain**: Add in Vercel settings
2. **Auto-deploy**: Push to GitHub = auto-deploy
3. **Logs**: Check Railway/Vercel dashboards
4. **Monitoring**: Enable in both platforms

## 📊 What You Get (Free Tier)

**Railway:**
- $5/month credit
- MySQL database
- Auto-deploy from GitHub

**Vercel:**
- Unlimited deployments
- 100GB bandwidth
- Global CDN

## 🎉 Done!

Your app is now live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **Admin**: `https://your-app.vercel.app/#/admin`

## 📚 More Help

- Full guide: `DEPLOYMENT_GUIDE.md`
- Detailed steps: `VERCEL_DEPLOYMENT.md`
- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs

---

**Need help?** Check the troubleshooting section above or review the full deployment guide.
