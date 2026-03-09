/* eslint-disable no-console */

import { register } from "register-service-worker";

// Register service worker in both development and production
const shouldRegister = process.env.NODE_ENV === "production" || 
                       process.env.VUE_APP_REGISTER_SW === "true";

if (shouldRegister) {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "✅ App is being served from cache by a service worker.\n" +
        "📱 You can now use this app offline!"
      );
    },
    registered() {
      console.log("✅ Service worker has been registered.");
    },
    cached() {
      console.log("💾 Content has been cached for offline use.");
    },
    updatefound() {
      console.log("🔄 New content is downloading...");
    },
    updated(registration) {
      console.log("✨ New content is available; please refresh.");
      
      // Notify user about update
      if (confirm("New version available! Reload to update?")) {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
      }
    },
    offline() {
      console.log(
        "📵 No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("❌ Error during service worker registration:", error);
    },
  });
} else {
  console.log("ℹ️ Service worker not registered (development mode)");
}
