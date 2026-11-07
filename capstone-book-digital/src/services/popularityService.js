
import bookData from '../data/bookData'

import {
  getUsers,
  getBookmarks,
  getAllBookRatings,
  getBookVisits
} from './storageService'

/* =========================
   POPULARITY CONFIGURATION
========================= */

const WEIGHTS = {
  visits: 0.4,
  bookmarks: 0.3,
  ratingCount: 0.2,
  averageRating: 0.1
}

/**
 * Normalisasi nilai menjadi skala 0–100.
 */
function normalizeScore(value, maximum) {
  if (maximum <= 0) {
    return 0
  }

  return (value / maximum) * 100
}

/* =========================
   BOOK POPULARITY DATA
========================= */

/**
 * Menghitung statistik dan skor popularitas
 * berdasarkan interaksi pengguna.
 */
export function getBookPopularityData() {
  const users = getUsers()
  const ratings = getAllBookRatings()
  const visits = getBookVisits()

  const statistics = bookData.map(book => {
    // Jumlah kunjungan halaman detail buku.
    const visitCount = visits.filter(
      visit => visit.bookId === book.id
    ).length

    // Jumlah pengguna yang menyimpan buku.
    let bookmarkCount = 0

    users.forEach(user => {
      if (user && user.role === 'user') {
        const bookmarks = getBookmarks(user.id)

        if (bookmarks.includes(book.id)) {
          bookmarkCount += 1
        }
      }
    })

    // Rating aktif dari pengguna.
    const bookRatings = ratings.filter(
      rating => rating.bookId === book.id
    )

    const ratingCount = bookRatings.length

    const averageRating =
      ratingCount > 0
        ? bookRatings.reduce(
            (total, rating) => total + rating.score,
            0
          ) / ratingCount
        : 0

    return {
      ...book,
      visitCount,
      bookmarkCount,
      ratingCount,
      averageRating
    }
  })

  // Nilai maksimum setiap indikator.
  const maximumVisits = Math.max(
    0,
    ...statistics.map(book => book.visitCount)
  )

  const maximumBookmarks = Math.max(
    0,
    ...statistics.map(book => book.bookmarkCount)
  )

  const maximumRatings = Math.max(
    0,
    ...statistics.map(book => book.ratingCount)
  )

  // Menghitung skor popularitas setiap buku.
  return statistics.map(book => {
    const visitScore = normalizeScore(
      book.visitCount,
      maximumVisits
    )

    const bookmarkScore = normalizeScore(
      book.bookmarkCount,
      maximumBookmarks
    )

    const ratingCountScore = normalizeScore(
      book.ratingCount,
      maximumRatings
    )

    const averageRatingScore =
      (book.averageRating / 5) * 100

    const popularityScore =
      visitScore * WEIGHTS.visits +
      bookmarkScore * WEIGHTS.bookmarks +
      ratingCountScore * WEIGHTS.ratingCount +
      averageRatingScore * WEIGHTS.averageRating

    return {
      ...book,
      popularityScore: Number(
        popularityScore.toFixed(2)
      )
    }
  })
}

/* =========================
   SINGLE BOOK POPULARITY
========================= */

/**
 * Mengambil data popularitas satu buku.
 */
export function getBookPopularity(bookId) {
  return (
    getBookPopularityData().find(
      book => book.id === bookId
    ) || null
  )
}

/* =========================
   TRENDING BOOKS
========================= */

/**
 * Mengurutkan buku berdasarkan skor popularitas.
 */
export function getTrendingBooks() {
  return getBookPopularityData().sort(
    (a, b) =>
      b.popularityScore - a.popularityScore ||
      b.visitCount - a.visitCount ||
      a.title.localeCompare(b.title)
  )
}
