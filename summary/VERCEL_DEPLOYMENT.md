# Quick Vercel Deployment Guide

## ⚠️ Important First

Vercel is great for the **frontend only**. Your backend needs to be deployed separately.

## 🎯 Recommended Approach

1. **Backend + Database** → Railway (Free)
2. **Frontend** → Vercel (Free)

## Step-by-Step Guide

### Step 1: Deploy Backend to Railway (5 minutes)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder

3. **Add MySQL Database**
   - In Railway project, click "+ New"
   - Select "Database" → "MySQL"
   - Wait for it to provision

4. **Set Environment Variables**
   Click on backend service → Variables → Add these:
   ```
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   JWT_SECRET=your-super-secret-key-change-this
   PORT=3000
   NODE_ENV=production
   ```

5. **Initialize Database**
   - Click on MySQL service
   - Click "Connect"
   - Use the connection details to connect via MySQL client
   - Run the SQL from `backend/config/init-database.sql`
   - Create admin user (see below)

6. **Get Backend URL**
   - Click on backend service
   - Go to "Settings" → "Networking"
   - Copy the public URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend to Vercel (3 minutes)

1. **Update API URL**
   Edit `.env.production`:
   ```
   VUE_APP_API_URL=https://your-backend.railway.app/api
   ```

2. **Build Locally (Optional Test)**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**
   
   **Option A: Using Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Deploy
   vercel --prod
   ```

   **Option B: Using Vercel Dashboard**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Vue.js
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Root Directory: `./` (leave as root)
   - Add Environment Variable:
     - Name: `VUE_APP_API_URL`
     - Value: `https://your-backend.railway.app/api`
   - Click "Deploy"

4. **Done!**
   - Your app will be live at `https://your-app.vercel.app`

### Step 3: Create Admin User on Railway

Connect to Railway MySQL and run:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to MySQL
railway connect MySQL

# Then run:
USE your_database_name;

# Create admin user (password will be hashed)
# You'll need to hash the password first using bcrypt
```

Or use the create-admin script:
1. Update `backend/.env` with Railway database credentials
2. Run: `npm run create-admin`

## 🔧 Configuration Files Created

- ✓ `vercel.json` - Vercel configuration
- ✓ `.env.production` - Production environment variables
- ✓ `backend/railway.json` - Railway configuration

## 🧪 Testing Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Go to login page: `https://your-app.vercel.app/#/login`
3. Login with admin credentials
4. Check if data loads from Railway backend

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `.env.production` has correct Railway URL
- Verify Railway backend is running
- Check browser console for CORS errors

### CORS Errors
Add to `backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app'],
  credentials: true
}));
```

### Database Connection Failed
- Verify Railway MySQL is running
- Check environment variables in Railway
- Test connection using Railway CLI

### Build Failed on Vercel
- Check build logs in Vercel dashboard
- Verify `package.json` has correct scripts
- Try building locally first: `npm run build`

## 💰 Cost

Both services have generous free tiers:

**Railway Free Tier:**
- $5 credit per month
- Enough for small apps
- Upgrade if needed

**Vercel Free Tier:**
- Unlimited deployments
- 100GB bandwidth
- Perfect for this app

## 🔒 Security for Production

Before going live:

1. **Change Secrets**
   ```bash
   # Generate random JWT secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Update CORS**
   Only allow your Vercel domain

3. **Change Admin Password**
   Login and change from default

4. **Enable HTTPS**
   (Automatic on both platforms)

5. **Add Rate Limiting**
   Protect your API endpoints

## 📊 Monitoring

**Railway:**
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts

**Vercel:**
- View deployment logs
- Monitor performance
- Check analytics

## 🚀 Deployment Workflow

After initial setup:

1. Make changes to code
2. Push to GitHub
3. Both Railway and Vercel auto-deploy
4. Check deployment status in dashboards
5. Test the live app

## ✅ Checklist

- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] MySQL database created on Railway
- [ ] Database initialized with schema
- [ ] Admin user created
- [ ] Backend URL copied
- [ ] `.env.production` updated with backend URL
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] App tested and working
- [ ] Admin password changed
- [ ] CORS configured
- [ ] Custom domain added (optional)

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`
- Admin: `https://your-app.vercel.app/#/admin`

Share your app with the world! 🌍
