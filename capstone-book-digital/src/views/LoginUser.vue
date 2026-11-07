
<template>
  <main class="login-page">
    <section class="login-card">

      <div class="login-header">
        <img
          src="/src/assets/images/logo-ut.png"
          alt="Logo Universitas Terbuka"
          class="ut-logo"
        />

        <h1>Capstone Project Kelompok C</h1>
        <p>Universitas Terbuka</p>
        <span class="login-role">Login Pengguna</span>
      </div>

      <form @submit.prevent="handleLogin">

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Masukkan email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Masukkan password"
            required
          />
        </div>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <button type="submit" class="login-button">
          Login
        </button>
      </form>

      <div class="login-footer">
        <button
          type="button"
          class="link-button"
          @click="goToRegister"
        >
          Buat Akun
        </button>

        <button
          type="button"
          class="link-button"
          @click="goToAdminLogin"
        >
          Login Sebagai Admin
        </button>
      </div>

    </section>
  </main>
</template>

<script>
import { login } from '../services/authService'

export default {
  name: 'LoginUser',

  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },

  methods: {
    handleLogin() {
      this.errorMessage = ''

      const result = login(
        this.email,
        this.password,
        'user'
      )

      if (!result.success) {
        this.errorMessage = result.message
        return
      }

      this.$router.push('/dashboard')
    },

    goToRegister() {
      this.$router.push('/register')
    },

    goToAdminLogin() {
      this.$router.push('/login-admin')
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 20px;
  background:
    radial-gradient(
      circle at 15% 15%,
      rgba(7, 90, 158, 0.055),
      transparent 35%
    ),
    linear-gradient(
      145deg,
      #f7f9fc 0%,
      #eef3f9 100%
    );
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: 44px 40px;
  background: #ffffff;
  border: 1px solid rgba(230, 234, 240, 0.9);
  border-radius: 20px;
  box-shadow:
    0 12px 35px rgba(25, 42, 70, 0.07),
    0 2px 8px rgba(25, 42, 70, 0.025);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.ut-logo {
  display: block;
  width: 86px;
  height: auto;
  object-fit: contain;
  margin: 0 auto 24px;
}

.login-header h1 {
  margin: 0;
  color: #202b3c;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.45px;
}

.login-header p {
  margin: 7px 0 17px;
  color: #788396;
  font-size: 14px;
  font-weight: 400;
}

.login-role {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 15px;
  border: 1px solid rgba(7, 90, 158, 0.10);
  border-radius: 30px;
  background: #edf5fc;
  color: #075a9e;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.form-group {
  margin-bottom: 21px;
}

.form-group label {
  display: block;
  margin-bottom: 9px;
  color: #344054;
  font-size: 13px;
  font-weight: 600;
}

.form-group input {
  display: block;
  width: 100%;
  min-height: 48px;
  padding: 12px 15px;
  border: 1px solid #dfe5ed;
  border-radius: 10px;
  outline: none;
  background: #ffffff;
  color: #202b3c;
  font-family: inherit;
  font-size: 14px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-group input::placeholder {
  color: #a0a9b7;
  font-size: 13px;
}

.form-group input:hover {
  border-color: #bdc9d8;
}

.form-group input:focus {
  border-color: #075a9e;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(7, 90, 158, 0.09);
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 49px;
  margin-top: 7px;
  padding: 13px 18px;
  border: 1px solid #075a9e;
  border-radius: 10px;
  background: #075a9e;
  color: #ffffff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.login-button:hover {
  border-color: #064779;
  background: #064779;
  box-shadow: 0 5px 13px rgba(7, 90, 158, 0.17);
}

.login-button:active {
  transform: translateY(1px);
}

.login-button:focus-visible,
.link-button:focus-visible {
  outline: 3px solid rgba(7, 90, 158, 0.2);
  outline-offset: 3px;
}

.error-message {
  margin: 0 0 17px;
  padding: 12px 14px;
  border: 1px solid #f5caca;
  border-radius: 9px;
  background: #fff4f4;
  color: #b42318;
  font-size: 13px;
  line-height: 1.5;
}

.login-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 25px;
  padding-top: 21px;
  border-top: 1px solid #edf0f4;
}

.link-button {
  padding: 4px 0;
  border: none;
  background: transparent;
  color: #075a9e;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.link-button:hover {
  color: #064779;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* TABLET */
@media (max-width: 600px) {
  .login-page {
    padding: 24px 18px;
  }

  .login-card {
    max-width: 420px;
    padding: 38px 30px;
    border-radius: 18px;
  }

  .login-header {
    margin-bottom: 31px;
  }

  .ut-logo {
    width: 80px;
    margin-bottom: 21px;
  }
}

/* MOBILE */
@media (max-width: 380px) {
  .login-page {
    padding: 18px 13px;
  }

  .login-card {
    padding: 32px 22px;
    border-radius: 16px;
  }

  .login-header h1 {
    font-size: 19px;
  }

  .login-footer {
    flex-direction: column;
    align-items: center;
    gap: 13px;
  }
}

/* REDUCED MOTION */
@media (prefers-reduced-motion: reduce) {
  .form-group input,
  .login-button,
  .link-button {
    transition: none;
  }
}
</style>
