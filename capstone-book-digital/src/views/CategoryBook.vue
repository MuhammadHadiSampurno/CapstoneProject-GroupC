
<template>
  <div class="category-book-page">
    <AppNavbar />

    <main class="category-book-content">
      <section class="page-header">
        <span class="category-label">
          Category Book
        </span>

        <h1>
          {{ categoryName }}
        </h1>

        <p>
          Koleksi buku berdasarkan kategori {{ categoryName }}.
        </p>
      </section>

      <section class="result-section">
        <div class="result-header">
          <div>
            <h2>
              Buku {{ categoryName }}
            </h2>

            <p>
              {{ filteredBooks.length }} buku tersedia
            </p>
          </div>
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
          <div class="empty-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
              <path d="M8 7h8" />
              <path d="M8 11h6" />
            </svg>
          </div>

          <h3>Buku tidak tersedia</h3>

          <p>
            Belum terdapat buku dalam kategori ini.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import BookGrid from '../components/BookGrid.vue'
import bookData from '../data/bookData'

export default {
  name: 'CategoryBook',

  components: {
    AppNavbar,
    BookGrid
  },

  setup() {
    const route = useRoute()

    const categoryMap = {
      fiksi: 'Fiksi',
      'non-fiksi': 'Non Fiksi',
      edukasi: 'Edukasi',
      'anak-remaja': 'Anak dan Remaja'
    }

    const categoryName = computed(() => {
      return categoryMap[route.params.category] || 'Kategori'
    })

    const filteredBooks = computed(() => {
      return bookData.filter(
        book => book.category === categoryName.value
      )
    })

    return {
      categoryName,
      filteredBooks
    }
  }
}
</script>

<style scoped>
.category-book-page {
  min-height: 100vh;
  background-color: var(--color-secondary);
}

.category-book-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 72px;
}

/* PAGE HEADER */
.page-header {
  padding: 64px 0 44px;
}

.category-label {
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

/* BOOK SECTION */
.result-section {
  width: 100%;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 28px;
  padding-bottom: 18px;

  border-bottom: 1px solid var(--color-light-gray);
}

.result-header h2 {
  margin: 0;

  color: var(--color-black);

  font-size: 23px;
  line-height: 1.4;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.result-header p {
  display: inline-flex;
  align-items: center;

  width: fit-content;
  margin: 8px 0 0;
  padding: 5px 11px;

  border-radius: 999px;

  background-color: #EDF4FA;
  color: var(--color-primary);

  font-size: 12px;
  font-weight: 600;
}

/* BOOK GRID */
.book-grid-wrapper {
  width: 100%;
}

/* EMPTY STATE */
.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 280px;
  padding: 48px 24px;

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

  width: 64px;
  height: 64px;
  margin-bottom: 20px;

  border-radius: 20px;

  background-color: #EDF4FA;
  color: var(--color-primary);
}

.empty-result h3 {
  margin: 0;

  color: var(--color-black);

  font-size: 19px;
  font-weight: 700;
}

.empty-result p {
  max-width: 360px;
  margin: 9px 0 0;

  color: var(--color-gray);

  font-size: 14px;
  line-height: 1.7;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .category-book-content {
    padding-right: 28px;
    padding-left: 28px;
  }

  .page-header {
    padding-top: 52px;
  }
}

@media (max-width: 768px) {
  .category-book-content {
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

  .result-header {
    margin-bottom: 22px;
    padding-bottom: 16px;
  }

  .result-header h2 {
    font-size: 21px;
  }

  .empty-result {
    min-height: 250px;
    padding: 36px 20px;
  }
}

@media (max-width: 480px) {
  .category-book-content {
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

  .category-label {
    margin-bottom: 12px;
    font-size: 10px;
  }

  .result-header h2 {
    font-size: 19px;
  }

  .result-header p {
    font-size: 11px;
  }

  .empty-result {
    min-height: 230px;
    padding: 30px 16px;
  }

  .empty-icon {
    width: 58px;
    height: 58px;
  }

  .empty-result h3 {
    font-size: 17px;
  }

  .empty-result p {
    font-size: 13px;
  }
}
</style>
