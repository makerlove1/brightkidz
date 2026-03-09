# 🎓 EduKiz - Educational Learning Platform

A comprehensive educational platform for children with games, progress tracking, and admin management system.

## 🌟 Features

### For Students
- 🧠 **Memory Games** - Animal and character matching
- 🎯 **Drag & Drop Games** - Word building and character learning
- 🎮 **Quiz Games** - Interactive learning assessments
- 🏆 **Progress Tracking** - Automatic game progress saving
- ⭐ **Rewards System** - Earn points and achievements
- 🌍 **Multi-language** - English, Filipino, German support
- 📱 **Mobile Friendly** - Responsive design for all devices

### For Administrators
- 📊 **Admin Dashboard** - Comprehensive analytics
- 👥 **User Management** - View and manage all users
- 📈 **Progress Monitoring** - Track student learning progress
- 🔐 **Login Tracking** - Monitor user activity
- 📋 **Detailed Reports** - Game statistics and performance data

### Technical Features
- 🔒 **Secure Authentication** - JWT-based login system
- 🗄️ **MySQL Database** - Robust data storage
- 🎨 **Modern UI** - Vue.js 3 with responsive design
- 🚀 **PWA Support** - Works offline
- 🔊 **Voice Support** - Text-to-speech in multiple languages

## 🚀 Live Demo

- **Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app)
- **Admin Dashboard**: [https://your-app.vercel.app/#/admin](https://your-app.vercel.app/#/admin)

### Demo Credentials
- **Admin**: username: `admin`, password: `admin123`
- **Guest Mode**: Play without registration

## 🛠️ Technology Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router 4** - Client-side routing
- **Axios** - HTTP client
- **SCSS** - Styling
- **Font Awesome** - Icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend and database hosting

## 📦 Installation

### Prerequisites
- Node.js 16+
- MySQL (via Laragon or standalone)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/makerlove1/brightkidz.git
   cd brightkidz
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install --legacy-peer-deps
   
   # Backend
   cd backend
   npm install
   cd ..
   ```

3. **Setup database**
   - Start MySQL (via Laragon or standalone)
   - Create database: `edukiz`
   - Run: `backend/config/init-database.sql`

4. **Configure environment**
   ```bash
   # Backend: Update backend/.env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your-password
   DB_NAME=edukiz
   
   # Frontend: Update .env
   VUE_APP_API_URL=http://localhost:3000/api
   ```

5. **Create admin user**
   ```bash
   cd backend
   npm run create-admin
   ```

6. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   npm run serve
   ```

7. **Access the application**
   - Frontend: http://localhost:8080
   - Admin: http://localhost:8080/#/admin
   - API: http://localhost:3000

## 🚀 Deployment

### Quick Deploy to Vercel + Railway

1. **Deploy Backend to Railway**
   - Sign up at [railway.app](https://railway.app)
   - Deploy from GitHub repository
   - Add MySQL database
   - Set environment variables
   - Initialize database schema

2. **Deploy Frontend to Vercel**
   - Sign up at [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Set environment variable: `VUE_APP_API_URL`
   - Deploy!

For detailed deployment instructions, see:
- 📖 [Quick Deploy Guide](DEPLOY_TO_VERCEL.md)
- 📚 [Complete Deployment Guide](DEPLOYMENT_GUIDE.md)

## 📖 Documentation

### Setup Guides
- 🚀 [Quick Start](QUICK_START.md)
- ⚙️ [Admin Setup Guide](ADMIN_SETUP_GUIDE.md)
- 🔧 [System Architecture](SYSTEM_ARCHITECTURE.md)

### Development
- 🎮 [Game Integration Examples](INTEGRATION_EXAMPLE.md)
- 📊 [Progress Tracking Guide](src/mixins/progressTrackingMixin.js)
- 🌍 [Language System](LANGUAGE_SYSTEM_GUIDE.md)

### Deployment
- ☁️ [Vercel Deployment](VERCEL_DEPLOYMENT.md)
- 🚂 [Railway Setup](DEPLOYMENT_GUIDE.md)
- 📋 [Deployment Summary](DEPLOYMENT_SUMMARY.md)

## 🎮 Game Integration

Add progress tracking to your games:

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

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention
- ✅ CORS protection
- ✅ Role-based access control
- ✅ Secure session management

## 📊 Database Schema

### Core Tables
- **users** - User accounts and authentication
- **user_sessions** - Login/logout tracking
- **user_progress** - Game-by-game progress
- **game_statistics** - Aggregated user statistics

### Views
- **user_login_summary** - Login statistics per user
- **user_progress_summary** - Progress summary per user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- 📚 Check the [documentation files](/) in the repository
- 🔧 Review [troubleshooting guides](ADMIN_SETUP_GUIDE.md#troubleshooting)

### Issues
- 🐛 Report bugs via [GitHub Issues](https://github.com/makerlove1/brightkidz/issues)
- 💡 Request features via [GitHub Issues](https://github.com/makerlove1/brightkidz/issues)

### Quick Help
- ❓ Check [FAQ sections](ADMIN_SETUP_GUIDE.md#troubleshooting) in guides
- 🔍 Search existing [issues](https://github.com/makerlove1/brightkidz/issues)

## 🎯 Roadmap

### Upcoming Features
- [ ] Parent dashboard
- [ ] Teacher accounts
- [ ] Achievement system
- [ ] Leaderboards
- [ ] Email notifications
- [ ] Social login (Google, Facebook)
- [ ] Mobile app (React Native)
- [ ] Offline mode improvements

### Technical Improvements
- [ ] Redis caching
- [ ] Load balancing
- [ ] Database optimization
- [ ] Performance monitoring
- [ ] Automated testing
- [ ] CI/CD pipeline

## 📈 Stats

- 🎮 **Games**: Memory, Drag & Drop, Quiz
- 🌍 **Languages**: 3 (English, Filipino, German)
- 📱 **Platforms**: Web, PWA, Mobile-ready
- 🔒 **Security**: JWT, bcrypt, CORS
- ☁️ **Deployment**: Vercel + Railway

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Express.js for the robust backend framework
- Railway and Vercel for excellent hosting platforms
- Font Awesome for beautiful icons
- All contributors and testers

---

**Made with ❤️ for education**

*Empowering children's learning through interactive games and comprehensive progress tracking.*