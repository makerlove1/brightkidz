/**
 * Language Manager
 * Handles language switching for UI text and audio
 */

import errorLogger from "@/utils/ErrorLogger";

class LanguageManager {
  constructor() {
    this.currentLanguage = 'en'; // Default to English
    this.listeners = [];
    this.initialized = false;
    
    // Initialize asynchronously
    this.initialize();
    
    this.translations = {
      en: {
        // Home page
        memory: "Memory",
        dragdrop: "Drag & Drop",
        misc: "More Games",
        memoryAlt: "memory games",
        dragdropAlt: "drag and drop games",
        miscAlt: "other games",
        
        // Quiz game
        quiz: "Quiz Game",
        quizAlt: "identify objects, letters and numbers",
        
        // Color blending game
        colorBlending: "Color Blending",
        colorBlendingAlt: "mix colors and learn color names",
        
        // Color identification game
        colorIdentification: "Color Identification",
        colorIdentificationAlt: "identify and learn color names",
        
        // Common
        back: "Back",
        help: "Help",
        settings: "Settings",
        language: "Language",
        voice: "Voice",
        
        // Voice options
        boyVoice: "Boy Voice",
        girlVoice: "Girl Voice",
        
        // Languages
        english: "English",
        filipino: "Filipino",
        german: "German",
        
        // Auth & Admin
        login: "Login",
        register: "Register",
        logout: "Logout",
        username: "Username",
        password: "Password",
        email: "Email",
        fullName: "Full Name",
        enterUsername: "Enter username",
        enterPassword: "Enter password",
        enterEmail: "Enter email",
        enterFullName: "Enter full name",
        alreadyHaveAccount: "Already have an account? Login",
        needAccount: "Need an account? Register",
        continueAsGuest: "Continue as Guest",
        guestMode: "Guest Mode",
        signUp: "Sign Up",
        registrationSuccess: "Registration successful! Please login.",
        operationFailed: "Operation failed. Please try again.",
        loading: "Loading",
        adminDashboard: "Admin Dashboard",
        refresh: "Refresh",
        totalUsers: "Total Users",
        activeUsers: "Active Users (7 days)",
        totalLogins: "Total Logins",
        totalGames: "Total Games Played",
        users: "Users",
        recentLogins: "Recent Logins",
        statistics: "Statistics",
        allUsers: "All Users",
        searchUsers: "Search users...",
        gamesPlayed: "Games Played",
        totalScore: "Total Score",
        lastLogin: "Last Login",
        actions: "Actions",
        loginTime: "Login Time",
        logoutTime: "Logout Time",
        duration: "Duration",
        active: "Active",
        detailedStatistics: "Detailed Statistics",
        topStarsEarners: "Top Stars Earners",
        topScorers: "Top Scorers",
        mostPlayedGames: "Most Played Games",
        rewards: "Rewards",
        loginHistory: "Login History",
        gameProgress: "Game Progress",
        completed: "Completed",
        inProgress: "In Progress",
        timeSpent: "Time Spent",
        recentProgress: "Recent Progress",
        noProgressYet: "No progress yet",
        backToGames: "Back to Games",
        
        // Daily Login Streak
        dailyLoginStreak: "Daily Login Streak",
        currentStreak: "Current Streak",
        longestStreak: "Longest Streak",
        totalDays: "Total Days",
        nextMilestone: "Next Milestone",
        days: "days",
        day: "Day",
        points: "Points",
        upcomingRewards: "Upcoming Rewards",
        continue: "Continue",
        welcomeBack: "Welcome Back!",
        keepGoing: "Keep Going!",
        
        // Level System
        level: "Level",
        levelUp: "Level Up",
        bonusPoints: "Bonus Points",
        awesome: "Awesome",
        currentLevel: "Current Level",
        totalStars: "Total Stars",
        starsToNext: "Stars to Next Level",
        levelHistory: "Level History",
        topLevels: "Top Levels",
        
        // Games
        games: {
          color_identification: {
            what_color_is_this: "What color is this?",
            score: "Score"
          }
        }
      },
      tl: {
        // Home page (Filipino/Tagalog)
        memory: "Memorya",
        dragdrop: "Gumalaw",
        misc: "Iba Pa",
        memoryAlt: "mga laro ng memorya",
        dragdropAlt: "mga laro ng hilahin at ilagay",
        miscAlt: "Iba pang mga laro",
        
        // Quiz game
        quiz: "Laro ng Pagsusulit",
        quizAlt: "kilalanin ang mga bagay, titik at numero",
        
        // Color blending game
        colorBlending: "Paghahalo ng Kulay",
        colorBlendingAlt: "maghalo ng mga kulay at matuto ng mga pangalan ng kulay",
        
        // Color identification game
        colorIdentification: "Pagkilala sa Kulay",
        colorIdentificationAlt: "kilalanin at matuto ng mga pangalan ng kulay",
        
        // Common
        back: "Bumalik",
        help: "Tulong",
        settings: "Mga Setting",
        language: "Wika",
        voice: "Tinig",
        
        // Voice options
        boyVoice: "Tinig ng Lalaki",
        girlVoice: "Tinig ng Babae",
        
        // Languages
        english: "Ingles",
        filipino: "Filipino",
        german: "Aleman",
        
        // Auth & Admin
        login: "Mag-login",
        register: "Magrehistro",
        logout: "Mag-logout",
        username: "Username",
        password: "Password",
        email: "Email",
        fullName: "Buong Pangalan",
        enterUsername: "Ilagay ang username",
        enterPassword: "Ilagay ang password",
        enterEmail: "Ilagay ang email",
        enterFullName: "Ilagay ang buong pangalan",
        alreadyHaveAccount: "May account na? Mag-login",
        needAccount: "Kailangan ng account? Magrehistro",
        continueAsGuest: "Magpatuloy bilang Bisita",
        guestMode: "Mode ng Bisita",
        signUp: "Mag-sign Up",
        registrationSuccess: "Matagumpay ang pagpaparehistro! Mangyaring mag-login.",
        operationFailed: "Nabigo ang operasyon. Subukan muli.",
        loading: "Naglo-load",
        adminDashboard: "Admin Dashboard",
        refresh: "I-refresh",
        totalUsers: "Kabuuang Users",
        activeUsers: "Aktibong Users (7 araw)",
        totalLogins: "Kabuuang Logins",
        totalGames: "Kabuuang Laro",
        users: "Mga User",
        recentLogins: "Kamakailang Logins",
        statistics: "Estadistika",
        allUsers: "Lahat ng Users",
        searchUsers: "Maghanap ng users...",
        gamesPlayed: "Mga Larong Nilaro",
        totalScore: "Kabuuang Puntos",
        lastLogin: "Huling Login",
        actions: "Mga Aksyon",
        loginTime: "Oras ng Login",
        logoutTime: "Oras ng Logout",
        duration: "Tagal",
        active: "Aktibo",
        detailedStatistics: "Detalyadong Estadistika",
        topStarsEarners: "Nangungunang Kumikita ng Bituin",
        topScorers: "Nangungunang Manlalaro",
        mostPlayedGames: "Pinaka-nilaro na Laro",
        rewards: "Mga Gantimpala",
        loginHistory: "Kasaysayan ng Login",
        gameProgress: "Progreso sa Laro",
        completed: "Tapos na",
        inProgress: "Ginagawa",
        timeSpent: "Oras na Ginugol",
        recentProgress: "Kamakailang Progreso",
        noProgressYet: "Walang progreso pa",
        backToGames: "Bumalik sa mga Laro",
        
        // Daily Login Streak
        dailyLoginStreak: "Araw-araw na Login Streak",
        currentStreak: "Kasalukuyang Streak",
        longestStreak: "Pinakamahabang Streak",
        totalDays: "Kabuuang Araw",
        nextMilestone: "Susunod na Milestone",
        days: "araw",
        day: "Araw",
        points: "Puntos",
        upcomingRewards: "Paparating na Gantimpala",
        continue: "Magpatuloy",
        welcomeBack: "Maligayang Pagbabalik!",
        keepGoing: "Ipagpatuloy!",
        
        // Level System
        level: "Antas",
        levelUp: "Tumaas ang Antas",
        bonusPoints: "Bonus na Puntos",
        awesome: "Kahanga-hanga",
        currentLevel: "Kasalukuyang Antas",
        totalStars: "Kabuuang Bituin",
        starsToNext: "Bituin sa Susunod na Antas",
        levelHistory: "Kasaysayan ng Antas",
        topLevels: "Nangungunang Antas",
        
        // Games
        games: {
          color_identification: {
            what_color_is_this: "Anong kulay ito?",
            score: "Puntos"
          }
        }
      },
      de: {
        // Home page (German)
        memory: "Memory",
        dragdrop: "Ziehen & Ablegen",
        misc: "Mehr Spiele",
        memoryAlt: "Memory-Spiele",
        dragdropAlt: "Drag-and-Drop-Spiele",
        miscAlt: "Andere Spiele",
        
        // Quiz game
        quiz: "Quiz-Spiel",
        quizAlt: "Objekte, Buchstaben und Zahlen identifizieren",
        
        // Color blending game
        colorBlending: "Farbmischen",
        colorBlendingAlt: "Farben mischen und Farbnamen lernen",
        
        // Color identification game
        colorIdentification: "Farberkennung",
        colorIdentificationAlt: "Farben erkennen und Farbnamen lernen",
        
        // Common
        back: "Zurück",
        help: "Hilfe",
        settings: "Einstellungen",
        language: "Sprache",
        voice: "Stimme",
        
        // Voice options
        boyVoice: "Jungenstimme",
        girlVoice: "Mädchenstimme",
        
        // Languages
        english: "Englisch",
        filipino: "Filipino",
        german: "Deutsch",
        
        // Auth & Admin
        login: "Anmelden",
        register: "Registrieren",
        logout: "Abmelden",
        username: "Benutzername",
        password: "Passwort",
        email: "E-Mail",
        fullName: "Vollständiger Name",
        enterUsername: "Benutzername eingeben",
        enterPassword: "Passwort eingeben",
        enterEmail: "E-Mail eingeben",
        enterFullName: "Vollständigen Namen eingeben",
        alreadyHaveAccount: "Bereits ein Konto? Anmelden",
        needAccount: "Konto benötigt? Registrieren",
        continueAsGuest: "Als Gast fortfahren",
        guestMode: "Gastmodus",
        signUp: "Registrieren",
        registrationSuccess: "Registrierung erfolgreich! Bitte anmelden.",
        operationFailed: "Vorgang fehlgeschlagen. Bitte erneut versuchen.",
        loading: "Lädt",
        adminDashboard: "Admin-Dashboard",
        refresh: "Aktualisieren",
        totalUsers: "Gesamtbenutzer",
        activeUsers: "Aktive Benutzer (7 Tage)",
        totalLogins: "Gesamtanmeldungen",
        totalGames: "Gespielte Spiele",
        users: "Benutzer",
        recentLogins: "Letzte Anmeldungen",
        statistics: "Statistiken",
        allUsers: "Alle Benutzer",
        searchUsers: "Benutzer suchen...",
        gamesPlayed: "Gespielte Spiele",
        totalScore: "Gesamtpunktzahl",
        lastLogin: "Letzte Anmeldung",
        actions: "Aktionen",
        loginTime: "Anmeldezeit",
        logoutTime: "Abmeldezeit",
        duration: "Dauer",
        active: "Aktiv",
        detailedStatistics: "Detaillierte Statistiken",
        topStarsEarners: "Top-Sterne-Verdiener",
        topScorers: "Top-Punktesammler",
        mostPlayedGames: "Meistgespielte Spiele",
        rewards: "Belohnungen",
        loginHistory: "Anmeldeverlauf",
        gameProgress: "Spielfortschritt",
        completed: "Abgeschlossen",
        inProgress: "In Bearbeitung",
        timeSpent: "Verbrachte Zeit",
        recentProgress: "Letzter Fortschritt",
        noProgressYet: "Noch kein Fortschritt",
        backToGames: "Zurück zu den Spielen",
        
        // Daily Login Streak
        dailyLoginStreak: "Tägliche Login-Serie",
        currentStreak: "Aktuelle Serie",
        longestStreak: "Längste Serie",
        totalDays: "Gesamttage",
        nextMilestone: "Nächster Meilenstein",
        days: "Tage",
        day: "Tag",
        points: "Punkte",
        upcomingRewards: "Kommende Belohnungen",
        continue: "Weiter",
        welcomeBack: "Willkommen zurück!",
        keepGoing: "Weiter so!",
        
        // Level System
        level: "Level",
        levelUp: "Level Aufstieg",
        bonusPoints: "Bonuspunkte",
        awesome: "Fantastisch",
        currentLevel: "Aktuelles Level",
        totalStars: "Gesamtsterne",
        starsToNext: "Sterne bis zum nächsten Level",
        levelHistory: "Level-Verlauf",
        topLevels: "Top-Level",
        
        // Games
        games: {
          color_identification: {
            what_color_is_this: "Welche Farbe ist das?",
            score: "Punkte"
          }
        }
      }
    };
  }

  async initialize() {
    if (this.initialized) return;
    
    const lang = await this.loadLanguage();
    if (lang !== this.currentLanguage) {
      this.currentLanguage = lang;
      this.notifyListeners();
    }
    this.initialized = true;
  }

  async loadLanguage() {
    try {
      // First check localStorage for immediate response
      const saved = localStorage.getItem('appLanguage');
      if (saved && ['en', 'tl', 'de'].includes(saved)) {
        return saved;
      }
      
      // Try to load from API if logged in
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const axios = (await import('axios')).default;
          const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';
          const response = await axios.get(
            `${API_URL}/preferences`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.language && ['en', 'tl', 'de'].includes(response.data.language)) {
            // Update localStorage for next time
            localStorage.setItem('appLanguage', response.data.language);
            return response.data.language;
          }
        } catch (apiError) {
          console.debug('Could not load language from API, using default');
        }
      }
      
      // Default to English
      return 'en';
    } catch (e) {
      errorLogger.logError('Failed to load language', e);
      return 'en';
    }
  }

  async saveLanguage(lang) {
    try {
      // Save to localStorage for backward compatibility
      localStorage.setItem('appLanguage', lang);
      
      // Save to API if logged in
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const axios = (await import('axios')).default;
          const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';
          await axios.post(
            `${API_URL}/preferences/language`,
            { language: lang },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (apiError) {
          console.debug('Could not save language to API');
        }
      }
      
      errorLogger.logInfo('Language saved', { language: lang });
    } catch (e) {
      errorLogger.logError('Failed to save language', e);
    }
  }

  async setLanguage(lang) {
    if (!['en', 'tl', 'de'].includes(lang)) {
      errorLogger.logWarning('Invalid language', { language: lang });
      return;
    }

    this.currentLanguage = lang;
    await this.saveLanguage(lang);
    this.notifyListeners();
    errorLogger.logInfo('Language changed', { language: lang });
  }

  getLanguage() {
    return this.currentLanguage;
  }

  translate(key) {
    const translation = this.translations[this.currentLanguage]?.[key];
    if (!translation) {
      errorLogger.logWarning('Translation missing', { key, language: this.currentLanguage });
      return key;
    }
    return translation;
  }

  t(key) {
    return this.translate(key);
  }

  // Get the sound path prefix based on current language
  getSoundPath() {
    const paths = {
      'en': 'english',
      'tl': 'filipino',
      'de': 'de'
    };
    return paths[this.currentLanguage] || 'english';
  }

  // Subscribe to language changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentLanguage);
      } catch (e) {
        errorLogger.logError('Language listener error', e);
      }
    });
  }

  // Get available languages
  getAvailableLanguages() {
    return [
      { code: 'en', name: this.translations.en.english, flag: '🇺🇸' },
      { code: 'tl', name: this.translations.tl.filipino, flag: '🇵🇭' },
      { code: 'de', name: this.translations.de.german, flag: '🇩🇪' }
    ];
  }
}

// Export singleton instance
export const languageManager = new LanguageManager();
export default languageManager;
