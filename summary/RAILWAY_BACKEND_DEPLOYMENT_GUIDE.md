# Railway Backend Deployment - Step by Step Guide

## 🎯 Problem Solved
Railway configuration files added to automatically detect the backend folder!

## 📋 Deployment Steps

### Method 1: Using Railway Dashboard (Recommended)

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Make sure you're in your project with the MySQL database

2. **Add New Service**
   - Click the **"+ New"** button
   - Select **"GitHub Repo"**
   - Choose repository: **makerlove1/brightkidz**

3. **Configure Root Directory** (IMPORTANT!)
   After the service is created:
   - Click on the new service
   - Go to **"Settings"** tab
   - Scroll down to **"Service Settings"**
   - Find **"Root Directory"** field
   - Enter: `backend`
   - Click **"Save"**

4. **Add Environment Variables**
   - Go to **"Variables"** tab
   - Click **"+ New Variable"** for each:
   
   ```
   DB_HOST=mysql.railway.internal
   DB_USER=root
   DB_PASSWORD=apOqoyznINeyrtOBLjtmoSLbQngvzAeg
   DB_NAME=railway
   DB_PORT=3306
   JWT_SECRET=edukiz-production-jwt-secret-2024-railway-secure-key
   NODE_ENV=production
   FRONTEND_URL=https://your-edukiz-app.vercel.app
   ```

5. **Deploy**
   - Railway will automatically deploy after you save the variables
   - Watch the deployment logs in the **"Deployments"** tab

### Method 2: Using Railway CLI (Alternative)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Set root directory and deploy
cd backend
railway up
```

## 🔍 Finding the Root Directory Setting

**Visual Guide:**
1. After creating the service from GitHub
2. Click on the service card
3. Look for tabs at the top: **Settings | Variables | Deployments | Metrics**
4. Click **"Settings"**
5. Scroll down to find **"Service Settings"** section
6. You'll see fields like:
   - Service Name
   - **Root Directory** ← Enter `backend` here
   - Build Command
   - Start Command

## ✅ Verification

After deployment, check:

1. **Deployment Status**
   - Should show "Deployed" with a green checkmark
   - No errors in deployment logs

2. **Get Your Backend URL**
   - In the service, go to **"Settings"**
   - Find **"Domains"** section
   - Copy the generated URL (e.g., `https://backend-production-xxxx.railway.app`)

3. **Test Health Check**
   - Visit: `https://your-backend-url.railway.app/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

## 🐛 Troubleshooting

### "Not Found" Error
- **Cause**: Root directory not set correctly
- **Fix**: Go to Settings → Root Directory → Enter `backend` → Save

### Build Fails
- **Check**: Deployment logs for specific errors
- **Common issues**:
  - Missing environment variables
  - Database connection issues
  - Port configuration

### Database Connection Error
- **Check**: Environment variables are correct
- **Verify**: MySQL service is running
- **Use**: `mysql.railway.internal` for DB_HOST (internal connection)

## 📝 Configuration Files Added

Your backend now has these Railway configuration files:
- `railway.toml` - Railway deployment configuration
- `nixpacks.toml` - Build system configuration  
- `railway.json` - Legacy configuration (backup)

These files help Railway automatically:
- Detect it's a Node.js project
- Install dependencies with `npm install`
- Start the server with `npm start`
- Set up health checks at `/api/health`

## 🎉 After Successful Deployment

1. **Copy your Railway backend URL**
2. **Update frontend `.env.production`**:
   ```env
   VUE_APP_API_URL=https://your-actual-backend-url.railway.app/api
   ```
3. **Deploy frontend to Vercel**
4. **Test the complete application**

---
**Your backend is ready to deploy!** 🚀