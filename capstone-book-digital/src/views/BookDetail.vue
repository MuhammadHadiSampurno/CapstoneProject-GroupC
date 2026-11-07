
<template>
  <div class="book-detail-page">
    <AppNavbar />

    <main class="book-detail-content">
      <div v-if="book" class="detail-wrapper">
        <router-link to="/search-book" class="back-link">
          ← Kembali ke Search Book
        </router-link>

        <!-- Detail Buku -->
        <section class="book-detail-card">
          <div class="book-cover-section">
            <img
              :src="book.cover"
              :alt="`Cover ${book.title}`"
              class="book-cover"
            />
          </div>

          <div class="book-info-section">
            <span class="book-category">
              {{ book.category }}
            </span>

            <h1 class="book-title">
              {{ book.title }}
            </h1>

            <p class="book-author">
              {{ book.author }}
            </p>

            <!-- Rating awal dataset dan popularitas tetap terpisah. -->
            <div class="book-rating-row">
              <span
                v-if="book.rating !== null && book.rating !== undefined"
                class="rating"
              >
                ★ {{ book.rating }}
              </span>

              <span v-else class="rating unavailable">
                Rating awal belum tersedia
              </span>

              <span class="popularity">
                Popularity
                {{
                  popularityScore === null
                    ? 'Belum tersedia'
                    : popularityScore.toFixed(2)
                }}
              </span>
            </div>

            <!-- Tombol Baca Buku -->
            <div class="book-action-buttons">
              <button
                type="button"
                class="read-book-button"
                :disabled="!book.pdfUrl"
                @click="openBookReader"
              >
                <span aria-hidden="true">📖</span>
                {{ book.pdfUrl ? 'Baca Buku' : 'PDF Belum Tersedia' }}
              </button>

              <!-- Bookmark -->
              <button
                type="button"
                class="bookmark-button"
                :class="{ bookmarked: isBookmarked }"
                @click="toggleBookmark"
              >
                {{ isBookmarked ? '★' : '☆' }}
                {{
                  isBookmarked
                    ? 'Bookmarked'
                    : 'Tambah ke Bookmark'
                }}
              </button>
            </div>

            <p
              v-if="bookmarkMessage"
              class="feedback-message"
              :class="{ 'error-message': bookmarkError }"
              role="status"
            >
              {{ bookmarkMessage }}
            </p>

            <!-- Rating Pengguna -->
            <section class="user-rating-section">
              <h2>Rating Pengguna</h2>

              <div
                v-if="ratingSummary.count > 0"
                class="rating-summary"
              >
                <span class="summary-stars" aria-hidden="true">
                  ★
                </span>

                <strong class="summary-average">
                  {{ ratingSummary.average.toFixed(1) }}
                </strong>

                <span class="summary-count">
                  dari {{ ratingSummary.count }}
                  {{ ratingSummary.count === 1 ? 'rating' : 'rating' }}
                </span>
              </div>

              <p v-else class="empty-rating">
                Belum ada rating pengguna.
              </p>

              <p
                v-if="ratingError"
                class="feedback-message error-message"
                role="alert"
              >
                {{ ratingError }}
              </p>

              <p
                v-if="ratingMessage"
                class="feedback-message"
                role="status"
              >
                {{ ratingMessage }}
              </p>

              <template v-if="currentUser">
                <div class="rating-form">
                  <h3>
                    {{
                      userRating
                        ? 'Ubah Rating Anda'
                        : 'Berikan Rating'
                    }}
                  </h3>

                  <p class="rating-instruction">
                    Pilih 1 sampai 5 bintang.
                  </p>

                  <div
                    class="star-picker"
                    role="group"
                    aria-label="Pilih rating buku"
                  >
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      class="star-button"
                      :class="{
                        selected: star <= selectedScore
                      }"
                      :aria-label="`${star} dari 5 bintang`"
                      :aria-pressed="selectedScore === star"
                      @click="selectScore(star)"
                    >
                      {{ star <= selectedScore ? '★' : '☆' }}
                    </button>
                  </div>

                  <p
                    v-if="userRating"
                    class="existing-rating"
                  >
                    Rating Anda saat ini:
                    <strong>{{ userRating.score }}/5</strong>
                  </p>

                  <div class="rating-actions">
                    <button
                      type="button"
                      class="rating-submit-button"
                      :disabled="
                        selectedScore < 1 || isRatingLoading
                      "
                      @click="saveRating"
                    >
                      {{
                        isRatingLoading
                          ? 'Menyimpan...'
                          : userRating
                            ? 'Perbarui Rating'
                            : 'Kirim Rating'
                      }}
                    </button>

                    <button
                      v-if="userRating"
                      type="button"
                      class="rating-delete-button"
                      :disabled="isRatingLoading"
                      @click="deleteMyRating"
                    >
                      {{
                        isRatingLoading
                          ? 'Memproses...'
                          : 'Hapus Rating'
                      }}
                    </button>
                  </div>
                </div>
              </template>

              <div v-else class="login-rating-prompt">
                <p>
                  Login terlebih dahulu untuk memberikan rating
                  pada buku ini.
                </p>

                <button
                  type="button"
                  class="rating-submit-button"
                  @click="goToLogin"
                >
                  Login untuk Memberi Rating
                </button>
              </div>
            </section>

            <!-- Deskripsi Buku -->
            <div class="book-description">
              <h2>Deskripsi</h2>
              <p>{{ book.description }}</p>
            </div>

            <!-- Metadata Buku -->
            <div class="book-metadata">
              <div class="metadata-item">
                <span class="metadata-label">Tahun Terbit</span>
                <span class="metadata-value">
                  {{ book.publishedDate || 'Tidak tersedia' }}
                </span>
              </div>

              <div class="metadata-item">
                <span class="metadata-label">Publisher</span>
                <span class="metadata-value">
                  {{ book.publisher || 'Tidak tersedia' }}
                </span>
              </div>

              <div class="metadata-item">
                <span class="metadata-label">Bahasa</span>
                <span class="metadata-value">
                  {{ book.language || 'Tidak tersedia' }}
                </span>
              </div>

              <div class="metadata-item">
                <span class="metadata-label">ISBN</span>
                <span class="metadata-value">
                  {{ book.isbn || 'Tidak tersedia' }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Rekomendasi Buku Berbasis Machine Learning -->
        <section class="recommendation-section">
          <div class="recommendation-header">
            <h2>Rekomendasi Buku Serupa</h2>

            <p>
              Temukan buku lainnya berdasarkan kemiripan konten
              menggunakan metode TF-IDF dan Cosine Similarity.
            </p>
          </div>

          <!-- Loading -->
          <div
            v-if="isRecommendationLoading"
            class="recommendation-message"
            role="status"
          >
            <span class="loading-indicator"></span>
            <p>Mencari rekomendasi buku...</p>
          </div>

          <!-- Error -->
          <p
            v-else-if="recommendationError"
            class="recommendation-error"
            role="alert"
          >
            {{ recommendationError }}
          </p>

          <!-- Hasil Rekomendasi -->
          <div
            v-else-if="recommendedBooks.length > 0"
            class="recommendation-grid"
          >
            <div
              v-for="recommendedBook in recommendedBooks"
              :key="recommendedBook.id"
              class="recommendation-item"
            >
              <BookCard :book="recommendedBook" />

              <p class="recommendation-similarity">
                Kemiripan Konten:
                <strong>
                  {{
                    (recommendedBook.similarity * 100).toFixed(2)
                  }}%
                </strong>
              </p>
            </div>
          </div>

          <!-- Tidak ada hasil -->
          <p
            v-else
            class="recommendation-message"
          >
            Belum ada rekomendasi buku yang tersedia.
          </p>

          <p class="recommendation-note">
            Persentase menunjukkan tingkat kemiripan konten antar buku,
            bukan probabilitas pengguna menyukai buku tersebut.
          </p>
        </section>
      </div>

      <!-- Buku Tidak Ditemukan -->
      <section v-else class="book-not-found">
        <h1>Buku Tidak Ditemukan</h1>

        <p>
          Data buku yang Anda cari tidak tersedia dalam sistem.
        </p>

        <router-link to="/dashboard" class="back-button">
          Kembali ke Dashboard
        </router-link>
      </section>
    </main>
  </div>
</template>

<script>
import {
  computed,
  ref,
  watch
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import AppNavbar from '../components/AppNavbar.vue'
import BookCard from '../components/BookCard.vue'

import bookData from '../data/bookData'

import {
  getLoggedInUser
} from '../services/authService'

import {
  addBookmark,
  removeBookmark,
  isBookmarked as checkBookmark,
  addHistory,
  recordBookVisit,
  getRatingSummary,
  getUserRating,
  addRating,
  updateRating,
  deleteRating
} from '../services/storageService'

import {
  getBookRecommendations
} from '../services/bookService'

import {
  getBookPopularity
} from '../services/popularityService'

export default {
  name: 'BookDetail',

  components: {
    AppNavbar,
    BookCard
  },

  setup() {
    const route = useRoute()
    const router = useRouter()

    const currentUser = ref(getLoggedInUser())

    // ==============================
    // BOOKMARK
    // ==============================

    const isBookmarked = ref(false)
    const bookmarkMessage = ref('')
    const bookmarkError = ref(false)

    // ==============================
    // RATING
    // ==============================

    const ratingSummary = ref({
      average: null,
      count: 0
    })

    const userRating = ref(null)
    const selectedScore = ref(0)

    const ratingError = ref('')
    const ratingMessage = ref('')
    const isRatingLoading = ref(false)

    // ==============================
    // DETAIL BUKU
    // ==============================

    const book = computed(() => {
      return bookData.find(
        item => item.id === route.params.id
      ) || null
    })

    // ==============================
    // PDF READER NAVIGATION
    // ==============================

    function openBookReader() {
      if (!book.value || !book.value.pdfUrl) {
        return
      }

      router.push({
        name: 'BookReader',
        params: {
          id: book.value.id
        }
      })
    }

    // ==============================
    // POPULARITY
    // ==============================

    const popularityScore = ref(null)

    function loadBookPopularity() {
      if (!book.value) {
        popularityScore.value = null
        return
      }

      try {
        const popularityData = getBookPopularity(book.value.id)

        popularityScore.value =
          popularityData?.popularityScore ?? null
      } catch (error) {
        popularityScore.value = null

        console.error(
          'Gagal memuat skor popularitas buku:',
          error
        )
      }
    }

    function recordCurrentBookVisit() {
      if (!book.value) {
        return
      }

      try {
        recordBookVisit(
          book.value.id,
          currentUser.value?.id || null
        )
      } catch (error) {
        // Kegagalan pencatatan kunjungan tidak boleh
        // menghentikan detail dan fitur lainnya.
        console.error(
          'Gagal mencatat kunjungan buku:',
          error
        )
      }

      // Perbarui skor setelah kunjungan tercatat.
      loadBookPopularity()
    }

    // ==============================
    // REKOMENDASI MACHINE LEARNING
    // ==============================

    const recommendations = ref([])
    const isRecommendationLoading = ref(false)
    const recommendationError = ref('')

    // Penanda permintaan untuk mencegah respons
    // buku sebelumnya menimpa hasil buku yang sedang dibuka.
    let recommendationRequestId = 0

    // Mencocokkan ID rekomendasi dari Python
    // dengan data buku lokal untuk memperoleh cover.
    const recommendedBooks = computed(() => {
      return recommendations.value
        .map(recommendation => {
          const localBook = bookData.find(
            item => item.id === recommendation.id
          )

          if (!localBook) {
            return null
          }

          return {
            ...localBook,
            similarity: recommendation.similarity
          }
        })
        .filter(Boolean)
    })

    async function loadRecommendations(bookId) {
      const requestId = ++recommendationRequestId

      recommendations.value = []
      recommendationError.value = ''

      if (!bookId) {
        isRecommendationLoading.value = false
        return
      }

      isRecommendationLoading.value = true

      try {
        const result = await getBookRecommendations(
          bookId,
          3
        )

        // Abaikan respons dari permintaan buku sebelumnya.
        if (requestId !== recommendationRequestId) {
          return
        }

        recommendations.value = result
      } catch (error) {
        if (requestId !== recommendationRequestId) {
          return
        }

        recommendationError.value =
          error instanceof Error
            ? error.message
            : 'Rekomendasi buku gagal dimuat.'
      } finally {
        if (requestId === recommendationRequestId) {
          isRecommendationLoading.value = false
        }
      }
    }

    // ==============================
    // PESAN ERROR
    // ==============================

    function getErrorMessage(error, fallback) {
      if (error instanceof Error && error.message) {
        return `${fallback}: ${error.message}`
      }

      return fallback
    }

    // ==============================
    // BOOKMARK FUNCTIONS
    // ==============================

    function loadBookmarkStatus() {
      bookmarkMessage.value = ''
      bookmarkError.value = false

      if (!currentUser.value || !book.value) {
        isBookmarked.value = false
        return
      }

      try {
        isBookmarked.value = checkBookmark(
          currentUser.value.id,
          book.value.id
        )
      } catch (error) {
        isBookmarked.value = false
        bookmarkError.value = true
        bookmarkMessage.value =
          'Status bookmark gagal dimuat. Periksa penyimpanan browser.'
      }
    }

    function toggleBookmark() {
      bookmarkMessage.value = ''
      bookmarkError.value = false

      if (!currentUser.value) {
        router.push('/login')
        return
      }

      if (!book.value) {
        return
      }

      try {
        if (isBookmarked.value) {
          removeBookmark(
            currentUser.value.id,
            book.value.id
          )

          isBookmarked.value = false
          bookmarkMessage.value =
            'Buku berhasil dihapus dari bookmark.'
          loadBookPopularity()
        } else {
          addBookmark(
            currentUser.value.id,
            book.value.id
          )

          isBookmarked.value = true
          bookmarkMessage.value =
            'Buku berhasil ditambahkan ke bookmark.'
          loadBookPopularity()
        }
      } catch (error) {
        bookmarkError.value = true
        bookmarkMessage.value =
          'Bookmark gagal diperbarui. Periksa penyimpanan browser.'
      }
    }

    // ==============================
    // HISTORY FUNCTION
    // ==============================

    function recordHistory() {
      if (!currentUser.value || !book.value) {
        return
      }

      try {
        addHistory(
          currentUser.value.id,
          book.value.id
        )
      } catch (error) {
        // Kegagalan riwayat tidak boleh menghentikan
        // pemuatan detail buku dan fitur rating.
        console.error(
          'Gagal menyimpan riwayat buku:',
          error
        )
      }
    }

    // ==============================
    // RATING FUNCTIONS
    // ==============================

    function loadRatingData() {
      // Jangan menghapus pesan error dari operasi sebelumnya
      // sebelum proses pemuatan data baru selesai.
      const previousError = ratingError.value

      if (!book.value) {
        ratingSummary.value = {
          average: null,
          count: 0
        }

        userRating.value = null
        selectedScore.value = 0
        ratingError.value = ''
        return true
      }

      try {
        const summary = getRatingSummary(book.value.id)

        const nextUserRating = currentUser.value
          ? getUserRating(
              currentUser.value.id,
              book.value.id
            )
          : null

        ratingSummary.value = {
          average:
            summary.count > 0
              ? summary.average
              : null,
          count: summary.count
        }

        userRating.value = nextUserRating
        selectedScore.value = nextUserRating
          ? nextUserRating.score
          : 0

        ratingError.value = ''
        return true
      } catch (error) {
        ratingError.value = getErrorMessage(
          error,
          'Rating gagal dimuat. Periksa penyimpanan browser'
        )

        // Jangan mengubah data lama menjadi rating kosong
        // seolah-olah tidak ada rating ketika storage gagal dibaca.
        if (previousError && !ratingError.value) {
          ratingError.value = previousError
        }

        return false
      }
    }

    function selectScore(score) {
      if (
        !Number.isInteger(score) ||
        score < 1 ||
        score > 5 ||
        isRatingLoading.value
      ) {
        return
      }

      selectedScore.value = score
      ratingError.value = ''
      ratingMessage.value = ''
    }

    function saveRating() {
      ratingError.value = ''
      ratingMessage.value = ''

      if (!currentUser.value) {
        router.push('/login')
        return
      }

      if (!book.value) {
        ratingError.value = 'Buku tidak ditemukan.'
        return
      }

      if (
        !Number.isInteger(selectedScore.value) ||
        selectedScore.value < 1 ||
        selectedScore.value > 5
      ) {
        ratingError.value =
          'Pilih rating antara 1 dan 5 bintang.'
        return
      }

      if (isRatingLoading.value) {
        return
      }

      isRatingLoading.value = true

      try {
        // Fungsi storage memvalidasi kepemilikan dan
        // mencegah rating ganda untuk user dan buku yang sama.
        if (userRating.value) {
          updateRating(
            userRating.value.id,
            currentUser.value.id,
            selectedScore.value
          )
        } else {
          addRating(
            currentUser.value.id,
            book.value.id,
            selectedScore.value
          )
        }

        // Konfirmasi melalui pembacaan ulang data.
        // Pesan sukses hanya ditampilkan jika pembacaan berhasil.
        const loaded = loadRatingData()

        if (!loaded) {
          ratingError.value =
            'Rating telah dikirim ke penyimpanan, tetapi data terbaru gagal dibaca. Periksa penyimpanan browser sebelum mencoba lagi.'
          return
        }

        loadBookPopularity()

        ratingMessage.value =
          'Rating Anda berhasil disimpan.'
      } catch (error) {
        const message = getErrorMessage(
          error,
          'Rating gagal disimpan'
        )

        // Coba sinkronkan kembali tampilan dengan data tersimpan.
        loadRatingData()
        ratingError.value = message
      } finally {
        isRatingLoading.value = false
      }
    }

    function deleteMyRating() {
      ratingError.value = ''
      ratingMessage.value = ''

      if (!currentUser.value || !userRating.value) {
        return
      }

      if (isRatingLoading.value) {
        return
      }

      if (!book.value) {
        ratingError.value = 'Buku tidak ditemukan.'
        return
      }

      const ratingId = userRating.value.id

      isRatingLoading.value = true

      try {
        deleteRating(
          ratingId,
          currentUser.value.id
        )

        const loaded = loadRatingData()

        if (!loaded) {
          ratingError.value =
            'Permintaan penghapusan telah dijalankan, tetapi data terbaru gagal dibaca. Periksa penyimpanan browser.'
          return
        }

        loadBookPopularity()

        ratingMessage.value =
          'Rating Anda berhasil dihapus.'
      } catch (error) {
        const message = getErrorMessage(
          error,
          'Rating gagal dihapus'
        )

        loadRatingData()
        ratingError.value = message
      } finally {
        isRatingLoading.value = false
      }
    }

    function goToLogin() {
      router.push('/login')
    }

    // ==============================
    // WATCHERS
    // ==============================

    // Sinkronkan bookmark, rating, dan history
    // saat pengguna membuka buku yang berbeda.
    watch(
      () => book.value?.id,
      () => {
        loadBookmarkStatus()
        loadRatingData()
        recordHistory()
        recordCurrentBookVisit()
      },
      {
        immediate: true
      }
    )

    // Memuat rekomendasi setiap kali ID buku berubah.
    watch(
      () => book.value?.id,
      (bookId) => {
        loadRecommendations(bookId)
      },
      {
        immediate: true
      }
    )

    // ==============================
    // RETURN
    // ==============================

    return {
      // Detail buku
      book,

      // PDF Reader
      openBookReader,

      // Popularity
      popularityScore,

      // User
      currentUser,

      // Bookmark
      isBookmarked,
      bookmarkMessage,
      bookmarkError,
      toggleBookmark,

      // Rating
      ratingSummary,
      userRating,
      selectedScore,
      ratingError,
      ratingMessage,
      isRatingLoading,
      selectScore,
      saveRating,
      deleteMyRating,
      goToLogin,

      // Rekomendasi Machine Learning
      recommendations,
      recommendedBooks,
      isRecommendationLoading,
      recommendationError
    }
  }
}
</script>

<style scoped>
/* ==============================
   PAGE
============================== */

.book-detail-page {
  min-height: 100vh;
  background-color: var(--color-secondary);
}

.book-detail-content {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 36px 40px 76px;
}

.detail-wrapper {
  width: 100%;
}

/* ==============================
   BACK LINK
============================== */

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  margin-bottom: 22px;

  color: var(--color-primary);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* ==============================
   BOOK DETAIL CARD
============================== */

.book-detail-card {
  display: grid;
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  align-items: start;
  gap: 48px;

  padding: 40px;

  background-color: var(--color-white);
  border: 1px solid var(--color-light-gray);
  border-radius: 20px;

  box-shadow: var(--shadow-sm);
}

.book-cover-section {
  position: sticky;
  top: 100px;
  width: 100%;
  overflow: hidden;

  border-radius: 14px;
  background-color: #F0F3F7;
  box-shadow: 0 10px 28px rgba(25, 42, 70, 0.12);
}

.book-cover {
  display: block;

  width: 100%;
  height: 450px;

  object-fit: cover;
  object-position: center;

  border-radius: 14px;
  background-color: #F0F3F7;
}

.book-info-section {
  min-width: 0;
}

/* ==============================
   BOOK INFORMATION
============================== */

.book-category {
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
  letter-spacing: 0.5px;
}

.book-title {
  margin: 0;

  color: var(--color-black);

  font-size: clamp(27px, 3vw, 36px);
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.7px;

  overflow-wrap: anywhere;
}

.book-author {
  margin: 12px 0 0;

  color: var(--color-gray);

  font-size: 15px;
  line-height: 1.6;
}

/* ==============================
   RATING AND POPULARITY
============================== */

.book-rating-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  margin-top: 20px;
}

.rating,
.popularity {
  display: inline-flex;
  align-items: center;

  min-height: 32px;
  padding: 6px 11px;

  border-radius: 8px;

  font-size: 12px;
  font-weight: 600;
}

.rating {
  background-color: #FFF8E8;
  color: #A66C08;
}

.rating.unavailable {
  background-color: #F2F4F7;
  color: var(--color-gray);
  font-weight: 500;
}

.popularity {
  background-color: #EDF4FA;
  color: var(--color-primary);
}

/* ==============================
   ACTION BUTTONS
============================== */

.book-action-buttons {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  margin-top: 26px;
}

.read-book-button,
.bookmark-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 44px;
  padding: 11px 18px;

  border: 1px solid var(--color-primary);
  border-radius: 9px;

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.read-book-button {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.read-book-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  box-shadow: 0 4px 10px rgba(7, 90, 158, 0.15);
}

.read-book-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bookmark-button {
  background-color: var(--color-white);
  color: var(--color-primary);
}

.bookmark-button:hover {
  background-color: #EDF4FA;
}

.bookmark-button.bookmarked {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.bookmark-button.bookmarked:hover {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

/* ==============================
   FEEDBACK
============================== */

.feedback-message {
  margin: 12px 0 0;

  color: #267343;

  font-size: 12px;
  line-height: 1.6;

  overflow-wrap: anywhere;
}

.error-message {
  color: #B42318;
}

/* ==============================
   USER RATING SECTION
============================== */

.user-rating-section {
  margin-top: 32px;
  padding: 25px 0;

  border-top: 1px solid var(--color-light-gray);
  border-bottom: 1px solid var(--color-light-gray);
}

.user-rating-section h2 {
  margin: 0 0 16px;

  color: var(--color-black);

  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.rating-summary {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;

  padding: 10px 14px;

  border: 1px solid #F1E6C9;
  border-radius: 10px;

  background-color: #FFFBF1;
}

.summary-stars {
  color: #D99A16;
  font-size: 23px;
  line-height: 1;
}

.summary-average {
  color: var(--color-black);
  font-size: 22px;
  font-weight: 700;
}

.summary-count {
  color: var(--color-gray);
  font-size: 12px;
}

.empty-rating {
  margin: 0;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.6;
}

/* ==============================
   RATING FORM
============================== */

.rating-form,
.login-rating-prompt {
  margin-top: 24px;
  padding: 18px;

  border: 1px solid var(--color-light-gray);
  border-radius: 12px;

  background-color: #FAFBFD;
}

.rating-form h3 {
  margin: 0;

  color: var(--color-black);

  font-size: 15px;
  font-weight: 700;
}

.rating-instruction {
  margin: 7px 0 0;

  color: var(--color-gray);

  font-size: 12px;
  line-height: 1.6;
}

.star-picker {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 12px;
}

.star-button {
  padding: 2px;

  border: 0;
  border-radius: 5px;

  background: transparent;
  color: #C8CDD5;

  font-size: 32px;
  line-height: 1.2;

  cursor: pointer;

  transition:
    color 0.15s ease,
    transform 0.15s ease;
}

.star-button:hover {
  transform: scale(1.12);
}

.star-button.selected {
  color: #D99A16;
}

.star-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.existing-rating {
  margin: 10px 0 0;

  color: var(--color-gray);

  font-size: 12px;
}

.existing-rating strong {
  color: var(--color-black);
}

/* ==============================
   RATING ACTIONS
============================== */

.rating-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  margin-top: 16px;
}

.rating-submit-button,
.rating-delete-button {
  min-height: 40px;
  padding: 10px 15px;

  border: 1px solid var(--color-primary);
  border-radius: 8px;

  font-family: inherit;
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;
}

.rating-submit-button {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.rating-submit-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.rating-delete-button {
  border-color: #D92D20;
  background-color: var(--color-white);
  color: #B42318;
}

.rating-delete-button:hover:not(:disabled) {
  background-color: #FEF3F2;
}

.rating-submit-button:disabled,
.rating-delete-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.login-rating-prompt p {
  margin: 0 0 14px;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.7;
}

/* ==============================
   BOOK DESCRIPTION
============================== */

.book-description {
  margin-top: 30px;
  padding-top: 4px;
}

.book-description h2 {
  margin: 0 0 12px;

  color: var(--color-black);

  font-size: 19px;
  font-weight: 700;
}

.book-description p {
  margin: 0;

  color: #596579;

  font-size: 13px;
  line-height: 1.9;

  overflow-wrap: anywhere;
}

/* ==============================
   BOOK METADATA
============================== */

.book-metadata {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  margin-top: 28px;
  padding-top: 24px;

  border-top: 1px solid var(--color-light-gray);
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 6px;

  min-width: 0;
  padding: 13px 14px;

  border: 1px solid #EDF0F4;
  border-radius: 9px;

  background-color: #FAFBFD;
}

.metadata-label {
  color: var(--color-gray);

  font-size: 11px;
  font-weight: 500;
}

.metadata-value {
  color: var(--color-black);

  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;

  overflow-wrap: anywhere;
}

/* ==============================
   MACHINE LEARNING RECOMMENDATION
============================== */

.recommendation-section {
  margin-top: 30px;
  padding: 32px;

  background-color: var(--color-white);
  border: 1px solid var(--color-light-gray);
  border-radius: 18px;

  box-shadow: var(--shadow-sm);
}

.recommendation-header {
  margin-bottom: 26px;
  padding-bottom: 20px;

  border-bottom: 1px solid var(--color-light-gray);
}

.recommendation-header h2 {
  margin: 0;

  color: var(--color-black);

  font-size: 23px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.recommendation-header p {
  max-width: 700px;
  margin: 10px 0 0;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.8;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: 22px;
}

.recommendation-item {
  display: flex;
  flex-direction: column;

  min-width: 0;
}

.recommendation-item :deep(.book-card) {
  flex: 1;
}

.recommendation-similarity {
  margin: 14px 0 0;
  padding: 9px 10px;

  border: 1px solid #E8EDF4;
  border-radius: 8px;

  background-color: #F7F9FC;

  color: var(--color-gray);

  font-size: 11px;
  text-align: center;
}

.recommendation-similarity strong {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
}

/* ==============================
   RECOMMENDATION MESSAGE
============================== */

.recommendation-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  min-height: 130px;
  margin: 0;
  padding: 24px;

  border: 1px dashed var(--color-light-gray);
  border-radius: 12px;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.7;
  text-align: center;
}

.recommendation-message p {
  margin: 0;
}

.recommendation-error {
  padding: 16px;

  border: 1px solid #FEE4E2;
  border-radius: 10px;

  background-color: #FEF3F2;
  color: #B42318;

  font-size: 13px;
  line-height: 1.7;

  overflow-wrap: anywhere;
}

.recommendation-note {
  margin: 24px 0 0;
  padding-top: 18px;

  border-top: 1px solid var(--color-light-gray);

  color: var(--color-gray);

  font-size: 11px;
  line-height: 1.8;
}

/* ==============================
   LOADING ANIMATION
============================== */

.loading-indicator {
  width: 27px;
  height: 27px;

  border: 3px solid var(--color-light-gray);
  border-top-color: var(--color-primary);
  border-radius: 50%;

  animation: recommendation-spin 0.8s linear infinite;
}

@keyframes recommendation-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ==============================
   BOOK NOT FOUND
============================== */

.book-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 360px;
  padding: 50px 24px;

  text-align: center;

  background-color: var(--color-white);
  border: 1px solid var(--color-light-gray);
  border-radius: 18px;

  box-shadow: var(--shadow-sm);
}

.book-not-found h1 {
  margin: 0;

  color: var(--color-black);

  font-size: 28px;
  font-weight: 700;
}

.book-not-found p {
  max-width: 440px;
  margin: 12px 0 24px;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.7;
}

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 42px;
  padding: 11px 18px;

  border-radius: 8px;

  background-color: var(--color-primary);
  color: var(--color-white);

  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: var(--color-primary-dark);
}

/* ==============================
   FOCUS AND ACCESSIBILITY
============================== */

.read-book-button:focus-visible,
.bookmark-button:focus-visible,
.rating-submit-button:focus-visible,
.rating-delete-button:focus-visible,
.back-button:focus-visible,
.back-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

/* ==============================
   RESPONSIVE: TABLET
============================== */

@media (max-width: 1024px) {
  .book-detail-content {
    padding-right: 28px;
    padding-left: 28px;
  }

  .book-detail-card {
    grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
    gap: 32px;
    padding: 30px;
  }

  .book-cover {
    height: 400px;
  }

  .recommendation-section {
    padding: 26px;
  }

  .recommendation-grid {
    gap: 18px;
  }
}

/* ==============================
   RESPONSIVE: MOBILE / TABLET
============================== */

@media (max-width: 800px) {
  .book-detail-content {
    padding: 30px 20px 54px;
  }

  .book-detail-card {
    grid-template-columns: minmax(0, 1fr);
    gap: 30px;

    padding: 28px;
  }

  .book-cover-section {
    position: static;

    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }

  .book-cover {
    height: 390px;
  }

  .book-title {
    font-size: 29px;
  }

  .recommendation-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }
}

/* ==============================
   RESPONSIVE: SMALL MOBILE
============================== */

@media (max-width: 520px) {
  .book-detail-content {
    padding: 24px 15px 42px;
  }

  .back-link {
    margin-bottom: 17px;
    font-size: 12px;
  }

  .book-detail-card {
    gap: 25px;
    padding: 19px;

    border-radius: 15px;
  }

  .book-cover-section {
    max-width: 230px;
  }

  .book-cover {
    height: 340px;
  }

  .book-category {
    margin-bottom: 11px;
    font-size: 10px;
  }

  .book-title {
    font-size: 25px;
    letter-spacing: -0.4px;
  }

  .book-author {
    margin-top: 8px;
    font-size: 13px;
  }

  .book-rating-row {
    gap: 8px;
    margin-top: 15px;
  }

  .rating,
  .popularity {
    min-height: 30px;
    padding: 6px 9px;
    font-size: 11px;
  }

  .book-action-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: 9px;

    margin-top: 21px;
  }

  .read-book-button,
  .bookmark-button {
    width: 100%;
    min-height: 43px;
    font-size: 12px;
  }

  .user-rating-section {
    margin-top: 26px;
    padding: 21px 0;
  }

  .user-rating-section h2 {
    font-size: 18px;
  }

  .rating-summary {
    gap: 7px;
    padding: 9px 11px;
  }

  .summary-stars {
    font-size: 21px;
  }

  .summary-average {
    font-size: 20px;
  }

  .summary-count {
    font-size: 11px;
  }

  .rating-form,
  .login-rating-prompt {
    padding: 15px;
  }

  .star-button {
    font-size: 29px;
  }

  .rating-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .rating-submit-button,
  .rating-delete-button {
    width: 100%;
  }

  .book-description {
    margin-top: 25px;
  }

  .book-description h2 {
    font-size: 18px;
  }

  .book-description p {
    font-size: 12px;
    line-height: 1.8;
  }

  .book-metadata {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;

    margin-top: 23px;
    padding-top: 20px;
  }

  .metadata-item {
    padding: 11px;
  }

  .metadata-label {
    font-size: 10px;
  }

  .metadata-value {
    font-size: 12px;
  }

  .recommendation-section {
    margin-top: 22px;
    padding: 19px;

    border-radius: 15px;
  }

  .recommendation-header {
    margin-bottom: 20px;
    padding-bottom: 16px;
  }

  .recommendation-header h2 {
    font-size: 19px;
  }

  .recommendation-header p {
    margin-top: 8px;
    font-size: 12px;
  }

  .recommendation-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
  }

  .recommendation-note {
    margin-top: 20px;
    padding-top: 15px;
    font-size: 10px;
  }

  .book-not-found {
    min-height: 300px;
    padding: 35px 18px;
  }

  .book-not-found h1 {
    font-size: 23px;
  }

  .book-not-found p {
    font-size: 12px;
  }
}

/* ==============================
   REDUCED MOTION
============================== */

@media (prefers-reduced-motion: reduce) {
  .read-book-button,
  .bookmark-button,
  .rating-submit-button,
  .rating-delete-button,
  .back-button,
  .star-button {
    transition: none;
  }

  .star-button:hover {
    transform: none;
  }

  .loading-indicator {
    animation-duration: 1.8s;
  }
}
</style>
