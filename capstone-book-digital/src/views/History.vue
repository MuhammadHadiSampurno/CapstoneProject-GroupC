
<template>
  <div class="history-page">
    <AppNavbar />

    <main class="history-content">

      <section class="page-header">

        <div>
          <h1>History</h1>

          <p>
            Buku yang baru saja Anda buka.
          </p>
        </div>

        <button
          v-if="historyBooks.length > 0"
          type="button"
          class="clear-history-button"
          @click="clearHistoryData"
        >
          Hapus History
        </button>

      </section>

      <section class="history-section">

        <div class="section-heading">
          <h2>
            Riwayat Buku
          </h2>

          <span class="book-count">
            {{ historyBooks.length }} buku
          </span>
        </div>

        <BookGrid
          v-if="historyBooks.length > 0"
          :books="historyBooks"
        />

        <div
          v-else
          class="empty-state"
        >
          <h3>Belum Ada History</h3>

          <p>
            Buku yang Anda buka akan muncul di halaman ini.
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
import {
  computed,
  ref
} from 'vue'

import AppNavbar from '../components/AppNavbar.vue'
import BookGrid from '../components/BookGrid.vue'

import bookData from '../data/bookData'

import {
  getLoggedInUser
} from '../services/authService'

import {
  getHistory,
  clearHistory
} from '../services/storageService'

export default {
  name: 'History',

  components: {
    AppNavbar,
    BookGrid
  },

  setup() {
    const currentUser = getLoggedInUser()

    const historyVersion = ref(0)

    const historyBooks = computed(() => {
      historyVersion.value

      if (!currentUser) {
        return []
      }

      const historyIds = getHistory(
        currentUser.id
      )

      return historyIds
        .map(id => {
          return bookData.find(
            book => book.id === id
          )
        })
        .filter(Boolean)
    })

    function clearHistoryData() {
      if (!currentUser) {
        return
      }

      clearHistory(currentUser.id)

      historyVersion.value++
    }

    return {
      historyBooks,
      clearHistoryData
    }
  }
}
</script>

<style scoped>
/* ================================
   HISTORY PAGE
================================ */

.history-page {
  min-height: 100vh;
  background-color: var(--color-secondary);
}

.history-content {
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;
  padding: 0 32px 70px;
}

/* ================================
   PAGE HEADER
================================ */

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 20px;

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
  margin: 8px 0 0;

  color: var(--color-gray);

  font-size: 14px;
  line-height: 1.7;
}

/* ================================
   CLEAR HISTORY BUTTON
================================ */

.clear-history-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  min-height: 40px;
  padding: 9px 15px;

  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-sm);

  background-color: var(--color-white);
  color: var(--color-gray);

  font-family: inherit;
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.clear-history-button:hover {
  background-color: #F6F8FC;
  border-color: #C8D2DF;
  color: var(--color-black);

  transform: translateY(-1px);
}

.clear-history-button:focus-visible {
  outline: 3px solid rgba(7, 90, 158, 0.2);
  outline-offset: 2px;
}

/* ================================
   HISTORY SECTION
================================ */

.history-section {
  width: 100%;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

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

/* ================================
   BOOK COUNT
================================ */

.book-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  min-height: 30px;
  padding: 5px 12px;

  border: 1px solid #dce8f3;
  border-radius: 999px;

  background-color: #eef5fb;
  color: var(--color-primary);

  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}

/* ================================
   EMPTY STATE
================================ */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 280px;
  padding: 45px 24px;

  text-align: center;

  background-color: var(--color-white);

  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-lg);

  box-shadow: var(--shadow-sm);
}

.empty-state h3 {
  margin: 0;

  color: var(--color-black);

  font-size: 20px;
  font-weight: 650;
  line-height: 1.4;
  letter-spacing: -0.3px;
}

.empty-state p {
  max-width: 500px;

  margin: 10px auto 24px;

  color: var(--color-gray);

  font-size: 14px;
  line-height: 1.7;
}

/* ================================
   ACTION BUTTON
================================ */

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 42px;
  padding: 10px 20px;

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
  line-height: 1.4;

  text-decoration: none;

  transition:
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.action-button:hover {
  background: linear-gradient(
    125deg,
    #003b9f 0%,
    #012e75 48%,
    #0845a9 100%
  );

  box-shadow: 0 4px 12px rgba(1, 58, 144, 0.2);

  transform: translateY(-1px);
}

.action-button:focus-visible {
  outline: 3px solid rgba(7, 90, 158, 0.2);
  outline-offset: 3px;
}

/* ================================
   RESPONSIVE: LAPTOP
================================ */

@media (max-width: 900px) {
  .history-content {
    padding-right: 24px;
    padding-left: 24px;
  }
}

/* ================================
   RESPONSIVE: TABLET
================================ */

@media (max-width: 768px) {
  .history-content {
    padding: 0 18px 55px;
  }

  .page-header {
    padding: 38px 0 30px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .section-heading h2 {
    font-size: 20px;
  }

  .empty-state {
    min-height: 250px;
  }
}

/* ================================
   RESPONSIVE: MOBILE
================================ */

@media (max-width: 480px) {
  .history-content {
    padding: 0 14px 40px;
  }

  .page-header {
    align-items: flex-start;
    gap: 16px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .page-header p {
    font-size: 13px;
  }

  .clear-history-button {
    min-height: 36px;
    padding: 8px 11px;

    font-size: 11px;
  }

  .section-heading {
    gap: 10px;
    margin-bottom: 20px;
  }

  .section-heading h2 {
    font-size: 19px;
  }

  .book-count {
    min-height: 28px;
    padding: 4px 10px;

    font-size: 11px;
  }

  .empty-state {
    min-height: 230px;
    padding: 35px 18px;

    border-radius: var(--radius-md);
  }

  .empty-state h3 {
    font-size: 18px;
  }

  .empty-state p {
    font-size: 13px;
  }

  .action-button {
    width: 100%;
    max-width: 220px;
  }
}

/* ================================
   REDUCED MOTION
================================ */

@media (prefers-reduced-motion: reduce) {
  .clear-history-button,
  .action-button {
    transition: none;
  }
}
</style>
