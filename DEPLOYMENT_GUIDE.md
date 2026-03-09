# Deployment Guide - EduKiz Admin System

## 🚨 Important Note

Your app has 3 components:
1. **Frontend** (Vue.js)
2. **Backend** (Node.js/Express)
3. **Database** (MySQL)

Vercel is excellent for frontend but has limitations for backend + database.

## 🎯 Recommended: Split Deployment

### Best Setup:
- **Frontend** → Vercel (Free, Fast CDN)
- **Backend + Database** → Railway (Free tier, MySQL support)

This gives you the best performance and is free!

---

## Option 1: Frontend on Vercel + Backend on Railway

### Part A: Deploy Backend to Railway

#### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

#### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Connect your GitHub account
- Select your repository

#### 3. Add MySQL Database
- In your Railway project, click "New"
- Select "Database" → "MySQL"
- Railway will create a MySQL database

#### 4. Configure Backend
Create `railway.json` in backend folder:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 5. Set Environment Variables in Railway
Go to your backend service → Variables:
```
DB_HOST=<from Railway MySQL>
DB_USER=<from Railway MySQL>
DB_PASSWORD=<from Railway MySQL>
DB_NAME=<from Railway MySQL>
DB_PORT=3306
JWT_SECRET=<generate-random-string>
PORT=3000
NODE_ENV=production
```

#### 6. Initialize Database
- Connect to Railway MySQL using their web interface
- Run the SQL from `backend/config/init-database.sql`
- Run `npm run create-admin` locally pointing to Railway DB

#### 7. Deploy
- Railway auto-deploys on git push
- Get your backend URL: `https://your-app.railway.app`

### Part B: Deploy Frontend to Vercel

#### 1. Update Frontend Config
Update `.env.production`:
```
VUE_APP_API_URL=https://your-backend.railway.app/api
```

#### 2. Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

#### 3. Build for Production
```bash
npm run build
```

#### 4. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Or use Vercel Dashboard:
- Go to https://vercel.com
- Import your GitHub repository
- Set build command: `npm run build`
- Set output directory: `dist`
- Deploy!

---

## Option 2: Everything on Railway

Deploy both frontend and backend to Railway.

### 1. Create Railway Project
- New Project → Deploy from GitHub

### 2. Add Services
- Add MySQL database
- Add backend service (from `/backend` folder)
- Add frontend service (from root folder)

### 3. Configure Backend
Same as Option 1, Part A

### 4. Configure Frontend
Create `railway.json` in root:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run serve-production",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

Add to `package.json`:
```json
"scripts": {
  "serve-production": "npm install -g serve && serve -s dist -l 8080"
}
```

### 5. Set Environment Variables
Frontend service:
```
VUE_APP_API_URL=https://your-backend.railway.app/api
```

### 6. Deploy
Push to GitHub, Railway auto-deploys both services.

---

## Option 3: Vercel Serverless + PlanetScale

Use Vercel for everything with serverless functions.

### 1. Setup PlanetScale (Free MySQL)
- Go to https://planetscale.com
- Create account and database
- Get connection string

### 2. Convert Backend to Serverless
Create `api/` folder in root with serverless functions:

`api/auth/login.js`:
```javascript
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Your login logic here
  
  await connection.end();
  res.json({ success: true });
};
```

### 3. Configure Vercel
`vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 4. Environment Variables in Vercel
```
DATABASE_URL=<planetscale-connection-string>
JWT_SECRET=<random-string>
```

### 5. Deploy
```bash
vercel --prod
```

---

## 🔒 Security Checklist for Production

Before deploying:

- [ ] Change JWT_SECRET to random string
- [ ] Change admin password
- [ ] Use strong database password
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set CORS to specific origins
- [ ] Add rate limiting
- [ ] Remove console.logs
- [ ] Set NODE_ENV=production
- [ ] Enable database backups
- [ ] Add error monitoring (Sentry)

---

## 📝 Quick Comparison

| Feature | Vercel + Railway | All Railway | Vercel Serverless |
|---------|-----------------|-------------|-------------------|
| Cost | Free | Free | Free |
| Setup | Medium | Easy | Hard |
| Performance | Excellent | Good | Good |
| MySQL | ✓ | ✓ | External only |
| Auto-deploy | ✓ | ✓ | ✓ |
| Custom domain | ✓ | ✓ | ✓ |

---

## 🚀 Recommended: Vercel + Railway

This gives you:
- ✓ Fast frontend (Vercel CDN)
- ✓ Reliable backend (Railway)
- ✓ MySQL database (Railway)
- ✓ Free tier for both
- ✓ Easy setup
- ✓ Auto-deploy on git push

---

## Need Help?

1. **Railway Issues**: Check Railway logs in dashboard
2. **Vercel Issues**: Check Vercel deployment logs
3. **Database Issues**: Verify connection strings
4. **CORS Issues**: Update backend CORS settings

---

## Next Steps

1. Choose your deployment option
2. Follow the guide above
3. Test thoroughly
4. Set up custom domain (optional)
5. Monitor performance

Good luck with your deployment! 🎉
