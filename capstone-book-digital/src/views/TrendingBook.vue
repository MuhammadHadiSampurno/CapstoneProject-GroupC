
<template>
  <div class="trending-book-page">
    <AppNavbar />

    <main class="trending-book-content">
      <section class="page-header">
        <span class="trending-label">
          Trending Book
        </span>

        <h1>
          Buku yang Sedang Populer
        </h1>

        <p>
          Koleksi buku yang diurutkan berdasarkan tingkat popularitas.
        </p>
      </section>

      <section class="trending-section">
        <div class="section-heading">
          <div>
            <h2>
              Trending Books
            </h2>

            <p>
              Urutan berdasarkan popularity score tertinggi.
            </p>
          </div>

          <span class="book-count">
            {{ trendingBooks.length }} buku
          </span>
        </div>

        <BookGrid :books="trendingBooks" />
      </section>
    </main>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'
import BookGrid from '../components/BookGrid.vue'
import { getTrendingBooks } from '../services/popularityService'

export default {
  name: 'TrendingBook',

  components: {
    AppNavbar,
    BookGrid
  },

  setup() {
    const trendingBooks = ref([])

    function refreshTrendingBooks() {
      trendingBooks.value = getTrendingBooks()
    }

    onMounted(() => {
      refreshTrendingBooks()
    })

    return {
      trendingBooks
    }
  }
}
</script>

<style scoped>
.trending-book-page {
  min-height: 100vh;
  background-color: var(--color-secondary);
}

.trending-book-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 72px;
}

/* PAGE HEADER */
.page-header {
  padding: 64px 0 44px;
}

.trending-label {
  display: inline-flex;
  align-items: center;

  margin-bottom: 14px;
  padding: 6px 12px;

  border: 1px solid rgba(7, 90, 158, 0.10);
  border-radius: 999px;

  background-color: #EDF4FA;
  color: var(--color-primary);

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.page-header h1 {
  margin: 0;

  color: var(--color-black);

  font-size: clamp(30px, 3vw, 38px);
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.8px;
}

.page-header p {
  max-width: 560px;
  margin: 12px 0 0;

  color: var(--color-gray);

  font-size: 15px;
  line-height: 1.7;
}

/* TRENDING SECTION */
.trending-section {
  width: 100%;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 18px;

  border-bottom: 1px solid var(--color-light-gray);
}

.section-heading h2 {
  margin: 0;

  color: var(--color-black);

  font-size: 23px;
  line-height: 1.4;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.section-heading p {
  margin: 8px 0 0;

  color: var(--color-gray);

  font-size: 14px;
  line-height: 1.6;
}

/* BOOK COUNT */
.book-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  padding: 7px 13px;

  border: 1px solid rgba(7, 90, 158, 0.10);
  border-radius: 999px;

  background-color: #EDF4FA;
  color: var(--color-primary);

  font-size: 12px;
  font-weight: 600;
}

/* BOOK GRID */
.trending-section :deep(.book-grid) {
  width: 100%;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .trending-book-content {
    padding-right: 28px;
    padding-left: 28px;
  }

  .page-header {
    padding-top: 52px;
  }
}

@media (max-width: 768px) {
  .trending-book-content {
    padding: 0 20px 48px;
  }

  .page-header {
    padding: 42px 0 34px;
  }

  .page-header h1 {
    font-size: 30px;
  }

  .page-header p {
    font-size: 14px;
  }

  .section-heading {
    margin-bottom: 22px;
    padding-bottom: 16px;
  }

  .section-heading h2 {
    font-size: 21px;
  }
}

@media (max-width: 520px) {
  .trending-book-content {
    padding-right: 16px;
    padding-left: 16px;
  }

  .page-header {
    padding-top: 34px;
    padding-bottom: 30px;
  }

  .page-header h1 {
    font-size: 27px;
    letter-spacing: -0.5px;
  }

  .page-header p {
    margin-top: 9px;
    font-size: 13px;
  }

  .trending-label {
    margin-bottom: 12px;
    font-size: 10px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .section-heading h2 {
    font-size: 19px;
  }

  .section-heading p {
    font-size: 13px;
  }

  .book-count {
    padding: 6px 11px;
    font-size: 11px;
  }
}
</style>
