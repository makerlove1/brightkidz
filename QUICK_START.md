# Edukiz - Quick Start Guide

## 🚀 One-Command Startup

### Windows
```bash
START_EVERYTHING.bat
```

This will:
1. ✅ Setup database tables
2. ✅ Install dependencies
3. ✅ Start backend server (port 3000)
4. ✅ Start frontend server (port 8080)
5. ✅ Open app in browser

---

## 📋 Prerequisites

### Required Software
- ✅ Node.js (v14 or higher)
- ✅ MySQL (v5.7 or higher)
- ✅ Git (optional)

### Check Installation
```bash
node --version
npm --version
mysql --version
```

---

## 🔧 Manual Setup (If Needed)

### 1. Database Setup

#### Create Database
```sql
CREATE DATABASE edukiz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Configure Backend
Create `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=edukiz
JWT_SECRET=your_secret_key_here
PORT=3000
NODE_ENV=development
```

#### Run Migrations
```bash
cd backend

# Base tables
mysql -u root -p edukiz < config/init-database.sql

# Streak system
mysql -u root -p edukiz < migrations/add_login_streaks.sql

# Level system
mysql -u root -p edukiz < migrations/add_level_system.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```

Backend runs on: http://localhost:3000

### 3. Frontend Setup
```bash
cd edukiz
npm install
npm run serve
```

Frontend runs on: http://localhost:8080

---

## 👤 Default Admin Account

**Username:** admin  
**Password:** admin123

⚠️ **Important:** Change this password after first login!

### Create New Admin
```bash
cd backend
node scripts/create-admin.js
```

---

## 🎮 Features Overview

### For Users
- 🎯 Educational games (Memory, Drag & Drop, Quiz)
- 🔥 Daily login streaks with rewards
- ⭐ Level system (10 stars per level)
- 🏆 Leaderboards
- 🌍 Multi-language (English, Filipino, German)
- 📱 Mobile responsive
- 🎨 Beautiful animations

### For Admins
- 📊 Dashboard with statistics
- 👥 User management
- 📈 Progress tracking
- 🔍 Detailed analytics
- 🎯 Level & streak monitoring

---

## 🧪 Testing

### Test Backend
```bash
cd backend

# Test database connection
node test-connection.js

# Test streak system
node scripts/test-streak-system.js
```

### Test Frontend
1. Open http://localhost:8080
2. Register a new user
3. Play a game
4. Check streak modal on login
5. Earn 10 stars to see level up

---

## 📁 Project Structure

```
edukiz/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database config
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── migrations/         # Database migrations
│   └── scripts/            # Utility scripts
├── src/                    # Vue.js frontend
│   ├── components/         # Vue components
│   ├── utils/              # Utilities
│   ├── services/           # API services
│   └── mixins/             # Vue mixins
└── public/                 # Static assets
```

---

## 🔍 Troubleshooting

### Backend Won't Start

**Error: Cannot connect to database**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

**Error: Port 3000 already in use**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Change port in backend/.env
PORT=3001
```

### Frontend Won't Start

**Error: Port 8080 already in use**
- Change port in `vue.config.js`
- Or kill process using port 8080

**Error: Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**Error: Access denied**
- Check MySQL username/password
- Grant privileges:
```sql
GRANT ALL PRIVILEGES ON edukiz.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

**Error: Table doesn't exist**
- Run migrations again
- Check migration files executed successfully

### Login Issues

**Cannot login as admin**
- Create admin user:
```bash
cd backend
node scripts/create-admin.js
```

**Token expired**
- Clear browser localStorage
- Login again

---

## 🌐 Accessing the App

### Local Development
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

### Network Access
Find your IP address:
```bash
# Windows
ipconfig

# Access from other devices
http://YOUR_IP:8080
```

---

## 📱 Mobile Testing

### On Same Network
1. Find your computer's IP address
2. On mobile, open: `http://YOUR_IP:8080`
3. Test touch interactions
4. Check responsive design

### Using ngrok (Optional)
```bash
npm install -g ngrok
ngrok http 8080
```

---

## 🔄 Daily Workflow

### Starting Work
```bash
# Start everything
START_EVERYTHING.bat

# Or manually
cd backend && npm start
cd .. && npm run serve
```

### Stopping Servers
- Close command windows
- Or press `Ctrl+C` in each terminal

### Updating Code
```bash
git pull
npm install  # If package.json changed
```

---

## 📊 Monitoring

### Check Logs
- Backend logs: Console output
- Frontend logs: Browser console (F12)
- Database logs: MySQL logs

### View Statistics
1. Login as admin
2. Go to Admin Dashboard
3. View user stats, levels, streaks

---

## 🎯 Next Steps

### For Development
1. ✅ Setup complete
2. 📝 Read feature guides:
   - `DAILY_LOGIN_STREAK_GUIDE.md`
   - `LEVEL_SYSTEM_GUIDE.md`
   - `ADMIN_SETUP_GUIDE.md`
3. 🎨 Customize features
4. 🧪 Add tests
5. 🚀 Deploy to production

### For Production
1. 📖 Read `DEPLOYMENT_GUIDE.md`
2. 🔒 Secure environment variables
3. 🌐 Setup domain
4. 📊 Configure analytics
5. 🔐 Enable HTTPS

---

## 📚 Documentation

- **System Overview**: `SYSTEM_ARCHITECTURE.md`
- **Streak System**: `DAILY_LOGIN_STREAK_GUIDE.md`
- **Level System**: `LEVEL_SYSTEM_GUIDE.md`
- **Admin Guide**: `ADMIN_SETUP_GUIDE.md`
- **Deployment**: `DEPLOYMENT_GUIDE.md`
- **Mobile App**: `MOBILE_APP_GUIDE.md`

---

## 🆘 Getting Help

### Common Commands
```bash
# Install dependencies
npm install

# Start development
npm run serve          # Frontend
npm start             # Backend

# Build for production
npm run build

# Run tests
npm test

# Check for errors
npm run lint
```

### Useful Scripts
```bash
# Create admin user
cd backend && node scripts/create-admin.js

# Test streak system
cd backend && node scripts/test-streak-system.js

# Test database connection
cd backend && node test-connection.js
```

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend running on port 3000
- [ ] Frontend running on port 8080
- [ ] Database tables created
- [ ] Can register new user
- [ ] Can login
- [ ] Games work
- [ ] Streak modal appears on login
- [ ] Level up works (earn 10 stars)
- [ ] Admin dashboard accessible

---

## 🎉 You're Ready!

The system is now running. Enjoy building with Edukiz!

**Quick Links:**
- App: http://localhost:8080
- API: http://localhost:3000/api
- Admin: http://localhost:8080/admin

**Default Login:**
- Username: `admin`
- Password: `admin123`

---

**Happy Coding! 🚀**
