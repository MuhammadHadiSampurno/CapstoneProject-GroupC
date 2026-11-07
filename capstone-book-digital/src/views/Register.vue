
<template>
  <main class="register-page">
    <section class="register-card">

      <div class="register-header">
        <img
          src="/src/assets/images/logo-ut.png"
          alt="Logo Universitas Terbuka"
          class="ut-logo"
        />

        <h1>Buat Akun</h1>
        <p>Capstone Project Kelompok C</p>
        <span>Universitas Terbuka</span>
      </div>

      <form @submit.prevent="handleRegister">

        <div class="form-group">
          <label for="name">Nama</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Masukkan nama"
            required
          />
        </div>

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

        <div class="form-group">
          <label for="confirmPassword">
            Konfirmasi Password
          </label>

          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Masukkan kembali password"
            required
          />
        </div>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <p v-if="successMessage" class="success-message">
          {{ successMessage }}
        </p>

        <button type="submit" class="register-button">
          Buat Akun
        </button>
      </form>

      <div class="register-footer">
        <button
          type="button"
          class="link-button"
          @click="goToLogin"
        >
          Kembali ke Login User
        </button>
      </div>

    </section>
  </main>
</template>

<script>
import { registerUser } from '../services/authService'

export default {
  name: 'Register',

  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      successMessage: ''
    }
  },

  methods: {
    handleRegister() {
      this.errorMessage = ''
      this.successMessage = ''

      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Konfirmasi password tidak sesuai.'
        return
      }

      const result = registerUser(
        this.name,
        this.email,
        this.password
      )

      if (!result.success) {
        this.errorMessage = result.message
        return
      }

      this.successMessage = 'Akun berhasil dibuat. Silakan login.'

      this.name = ''
      this.email = ''
      this.password = ''
      this.confirmPassword = ''

      setTimeout(() => {
        this.$router.push('/login')
      }, 1000)
    },

    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.register-page {
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

.register-card {
  width: 100%;
  max-width: 440px;
  padding: 40px;
  background: #ffffff;
  border: 1px solid rgba(230, 234, 240, 0.9);
  border-radius: 20px;
  box-shadow:
    0 12px 35px rgba(25, 42, 70, 0.07),
    0 2px 8px rgba(25, 42, 70, 0.025);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.ut-logo {
  display: block;
  width: 86px;
  height: auto;
  object-fit: contain;
  margin: 0 auto 22px;
}

.register-header h1 {
  margin: 0;
  color: #202b3c;
  font-size: 23px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.45px;
}

.register-header p {
  margin: 7px 0 3px;
  color: #788396;
  font-size: 14px;
  font-weight: 400;
}

.register-header span {
  color: #075a9e;
  font-size: 13px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 19px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #344054;
  font-size: 13px;
  font-weight: 600;
}

.form-group input {
  display: block;
  width: 100%;
  min-height: 47px;
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

.register-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 49px;
  margin-top: 5px;
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

.register-button:hover {
  border-color: #064779;
  background: #064779;
  box-shadow: 0 5px 13px rgba(7, 90, 158, 0.17);
}

.register-button:active {
  transform: translateY(1px);
}

.register-button:focus-visible,
.link-button:focus-visible {
  outline: 3px solid rgba(7, 90, 158, 0.2);
  outline-offset: 3px;
}

.error-message,
.success-message {
  margin: 0 0 17px;
  padding: 12px 14px;
  border: 1px solid transparent;
  border-radius: 9px;
  font-size: 13px;
  line-height: 1.5;
}

.error-message {
  border-color: #f5caca;
  background: #fff4f4;
  color: #b42318;
}

.success-message {
  border-color: #b7e4c7;
  background: #f0faf4;
  color: #187344;
}

.register-footer {
  margin-top: 25px;
  padding-top: 21px;
  border-top: 1px solid #edf0f4;
  text-align: center;
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
  .register-page {
    padding: 24px 18px;
  }

  .register-card {
    max-width: 420px;
    padding: 36px 30px;
    border-radius: 18px;
  }

  .register-header {
    margin-bottom: 29px;
  }

  .ut-logo {
    width: 80px;
    margin-bottom: 20px;
  }
}

/* MOBILE */
@media (max-width: 380px) {
  .register-page {
    padding: 18px 13px;
  }

  .register-card {
    padding: 30px 22px;
    border-radius: 16px;
  }

  .register-header h1 {
    font-size: 21px;
  }

  .form-group {
    margin-bottom: 17px;
  }
}

/* REDUCED MOTION */
@media (prefers-reduced-motion: reduce) {
  .form-group input,
  .register-button,
  .link-button {
    transition: none;
  }
}
</style>
