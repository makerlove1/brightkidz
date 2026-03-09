<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <img src="img/logo.svg" class="login-logo" alt="BrightKidz logo" />
        <h1 class="app-name">BrightKidz</h1>
      </div>
      
      <h2 class="login-title">{{ isRegister ? t('register') : t('login') }}</h2>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="username">{{ t('username') }}</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            required
            :placeholder="t('enterUsername')"
          />
        </div>

        <div v-if="isRegister" class="form-group">
          <label for="email">{{ t('email') }}</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            :placeholder="t('enterEmail')"
          />
        </div>

        <div v-if="isRegister" class="form-group">
          <label for="fullName">{{ t('fullName') }}</label>
          <input
            id="fullName"
            v-model="formData.fullName"
            type="text"
            :placeholder="t('enterFullName')"
          />
        </div>

        <div class="form-group">
          <label for="password">{{ t('password') }}</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            :placeholder="t('enterPassword')"
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>

        <button type="submit" class="submit-button" :disabled="loading">
          {{ loading ? t('loading') : (isRegister ? t('register') : t('login')) }}
        </button>
      </form>

      <div class="toggle-mode">
        <button @click="toggleMode" class="toggle-button">
          {{ isRegister ? t('alreadyHaveAccount') : t('needAccount') }}
        </button>
      </div>

      <div class="guest-mode">
        <button @click="continueAsGuest" class="guest-button">
          <em class="fas fa-user-circle"></em>
          {{ t('continueAsGuest') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import languageManager from "@/utils/LanguageManager";
import { authService } from "@/services/authService";

export default {
  name: "Login",
  data() {
    return {
      isRegister: false,
      formData: {
        username: '',
        email: '',
        fullName: '',
        password: ''
      },
      error: '',
      success: '',
      loading: false
    };
  },
  mounted() {
    console.log('Login component mounted');
    console.log('Current route:', this.$route);
    
    // Reset form data on mount
    this.resetForm();
    
    // Check if register query parameter is present
    if (this.$route.query.register === 'true') {
      this.isRegister = true;
    }
  },
  methods: {
    t(key) {
      return languageManager.translate(key);
    },
    resetForm() {
      this.formData = {
        username: '',
        email: '',
        fullName: '',
        password: ''
      };
      this.error = '';
      this.success = '';
      this.loading = false;
    },
    toggleMode() {
      this.isRegister = !this.isRegister;
      this.resetForm();
    },
    async handleSubmit() {
      this.error = '';
      this.success = '';
      this.loading = true;

      try {
        if (this.isRegister) {
          await authService.register(this.formData);
          this.success = this.t('registrationSuccess');
          setTimeout(() => {
            this.isRegister = false;
            this.formData = { username: '', email: '', fullName: '', password: '' };
          }, 2000);
        } else {
          const response = await authService.login(this.formData.username, this.formData.password);
          // Clear guest mode on successful login
          localStorage.removeItem('guestMode');
          this.$router.push(response.user.role === 'admin' ? '/admin' : '/home');
        }
      } catch (error) {
        this.error = error.message || this.t('operationFailed');
      } finally {
        this.loading = false;
      }
    },
    continueAsGuest() {
      // Set guest mode flag
      localStorage.setItem('guestMode', 'true');
      this.$router.push('/home');
    }
  }
};
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  
  .login-logo {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
  }
  
  .app-name {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
}

.login-title {
  text-align: center;
  color: #667eea;
  margin-bottom: 30px;
  font-size: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    color: #333;
  }

  input {
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }
}

.error-message {
  color: #e53e3e;
  background: #fff5f5;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.success-message {
  color: #38a169;
  background: #f0fff4;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.toggle-mode {
  text-align: center;
  margin-top: 20px;
}

.toggle-button {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.95rem;

  &:hover {
    color: #764ba2;
  }
}

.guest-mode {
  text-align: center;
  margin-top: 15px;
}

.guest-button {
  background: #e0e0e0;
  color: #333;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;

  em {
    font-size: 1.2rem;
  }

  &:hover {
    background: #d0d0d0;
    transform: translateY(-1px);
  }
}

@media (max-width: 768px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>
