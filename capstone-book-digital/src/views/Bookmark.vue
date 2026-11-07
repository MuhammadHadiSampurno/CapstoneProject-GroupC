
<template>
  <div class="bookmark-page">
    <AppNavbar />

    <main class="bookmark-content">

      <section class="page-header">
        <h1>Bookmark</h1>

        <p>
          Buku yang Anda simpan untuk dibaca kembali.
        </p>
      </section>

      <section class="bookmark-section">

        <div class="section-heading">
          <h2>
            Buku Tersimpan
          </h2>

          <span class="book-count">
            {{ bookmarkedBooks.length }} buku
          </span>
        </div>

        <BookGrid
          v-if="bookmarkedBooks.length > 0"
          :books="bookmarkedBooks"
        />

        <div
          v-else
          class="empty-state"
        >
          <h3>Belum Ada Bookmark</h3>

          <p>
            Simpan buku yang ingin Anda baca kembali
            melalui halaman detail buku.
          </p>

          <router-link
            to="/search-book"
            class="action-button"
          >
            Cari Buku
          </router-link>
        </div>

      </section>

    </main>
  </div>
</template>

<script>
import { computed } from 'vue'

import AppNavbar from '../components/AppNavbar.vue'
import BookGrid from '../components/BookGrid.vue'

import bookData from '../data/bookData'

import {
  getLoggedInUser
} from '../services/authService'

import {
  getBookmarks
} from '../services/storageService'

export default {
  name: 'Bookmark',

  components: {
    AppNavbar,
    BookGrid
  },

  setup() {
    const currentUser = getLoggedInUser()

    const bookmarkedBooks = computed(() => {
      if (!currentUser) {
        return []
      }

      const bookmarkIds = getBookmarks(
        currentUser.id
      )

      return bookmarkIds
        .map(id => {
          return bookData.find(
            book => book.id === id
          )
        })
        .filter(Boolean)
    })

    return {
      bookmarkedBooks
    }
  }
}
</script>

<style scoped>
/* ==============================
   PAGE LAYOUT
============================== */

.bookmark-page {
  min-height: 100vh;
  background-color: var(--color-secondary);
}

.bookmark-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px 70px;
}

/* ==============================
   PAGE HEADER
============================== */

.page-header {
  padding: 52px 0 38px;
}

.page-header h1 {
  margin: 0;
  color: var(--color-black);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.5px;
}

.page-header p {
  margin: 9px 0 0;
  color: var(--color-gray);
  font-size: 14px;
  line-height: 1.7;
}

/* ==============================
   BOOKMARK SECTION
============================== */

.bookmark-section {
  width: 100%;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 25px;
}

.section-heading h2 {
  margin: 0;
  color: var(--color-black);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.3px;
}

.book-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 5px 12px;
  border: 1px solid #d9e6f8;
  border-radius: 999px;
  background-color: #eef4ff;
  color: #013a90;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

/* ==============================
   EMPTY STATE
============================== */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  padding: 45px 24px;
  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-lg);
  background-color: var(--color-white);
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.empty-state h3 {
  margin: 0;
  color: var(--color-black);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
}

.empty-state p {
  max-width: 440px;
  margin: 11px auto 23px;
  color: var(--color-gray);
  font-size: 14px;
  line-height: 1.8;
}

/* ==============================
   ACTION BUTTON
============================== */

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 10px 19px;

  border: 1px solid #013a90;
  border-radius: var(--radius-sm);

  background: linear-gradient(
    125deg,
    #0045bd 0%,
    #013a90 48%,
    #0b53c8 100%
  );

  color: var(--color-white);

  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.action-button:hover {
  border-color: #002f78;

  background: linear-gradient(
    125deg,
    #003b9f 0%,
    #012e75 48%,
    #0845a9 100%
  );

  box-shadow: 0 4px 12px rgba(1, 58, 144, 0.2);

  transform: translateY(-1px);
}

.action-button:active {
  transform: translateY(0);
}

.action-button:focus-visible {
  outline: 3px solid rgba(0, 69, 189, 0.2);
  outline-offset: 3px;
}

/* ==============================
   RESPONSIVE TABLET
============================== */

@media (max-width: 900px) {
  .bookmark-content {
    padding-right: 24px;
    padding-left: 24px;
  }

  .page-header {
    padding-top: 43px;
  }
}

/* ==============================
   RESPONSIVE MOBILE
============================== */

@media (max-width: 768px) {
  .bookmark-content {
    padding: 0 18px 45px;
  }

  .page-header {
    padding: 38px 0 30px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .page-header p {
    font-size: 13px;
  }

  .section-heading {
    margin-bottom: 20px;
  }

  .section-heading h2 {
    font-size: 20px;
  }

  .empty-state {
    min-height: 250px;
    padding: 35px 20px;
  }

  .empty-state h3 {
    font-size: 18px;
  }

  .empty-state p {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .bookmark-content {
    padding-right: 14px;
    padding-left: 14px;
  }

  .page-header {
    padding-top: 30px;
    padding-bottom: 26px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .section-heading h2 {
    font-size: 19px;
  }

  .book-count {
    min-height: 28px;
    font-size: 11px;
  }

  .empty-state {
    min-height: 230px;
    padding: 30px 17px;
    border-radius: var(--radius-md);
  }

  .empty-state h3 {
    font-size: 17px;
  }

  .empty-state p {
    font-size: 12px;
  }

  .action-button {
    width: 100%;
    max-width: 220px;
  }
}

/* ==============================
   REDUCED MOTION
============================== */

@media (prefers-reduced-motion: reduce) {
  .action-button {
    transition: none;
  }
}
</style>
