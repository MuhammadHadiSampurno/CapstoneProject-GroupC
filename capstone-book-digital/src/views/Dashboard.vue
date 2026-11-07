
<template>
  <div class="dashboard-page">
    <AppNavbar />

    <main class="dashboard-content">

      <section class="welcome-section">
        <div class="welcome-content">
          <span class="welcome-label">
            DIGITAL LIBRARY
          </span>

          <h1>
            Selamat Datang dan Rasakan
            <br />
            Kenikmatan Membaca
          </h1>

          <div class="quote-wrapper">
            <p class="quote">
              “Aku rela di penjara asalkan bersama buku,
              karena dengan buku aku bebas.”
            </p>

            <p class="quote-author">
              — Mohammad Hatta
            </p>
          </div>
        </div>
      </section>

      <section class="user-section">
        <p v-if="currentUser">
          Selamat datang,
          <strong>{{ currentUser.name }}</strong>
        </p>
      </section>

      <section class="book-section">
        <div class="section-heading">
          <div class="section-heading-info">
            <span class="section-label">
              EXPLORE COLLECTION
            </span>

            <h2>Koleksi Buku</h2>

            <p class="section-description">
              Koleksi buku yang tersedia dalam sistem.
            </p>
          </div>

          <router-link
            to="/search-book"
            class="view-all"
          >
            Lihat Semua
            <span aria-hidden="true">→</span>
          </router-link>
        </div>

        <BookGrid :books="books" />
      </section>

    </main>
  </div>
</template>

<script>
import { getLoggedInUser } from '../services/authService'
import AppNavbar from '../components/AppNavbar.vue'
import BookGrid from '../components/BookGrid.vue'
import bookData from '../data/bookData'

export default {
  name: 'Dashboard',

  components: {
    AppNavbar,
    BookGrid
  },

  data() {
    return {
      currentUser: getLoggedInUser(),
      books: bookData
    }
  }
}
</script>

<style scoped>
/* ================================
   DASHBOARD
================================ */

.dashboard-page {
  min-height: 100vh;
  background-color: var(--color-secondary);
}

.dashboard-content {
  width: 100%;
  max-width: 1440px;

  margin: 0 auto;
  padding: 0 40px 80px;
}

/* ================================
   WELCOME SECTION
================================ */

.welcome-section {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 340px;

  margin-top: 30px;
  padding: 65px 35px;

  overflow: hidden;

  background: linear-gradient(
    125deg,
    #0045bd 0%,
    #013a90 48%,
    #0b53c8 100%
  );

  border: 1px solid rgba(7, 90, 158, 0.3);
  border-radius: 24px;
}

.welcome-content {
  position: relative;
  z-index: 1;

  width: 100%;
  max-width: 850px;

  text-align: center;
}

.welcome-label,
.section-label {
  display: inline-block;

  color: var(--color-primary);

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
}

/* Warna khusus teks Welcome Section */
.welcome-label {
  color: var(--color-white);
}

.welcome-section h1 {
  max-width: 800px;

  margin: 18px auto 0;

  color: var(--color-white);

  font-size: 38px;
  font-weight: 650;
  line-height: 1.3;
  letter-spacing: -0.8px;
}

/* ================================
   QUOTE
================================ */

.quote-wrapper {
  max-width: 680px;

  margin: 26px auto 0;
  padding: 18px 24px 0;

  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.quote {
  margin: 0;

  color: rgba(255, 255, 255, 0.92);

  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
}

.quote-author {
  margin: 9px 0 0;

  color: var(--color-white);

  font-size: 13px;
  font-weight: 600;
}

/* ================================
   USER GREETING
================================ */

.user-section {
  display: flex;
  justify-content: center;

  margin-top: 24px;
}

.user-section p {
  margin: 0;

  padding: 10px 18px;

  border: 1px solid var(--color-light-gray);
  border-radius: 999px;

  background-color: var(--color-white);
  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.5;
}

.user-section strong {
  color: var(--color-primary);
  font-weight: 650;
}

/* ================================
   BOOK COLLECTION
================================ */

.book-section {
  margin-top: 68px;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 24px;
  margin-bottom: 26px;
}

.section-heading-info {
  min-width: 0;
}

.section-heading h2 {
  margin: 9px 0 0;

  color: var(--color-black);

  font-size: 27px;
  font-weight: 650;
  letter-spacing: -0.5px;
  line-height: 1.35;
}

.section-description {
  margin: 7px 0 0;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.6;
}

/* ================================
   VIEW ALL LINK
================================ */

.view-all {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  gap: 9px;

  padding: 10px 15px;

  border: 1px solid rgba(7, 90, 158, 0.17);
  border-radius: var(--radius-sm);

  background-color: var(--color-white);
  color: var(--color-primary);

  font-size: 12px;
  font-weight: 600;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.view-all:hover {
  background-color: #F0F6FC;
  border-color: rgba(7, 90, 158, 0.35);
  transform: translateY(-1px);
}

.view-all span {
  font-size: 16px;
  line-height: 1;
}

/* ================================
   RESPONSIVE: TABLET
================================ */

@media (max-width: 768px) {
  .dashboard-content {
    padding: 0 22px 55px;
  }

  .welcome-section {
    min-height: 300px;

    margin-top: 22px;
    padding: 50px 25px;

    border-radius: 20px;
  }

  .welcome-section h1 {
    font-size: 30px;
  }

  .quote {
    font-size: 14px;
  }

  .book-section {
    margin-top: 52px;
  }

  .section-heading h2 {
    font-size: 23px;
  }
}

/* ================================
   RESPONSIVE: MOBILE
================================ */

@media (max-width: 520px) {
  .dashboard-content {
    padding: 0 16px 40px;
  }

  .welcome-section {
    min-height: auto;

    margin-top: 16px;
    padding: 42px 18px;

    border-radius: 16px;
  }

  .welcome-label,
  .section-label {
    font-size: 9px;
    letter-spacing: 1.6px;
  }

  .welcome-section h1 {
    margin-top: 14px;

    font-size: 25px;
    line-height: 1.35;
    letter-spacing: -0.4px;
  }

  .quote-wrapper {
    margin-top: 21px;
    padding: 17px 5px 0;
  }

  .quote {
    font-size: 13px;
    line-height: 1.7;
  }

  .quote-author {
    font-size: 12px;
  }

  .user-section {
    margin-top: 18px;
  }

  .user-section p {
    padding: 9px 14px;
    font-size: 12px;
  }

  .book-section {
    margin-top: 44px;
  }

  .section-heading {
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 20px;
  }

  .section-heading h2 {
    font-size: 21px;
  }

  .section-description {
    font-size: 12px;
  }

  .view-all {
    padding: 9px 11px;
    font-size: 11px;
  }
}

/* ================================
   RESPONSIVE: SMALL MOBILE
================================ */

@media (max-width: 360px) {
  .welcome-section {
    padding: 35px 14px;
  }

  .welcome-section h1 {
    font-size: 22px;
  }

  .section-heading {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* ================================
   REDUCED MOTION
================================ */

@media (prefers-reduced-motion: reduce) {
  .view-all {
    transition: none;
  }
}
</style>
