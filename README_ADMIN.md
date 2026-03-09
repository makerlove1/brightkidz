# EduKiz Admin System

Complete user authentication and progress tracking system for EduKiz educational platform.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# 1. Run setup script
setup-admin-system.bat

# 2. Initialize database (manual step)
# Open Laragon > Database > Open
# Run: backend/config/init-database.sql

# 3. Start servers
start-admin-system.bat
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
cd backend && npm install
cd .. && npm install

# 2. Setup database (see ADMIN_SETUP_GUIDE.md)

# 3. Start backend
cd backend && npm start

# 4. Start frontend (new terminal)
npm run serve
```

## 📋 Prerequisites

- ✅ Laragon installed and running
- ✅ Node.js 16+ installed
- ✅ MySQL running in Laragon

## 🔑 Default Login

**Admin Account:**
- Username: `admin`
- Password: `admin123`

⚠️ Change this password after first login!

## 🌐 URLs

- **Frontend:** http://localhost:8080
- **Login:** http://localhost:8080/#/login
- **Admin Dashboard:** http://localhost:8080/#/admin
- **User Profile:** http://localhost:8080/#/profile
- **Backend API:** http://localhost:3000

## ✨ Features

### User Features
- ✓ Register and login
- ✓ Guest mode (no login required)
- ✓ Automatic progress tracking
- ✓ Personal statistics
- ✓ Rewards system
- ✓ Multi-language (EN, TL, DE)

### Admin Features
- ✓ Dashboard with analytics
- ✓ User management
- ✓ Login tracking
- ✓ Progress monitoring
- ✓ Top performers
- ✓ Game statistics

## 📁 New Files

### Backend
```
backend/
├── config/
│   ├── database.js
│   └── init-database.sql
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── admin.js
│   └── progress.js
├── scripts/
│   └── create-admin.js
├── .env
├── package.json
└── server.js
```

### Frontend
```
src/
├── components/
│   ├── Login.vue
│   ├── AdminDashboard.vue
│   └── UserProfile.vue
├── services/
│   ├── authService.js
│   ├── adminService.js
│   └── progressService.js
└── mixins/
    └── progressTrackingMixin.js
```

## 🎮 Integrating Progress Tracking

Add to your game components:

```javascript
import { progressTrackingMixin } from '@/mixins/progressTrackingMixin';

export default {
  mixins: [progressTrackingMixin],
  mounted() {
    this.startGameTracking('memory', 'Memory Animals');
  },
  methods: {
    onGameComplete() {
      this.saveGameProgress(this.score, 1, true);
      this.updateRewards(10);
    }
  }
}
```

## 📚 Documentation

- **[ADMIN_SETUP_GUIDE.md](ADMIN_SETUP_GUIDE.md)** - Complete setup instructions
- **[QUICK_START.md](QUICK_START.md)** - Quick start guide
- **[INTEGRATION_EXAMPLE.md](INTEGRATION_EXAMPLE.md)** - Game integration examples
- **[ADMIN_SYSTEM_SUMMARY.md](ADMIN_SYSTEM_SUMMARY.md)** - System overview

## 🔧 Utility Scripts

- `setup-admin-system.bat` - Automated setup
- `start-admin-system.bat` - Start both servers
- `check-setup.bat` - Verify setup

## 🗄️ Database Schema

### Tables
- **users** - User accounts
- **user_sessions** - Login tracking
- **user_progress** - Game progress
- **game_statistics** - User stats

### Views
- **user_login_summary** - Login stats
- **user_progress_summary** - Progress summary

## 🔐 Security

- ✓ Password hashing (bcrypt)
- ✓ JWT authentication
- ✓ Protected routes
- ✓ SQL injection prevention
- ✓ Role-based access

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check MySQL is running
# Verify .env credentials
# Ensure database exists
```

### Backend Won't Start
```bash
# Check port 3000 is available
cd backend
npm install
```

### Frontend Can't Connect
```bash
# Verify backend is running
# Check .env file
npm install
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### User
- `GET /api/users/stats`
- `GET /api/users/progress`

### Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/users/:id`

See [ADMIN_SETUP_GUIDE.md](ADMIN_SETUP_GUIDE.md) for complete API documentation.

## 🎯 Testing

1. Register a new user
2. Login and play games
3. Check user profile
4. Login as admin
5. View user progress in dashboard

## 🚀 Production Deployment

### Security Checklist
- [ ] Change JWT_SECRET
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Restrict CORS
- [ ] Add rate limiting
- [ ] Regular backups

See [ADMIN_SETUP_GUIDE.md](ADMIN_SETUP_GUIDE.md) for production deployment guide.

## 📝 License

Same as EduKiz main project.

## 🤝 Support

For issues:
1. Check troubleshooting section
2. Review setup guide
3. Check error logs
4. Verify database connection

---

**Ready to use!** Run `check-setup.bat` to verify your setup.
