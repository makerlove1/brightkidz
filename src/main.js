import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/styles/global.scss";
import mitt from "mitt";

import Home from "./components/Home.vue";
import Memory from "./components/memory/MemoryNavPage.vue";
import MemoryAnimals from "./components/memory/MemoryAnimals.vue";
import MemoryCharacters from "./components/memory/MemoryCharacters.vue";
import DDNavPage from "./components/drag_drop/DDNavPage.vue";
import DDBuildWordsGame from "./components/drag_drop/DDBuildWordsGame.vue";
import DDCharacters from "./components/drag_drop/DDCharacters.vue";
import MiscNavPage from "./components/misc/MiscNavPage.vue";
import CalculateNumbers0To18 from "./components/misc/CalculateNumbers0To18.vue";
import QuizGame from "./components/misc/QuizGame.vue";
import ColorBlendingGame from "./components/misc/ColorBlendingGame.vue";
import ColorIdentificationGame from "./components/misc/ColorIdentificationGame.vue";
import Login from "./components/Login.vue";
import AdminDashboard from "./components/AdminDashboard.vue";
import UserProfile from "./components/UserProfile.vue";
import { authService } from "./services/authService";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
    },
    {
      path: "/admin",
      name: "AdminDashboard",
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/profile",
      name: "UserProfile",
      component: UserProfile,
      meta: { requiresAuth: true },
    },
    {
      path: "/memory",
      name: "Memory",
      component: Memory,
    },
    {
      path: "/memory/animals",
      name: "MemoryAnimals",
      component: MemoryAnimals,
    },
    {
      path: "/memory/characters",
      name: "MemoryCharacters",
      component: MemoryCharacters,
    },
    {
      path: "/dragdrop",
      name: "DragDrop",
      component: DDNavPage,
    },
    {
      path: "/dragdrop/build-words",
      name: "DDBuildWords",
      component: DDBuildWordsGame,
    },
    {
      path: "/dragdrop/characters",
      name: "DDCharacters",
      component: DDCharacters,
    },
    {
      path: "/misc",
      name: "Misc",
      component: MiscNavPage,
    },
    {
      path: "/misc/numbers-0-to-18",
      name: "CalculateNumbers0To18",
      component: CalculateNumbers0To18,
    },
    {
      path: "/misc/quiz",
      name: "QuizGame",
      component: QuizGame,
    },
    {
      path: "/misc/color-blending",
      name: "ColorBlendingGame",
      component: ColorBlendingGame,
    },
    {
      path: "/misc/color-identification",
      name: "ColorIdentificationGame",
      component: ColorIdentificationGame,
    },
  ],
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isAuthenticated = authService.isAuthenticated();
  
  // Special handling for admin logout - allow going to login page
  if (to.path === '/' && isAuthenticated) {
    // If coming from admin page, allow going to login (for admin logout)
    if (from.path === '/admin') {
      next();
    } else {
      // Regular users go to home
      next('/home');
    }
  } else if (requiresAuth && !isAuthenticated) {
    next('/');
  } else if (requiresAdmin && !authService.isAdmin()) {
    next('/home');
  } else {
    next();
  }
});

const emitter = mitt();
const app = createApp(App);
app.use(router);
app.config.globalProperties.emitter = emitter;
app.mount("#app");
