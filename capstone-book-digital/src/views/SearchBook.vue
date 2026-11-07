
<template>
  <div class="search-book-page">
    <AppNavbar />

    <main class="search-book-content">

      <section class="page-header">
        <span class="page-label">BOOK COLLECTION</span>

        <h1>Search Book</h1>

        <p>
          Temukan buku berdasarkan judul atau nama penulis.
        </p>
      </section>

      <section class="search-section">
        <div class="search-box-wrapper">
          <span class="search-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </span>

          <input
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="Cari judul buku atau nama penulis..."
          />

          <button
            v-if="searchKeyword"
            type="button"
            class="clear-button"
            aria-label="Hapus pencarian"
            @click="clearSearch"
          >
            ×
          </button>
        </div>
      </section>

      <section class="result-section">

        <div class="result-header">
          <div class="result-heading">
            <h2>
              {{ searchKeyword ? 'Hasil Pencarian' : 'Semua Buku' }}
            </h2>

            <p>
              {{ searchKeyword
                ? 'Buku yang sesuai dengan pencarianmu.'
                : 'Jelajahi koleksi buku yang tersedia.'
              }}
            </p>
          </div>

          <span class="result-count">
            {{ filteredBooks.length }} buku
          </span>
        </div>

        <div
          v-if="filteredBooks.length > 0"
          class="book-grid-wrapper"
        >
          <BookGrid :books="filteredBooks" />
        </div>

        <div
          v-else
          class="empty-result"
        >
          <div class="empty-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
              <path d="M8.5 11h5" />
            </svg>
          </div>

          <h3>Buku tidak ditemukan</h3>

          <p>
            Tidak ada buku yang sesuai dengan kata kunci
            "{{ searchKeyword }}".
          </p>

          <button
            type="button"
            class="reset-button"
            @click="clearSearch"
          >
            Tampilkan Semua Buku
          </button>
        </div>

      </section>

    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'
import BookGrid from '../components/BookGrid.vue'
import bookData from '../data/bookData'

export default {
  name: 'SearchBook',

  components: {
    AppNavbar,
    BookGrid
  },

  setup() {
    const searchKeyword = ref('')

    const filteredBooks = computed(() => {
      const keyword = searchKeyword.value
        .trim()
        .toLowerCase()

      if (!keyword) {
        return bookData
      }

      return bookData.filter(book => {
        const title = book.title.toLowerCase()
        const author = book.author.toLowerCase()

        return (
          title.includes(keyword) ||
          author.includes(keyword)
        )
      })
    })

    function clearSearch() {
      searchKeyword.value = ''
    }

    return {
      searchKeyword,
      filteredBooks,
      clearSearch
    }
  }
}
</script>

<style scoped>
/* ================================
   SEARCH BOOK PAGE
================================ */

.search-book-page {
  min-height: 100vh;
  background-color: var(--color-secondary);
}

.search-book-content {
  width: 100%;
  max-width: 1440px;

  margin: 0 auto;
  padding: 0 40px 80px;
}

/* ================================
   PAGE HEADER
================================ */

.page-header {
  padding: 55px 0 28px;
}

.page-label {
  display: inline-block;

  margin-bottom: 12px;

  color: var(--color-primary);

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.page-header h1 {
  margin: 0;

  color: var(--color-black);

  font-size: 34px;
  font-weight: 650;
  line-height: 1.3;
  letter-spacing: -0.6px;
}

.page-header p {
  margin: 9px 0 0;

  color: var(--color-gray);

  font-size: 14px;
  line-height: 1.7;
}

/* ================================
   SEARCH INPUT
================================ */

.search-section {
  margin-bottom: 44px;
}

.search-box-wrapper {
  position: relative;

  display: flex;
  align-items: center;

  width: 100%;
  max-width: 760px;
  min-height: 54px;

  overflow: hidden;

  background-color: var(--color-white);
  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-md);

  box-shadow: var(--shadow-sm);

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-box-wrapper:focus-within {
  border-color: var(--color-primary);

  box-shadow:
    0 0 0 3px rgba(7, 90, 158, 0.09),
    var(--shadow-sm);
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 52px;
  height: 52px;

  color: #8A96A6;
}

.search-icon svg {
  width: 19px;
  height: 19px;
}

.search-input {
  flex: 1;

  width: 100%;
  min-width: 0;
  height: 52px;

  padding: 0 12px 0 0;

  border: none;
  outline: none;

  background-color: transparent;
  color: var(--color-black);

  font-family: var(--font-family);
  font-size: 13px;
}

.search-input::placeholder {
  color: #98A2B3;
}

.clear-button {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 30px;
  height: 30px;

  margin-right: 12px;

  border: none;
  border-radius: 50%;

  background-color: #F0F2F5;
  color: var(--color-gray);

  font-size: 21px;
  line-height: 1;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.clear-button:hover {
  background-color: #E5EAF0;
  color: var(--color-black);
}

/* ================================
   RESULT SECTION
================================ */

.result-section {
  width: 100%;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
  margin-bottom: 26px;
}

.result-heading h2 {
  margin: 0;

  color: var(--color-black);

  font-size: 24px;
  font-weight: 650;
  letter-spacing: -0.4px;
}

.result-heading p {
  margin: 6px 0 0;

  color: var(--color-gray);

  font-size: 12px;
  line-height: 1.6;
}

.result-count {
  flex-shrink: 0;

  padding: 7px 12px;

  border: 1px solid var(--color-light-gray);
  border-radius: 999px;

  background-color: var(--color-white);
  color: var(--color-gray);

  font-size: 12px;
  font-weight: 600;
}

/* ================================
   EMPTY RESULT
================================ */

.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 290px;
  padding: 45px 24px;

  text-align: center;

  background-color: var(--color-white);
  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-lg);

  box-shadow: var(--shadow-sm);
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 58px;
  height: 58px;

  margin-bottom: 17px;

  border-radius: 50%;

  background-color: #F0F6FC;
  color: var(--color-primary);
}

.empty-icon svg {
  width: 25px;
  height: 25px;
}

.empty-result h3 {
  margin: 0;

  color: var(--color-black);

  font-size: 18px;
  font-weight: 650;
}

.empty-result p {
  max-width: 440px;

  margin: 10px auto 22px;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.7;

  overflow-wrap: anywhere;
}

/* ================================
   RESET BUTTON
================================ */

.reset-button {
  padding: 11px 18px;

  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);

  background-color: var(--color-primary);
  color: var(--color-white);

  font-family: var(--font-family);
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.reset-button:hover {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  transform: translateY(-1px);
}

.reset-button:focus-visible,
.clear-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

/* ================================
   RESPONSIVE: TABLET
================================ */

@media (max-width: 768px) {
  .search-book-content {
    padding: 0 22px 55px;
  }

  .page-header {
    padding-top: 42px;
  }

  .page-header h1 {
    font-size: 30px;
  }

  .search-section {
    margin-bottom: 36px;
  }

  .result-heading h2 {
    font-size: 21px;
  }
}

/* ================================
   RESPONSIVE: MOBILE
================================ */

@media (max-width: 520px) {
  .search-book-content {
    padding: 0 16px 40px;
  }

  .page-header {
    padding-top: 34px;
  }

  .page-header h1 {
    font-size: 27px;
  }

  .page-header p {
    font-size: 13px;
  }

  .search-box-wrapper {
    min-height: 49px;
  }

  .search-icon {
    width: 44px;
    height: 48px;
  }

  .search-input {
    height: 48px;
    font-size: 12px;
  }

  .result-header {
    align-items: flex-start;
    gap: 12px;
  }

  .result-heading h2 {
    font-size: 19px;
  }

  .result-heading p {
    font-size: 11px;
  }

  .result-count {
    padding: 6px 10px;
    font-size: 11px;
  }

  .empty-result {
    min-height: 260px;
    padding: 35px 18px;
  }

  .empty-result h3 {
    font-size: 17px;
  }

  .empty-result p {
    font-size: 12px;
  }
}

/* ================================
   REDUCED MOTION
================================ */

@media (prefers-reduced-motion: reduce) {
  .search-box-wrapper,
  .clear-button,
  .reset-button {
    transition: none;
  }

  .reset-button:hover {
    transform: none;
  }
}
</style>
