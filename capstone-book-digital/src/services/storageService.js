
import bookData from '../data/bookData'

const STORAGE_KEYS = {
  USERS: 'capstone_users',
  CURRENT_USER: 'capstone_current_user',
  BOOKMARKS: 'capstone_bookmarks',
  HISTORY: 'capstone_history',
  PREMIUM_PAYMENTS: 'capstone_premium_payments',
  COMMUNITY_MEMBERSHIPS: 'capstone_community_memberships',
  COMMUNITY_POSTS: 'capstone_community_posts',
  COMMUNITY_COMMENTS: 'capstone_community_comments',
  BOOK_RATINGS: 'capstone_book_ratings',
  BOOK_VISITS: 'capstone_book_visits',
  READING_PROGRESS: 'capstone_reading_progress'
}

/* =========================
   USERS AND AUTHENTICATION
========================= */

export function getUsers() {
  const users = localStorage.getItem(STORAGE_KEYS.USERS)

  if (!users) {
    return []
  }

  try {
    const parsedUsers = JSON.parse(users)

    return Array.isArray(parsedUsers) ? parsedUsers : []
  } catch (error) {
    console.error('Gagal membaca data pengguna:', error)
    return []
  }
}

export function saveUsers(users) {
  localStorage.setItem(
    STORAGE_KEYS.USERS,
    JSON.stringify(users)
  )
}

export function getCurrentUser() {
  const user = localStorage.getItem(
    STORAGE_KEYS.CURRENT_USER
  )

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user)
  } catch (error) {
    console.error('Gagal membaca pengguna aktif:', error)
    return null
  }
}

export function saveCurrentUser(user) {
  localStorage.setItem(
    STORAGE_KEYS.CURRENT_USER,
    JSON.stringify(user)
  )
}

export function removeCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
}

/* =========================
   SHARED STORAGE HELPERS
========================= */

function getUserStorageKey(key, userId) {
  return `${key}_${userId}`
}

/* =========================
   BOOKMARK
========================= */

export function getBookmarks(userId) {
  if (!userId) {
    return []
  }

  const key = getUserStorageKey(
    STORAGE_KEYS.BOOKMARKS,
    userId
  )

  const bookmarks = localStorage.getItem(key)

  if (!bookmarks) {
    return []
  }

  try {
    const parsedBookmarks = JSON.parse(bookmarks)

    return Array.isArray(parsedBookmarks)
      ? parsedBookmarks
      : []
  } catch (error) {
    console.error('Gagal membaca bookmark:', error)
    return []
  }
}

export function saveBookmarks(userId, bookIds) {
  if (!userId) {
    return
  }

  const key = getUserStorageKey(
    STORAGE_KEYS.BOOKMARKS,
    userId
  )

  localStorage.setItem(key, JSON.stringify(bookIds))
}

export function addBookmark(userId, bookId) {
  if (!userId || !bookId) {
    return
  }

  const bookmarks = getBookmarks(userId)

  if (!bookmarks.includes(bookId)) {
    bookmarks.push(bookId)
    saveBookmarks(userId, bookmarks)
  }
}

export function removeBookmark(userId, bookId) {
  if (!userId || !bookId) {
    return
  }

  const bookmarks = getBookmarks(userId)

  const updatedBookmarks = bookmarks.filter(
    id => id !== bookId
  )

  saveBookmarks(userId, updatedBookmarks)
}

export function isBookmarked(userId, bookId) {
  if (!userId || !bookId) {
    return false
  }

  return getBookmarks(userId).includes(bookId)
}

/* =========================
   HISTORY
========================= */

export function getHistory(userId) {
  if (!userId) {
    return []
  }

  const key = getUserStorageKey(
    STORAGE_KEYS.HISTORY,
    userId
  )

  const history = localStorage.getItem(key)

  if (!history) {
    return []
  }

  try {
    const parsedHistory = JSON.parse(history)

    return Array.isArray(parsedHistory)
      ? parsedHistory
      : []
  } catch (error) {
    console.error('Gagal membaca history:', error)
    return []
  }
}

export function saveHistory(userId, history) {
  if (!userId) {
    return
  }

  const key = getUserStorageKey(
    STORAGE_KEYS.HISTORY,
    userId
  )

  localStorage.setItem(key, JSON.stringify(history))
}

export function addHistory(userId, bookId) {
  if (!userId || !bookId) {
    return
  }

  const history = getHistory(userId)

  const filteredHistory = history.filter(
    id => id !== bookId
  )

  filteredHistory.unshift(bookId)

  saveHistory(userId, filteredHistory)
}

export function clearHistory(userId) {
  if (!userId) {
    return
  }

  const key = getUserStorageKey(
    STORAGE_KEYS.HISTORY,
    userId
  )

  localStorage.removeItem(key)
}

/* =========================
   BOOK VISITS
========================= */

export function getBookVisits() {
  const storedVisits = localStorage.getItem(
    STORAGE_KEYS.BOOK_VISITS
  )

  if (storedVisits === null) {
    return []
  }

  let visits

  try {
    visits = JSON.parse(storedVisits)
  } catch {
    console.error(
      'Data kunjungan buku tidak dapat dibaca karena format JSON rusak.'
    )

    return []
  }

  if (!Array.isArray(visits)) {
    console.error(
      'Format penyimpanan kunjungan buku tidak valid.'
    )

    return []
  }

  return visits.filter(visit => {
    return (
      visit &&
      typeof visit.bookId === 'string' &&
      typeof visit.visitedAt === 'string' &&
      !Number.isNaN(Date.parse(visit.visitedAt))
    )
  })
}

export function recordBookVisit(bookId, userId = null) {
  if (
    typeof bookId !== 'string' ||
    !bookId.trim()
  ) {
    throw new Error('ID buku tidak valid.')
  }

  const bookExists = bookData.some(
    book => book.id === bookId
  )

  if (!bookExists) {
    throw new Error('Buku tidak ditemukan.')
  }

  const visits = getBookVisits()

  const newVisit = {
    bookId,
    userId:
      typeof userId === 'string' && userId.trim()
        ? userId
        : null,
    visitedAt: new Date().toISOString()
  }

  localStorage.setItem(
    STORAGE_KEYS.BOOK_VISITS,
    JSON.stringify([...visits, newVisit])
  )

  return newVisit
}

/* =========================
   READING PROGRESS
========================= */

export function getReadingProgress(userId, bookId) {
  if (!bookId) {
    return null
  }

  const storageKey = getUserStorageKey(
    STORAGE_KEYS.READING_PROGRESS,
    userId || 'guest'
  )

  const storedData = localStorage.getItem(storageKey)

  if (!storedData) {
    return null
  }

  try {
    const allProgress = JSON.parse(storedData)

    if (
      !allProgress ||
      typeof allProgress !== 'object' ||
      Array.isArray(allProgress)
    ) {
      return null
    }

    const progress = allProgress[String(bookId)]

    if (!progress) {
      return null
    }

    const currentPage = Number(progress.currentPage)
    const totalPages = Number(progress.totalPages)

    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(totalPages) ||
      currentPage < 1 ||
      totalPages < 1 ||
      currentPage > totalPages
    ) {
      return null
    }

    return {
      currentPage,
      totalPages,
      updatedAt: progress.updatedAt || null
    }
  } catch (error) {
    console.error(
      'Gagal membaca progres membaca:',
      error
    )

    return null
  }
}

export function saveReadingProgress(
  userId,
  bookId,
  currentPage,
  totalPages
) {
  if (!bookId) {
    throw new Error('ID buku tidak valid.')
  }

  const bookExists = bookData.some(
    book => String(book.id) === String(bookId)
  )

  if (!bookExists) {
    throw new Error('Buku tidak ditemukan.')
  }

  const page = Number(currentPage)
  const total = Number(totalPages)

  if (
    !Number.isInteger(page) ||
    !Number.isInteger(total) ||
    total < 1 ||
    page < 1 ||
    page > total
  ) {
    throw new Error('Data halaman membaca tidak valid.')
  }

  const storageKey = getUserStorageKey(
    STORAGE_KEYS.READING_PROGRESS,
    userId || 'guest'
  )

  let allProgress = {}

  const storedData = localStorage.getItem(storageKey)

  if (storedData) {
    try {
      allProgress = JSON.parse(storedData)

      if (
        !allProgress ||
        typeof allProgress !== 'object' ||
        Array.isArray(allProgress)
      ) {
        throw new Error('Format data progres tidak valid.')
      }
    } catch (error) {
      console.error(
        'Gagal memproses data progres membaca:',
        error
      )

      throw new Error(
        'Data progres membaca tidak dapat diproses.'
      )
    }
  }

  allProgress[String(bookId)] = {
    currentPage: page,
    totalPages: total,
    updatedAt: new Date().toISOString()
  }

  localStorage.setItem(
    storageKey,
    JSON.stringify(allProgress)
  )

  return true
}

/* =========================
   PREMIUM PAYMENT
========================= */

export function getPremiumPayments() {
  const payments = localStorage.getItem(
    STORAGE_KEYS.PREMIUM_PAYMENTS
  )

  if (!payments) {
    return []
  }

  try {
    const parsedPayments = JSON.parse(payments)

    return Array.isArray(parsedPayments)
      ? parsedPayments
      : []
  } catch (error) {
    console.error(
      'Gagal membaca data pembayaran premium:',
      error
    )

    return []
  }
}

export function savePremiumPayments(payments) {
  localStorage.setItem(
    STORAGE_KEYS.PREMIUM_PAYMENTS,
    JSON.stringify(payments)
  )
}

export function getPremiumPayment(userId) {
  if (!userId) {
    return null
  }

  return (
    getPremiumPayments().find(
      payment => payment.userId === userId
    ) || null
  )
}

export function savePremiumPayment(payment) {
  if (!payment || !payment.userId) {
    return
  }

  const payments = getPremiumPayments()

  const existingIndex = payments.findIndex(
    item => item.userId === payment.userId
  )

  if (existingIndex !== -1) {
    payments[existingIndex] = payment
  } else {
    payments.push(payment)
  }

  savePremiumPayments(payments)
}

/* =========================
   COMMUNITY MEMBERSHIP
========================= */

export function getCommunityMemberships(userId) {
  if (!userId) {
    return []
  }

  const key = getUserStorageKey(
    STORAGE_KEYS.COMMUNITY_MEMBERSHIPS,
    userId
  )

  const memberships = localStorage.getItem(key)

  if (!memberships) {
    return []
  }

  try {
    const parsedMemberships = JSON.parse(memberships)

    return Array.isArray(parsedMemberships)
      ? parsedMemberships
      : []
  } catch (error) {
    console.error(
      'Gagal membaca data komunitas:',
      error
    )

    return []
  }
}

export function saveCommunityMemberships(
  userId,
  communityIds
) {
  if (!userId) {
    return
  }

  const key = getUserStorageKey(
    STORAGE_KEYS.COMMUNITY_MEMBERSHIPS,
    userId
  )

  localStorage.setItem(
    key,
    JSON.stringify(communityIds)
  )
}

export function joinCommunity(userId, communityId) {
  if (!userId || !communityId) {
    return
  }

  const memberships = getCommunityMemberships(userId)

  if (!memberships.includes(communityId)) {
    memberships.push(communityId)

    saveCommunityMemberships(userId, memberships)
  }
}

export function leaveCommunity(userId, communityId) {
  if (!userId || !communityId) {
    return
  }

  const memberships = getCommunityMemberships(userId)

  const updatedMemberships = memberships.filter(
    id => id !== communityId
  )

  saveCommunityMemberships(userId, updatedMemberships)
}

export function isCommunityMember(userId, communityId) {
  if (!userId || !communityId) {
    return false
  }

  return getCommunityMemberships(userId).includes(
    communityId
  )
}

/* =========================
   COMMUNITY POSTS
========================= */

export function getCommunityPosts() {
  const posts = localStorage.getItem(
    STORAGE_KEYS.COMMUNITY_POSTS
  )

  if (!posts) {
    return []
  }

  try {
    const parsedPosts = JSON.parse(posts)

    return Array.isArray(parsedPosts) ? parsedPosts : []
  } catch (error) {
    console.error(
      'Gagal membaca data posting komunitas:',
      error
    )

    return []
  }
}

export function saveCommunityPosts(posts) {
  localStorage.setItem(
    STORAGE_KEYS.COMMUNITY_POSTS,
    JSON.stringify(posts)
  )
}

export function addCommunityPost(post) {
  if (!post) {
    return
  }

  const posts = getCommunityPosts()

  posts.unshift(post)

  saveCommunityPosts(posts)
}

/* =========================
   COMMUNITY COMMENTS
========================= */

export function getCommunityComments() {
  const comments = localStorage.getItem(
    STORAGE_KEYS.COMMUNITY_COMMENTS
  )

  if (!comments) {
    return []
  }

  try {
    const parsedComments = JSON.parse(comments)

    return Array.isArray(parsedComments)
      ? parsedComments
      : []
  } catch (error) {
    console.error(
      'Gagal membaca data komentar komunitas:',
      error
    )

    return []
  }
}

export function saveCommunityComments(comments) {
  localStorage.setItem(
    STORAGE_KEYS.COMMUNITY_COMMENTS,
    JSON.stringify(comments)
  )
}

export function addCommunityComment(comment) {
  if (!comment) {
    return
  }

  const comments = getCommunityComments()

  comments.push(comment)

  saveCommunityComments(comments)
}

/* =========================
   BOOK RATINGS
========================= */

function validateRatingIdentity(userId, bookId) {
  if (
    typeof userId !== 'string' ||
    !userId.trim()
  ) {
    throw new Error('Pengguna tidak valid.')
  }

  if (
    typeof bookId !== 'string' ||
    !bookId.trim()
  ) {
    throw new Error('Buku tidak valid.')
  }

  const users = getUsers()

  const user = users.find(
    item => item && item.id === userId
  )

  if (!user || user.role !== 'user') {
    throw new Error(
      'Pengguna tidak ditemukan atau tidak memiliki akses untuk memberi rating.'
    )
  }

  const bookExists = bookData.some(
    book => book.id === bookId
  )

  if (!bookExists) {
    throw new Error('Buku tidak ditemukan.')
  }
}

function validateRatingScore(score) {
  if (
    !Number.isInteger(score) ||
    score < 1 ||
    score > 5
  ) {
    throw new Error(
      'Rating harus berupa bilangan bulat dari 1 sampai 5.'
    )
  }
}

function readAllBookRatings() {
  const storedRatings = localStorage.getItem(
    STORAGE_KEYS.BOOK_RATINGS
  )

  if (storedRatings === null) {
    return []
  }

  let ratings

  try {
    ratings = JSON.parse(storedRatings)
  } catch {
    throw new Error(
      'Data rating tidak dapat dibaca karena format JSON rusak. Data tidak diubah.'
    )
  }

  if (!Array.isArray(ratings)) {
    throw new Error(
      'Format penyimpanan rating tidak valid. Data tidak diubah.'
    )
  }

  const uniqueIds = new Set()
  const uniquePairs = new Set()

  for (const rating of ratings) {
    const validRating =
      rating &&
      typeof rating.id === 'string' &&
      rating.id.trim().length > 0 &&
      typeof rating.userId === 'string' &&
      rating.userId.trim().length > 0 &&
      typeof rating.bookId === 'string' &&
      rating.bookId.trim().length > 0 &&
      Number.isInteger(rating.score) &&
      rating.score >= 1 &&
      rating.score <= 5 &&
      typeof rating.createdAt === 'string' &&
      !Number.isNaN(Date.parse(rating.createdAt)) &&
      typeof rating.updatedAt === 'string' &&
      !Number.isNaN(Date.parse(rating.updatedAt))

    if (!validRating) {
      throw new Error(
        'Struktur data rating tidak valid. Data tidak diubah.'
      )
    }

    if (uniqueIds.has(rating.id)) {
      throw new Error(
        'Ditemukan ID rating ganda. Data tidak diubah.'
      )
    }

    uniqueIds.add(rating.id)

    const pair = JSON.stringify([
      rating.userId,
      rating.bookId
    ])

    if (uniquePairs.has(pair)) {
      throw new Error(
        'Ditemukan rating ganda untuk pengguna dan buku yang sama. Data tidak diubah.'
      )
    }

    uniquePairs.add(pair)
  }

  return ratings
}

function writeAllBookRatings(ratings) {
  localStorage.setItem(
    STORAGE_KEYS.BOOK_RATINGS,
    JSON.stringify(ratings)
  )
}

function createRatingId(existingRatings) {
  let id

  do {
    if (
      typeof globalThis.crypto?.randomUUID === 'function'
    ) {
      id = globalThis.crypto.randomUUID()
    } else {
      id = `rating-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`
    }
  } while (
    existingRatings.some(rating => rating.id === id)
  )

  return id
}

export function getAllBookRatings() {
  return readAllBookRatings()
}

export function getBookRatings(bookId) {
  if (
    typeof bookId !== 'string' ||
    !bookId.trim()
  ) {
    throw new Error('Buku tidak valid.')
  }

  const bookExists = bookData.some(
    book => book.id === bookId
  )

  if (!bookExists) {
    throw new Error('Buku tidak ditemukan.')
  }

  return readAllBookRatings().filter(
    rating => rating.bookId === bookId
  )
}

export function getUserRating(userId, bookId) {
  validateRatingIdentity(userId, bookId)

  return (
    readAllBookRatings().find(
      rating =>
        rating.userId === userId &&
        rating.bookId === bookId
    ) || null
  )
}

export function getRatingSummary(bookId) {
  const ratings = getBookRatings(bookId)
  const count = ratings.length

  const total = ratings.reduce(
    (sum, rating) => sum + rating.score,
    0
  )

  return {
    average: count > 0 ? total / count : null,
    count
  }
}

export function addRating(userId, bookId, score) {
  validateRatingIdentity(userId, bookId)
  validateRatingScore(score)

  const ratings = readAllBookRatings()

  const existingRating = ratings.find(
    rating =>
      rating.userId === userId &&
      rating.bookId === bookId
  )

  if (existingRating) {
    throw new Error(
      'Kamu sudah memberikan rating untuk buku ini. Perbarui rating yang ada.'
    )
  }

  const now = new Date().toISOString()

  const rating = {
    id: createRatingId(ratings),
    userId,
    bookId,
    score,
    createdAt: now,
    updatedAt: now
  }

  writeAllBookRatings([...ratings, rating])

  return rating
}

export function updateRating(ratingId, userId, score) {
  if (
    typeof ratingId !== 'string' ||
    !ratingId.trim()
  ) {
    throw new Error('ID rating tidak valid.')
  }

  if (
    typeof userId !== 'string' ||
    !userId.trim()
  ) {
    throw new Error('Pengguna tidak valid.')
  }

  validateRatingScore(score)

  const users = getUsers()

  const user = users.find(
    item => item && item.id === userId
  )

  if (!user || user.role !== 'user') {
    throw new Error('Pengguna tidak valid.')
  }

  const ratings = readAllBookRatings()

  const index = ratings.findIndex(
    rating => rating.id === ratingId
  )

  if (index === -1) {
    throw new Error('Rating tidak ditemukan.')
  }

  if (ratings[index].userId !== userId) {
    throw new Error(
      'Kamu hanya dapat mengubah rating milikmu sendiri.'
    )
  }

  const updatedRating = {
    ...ratings[index],
    score,
    updatedAt: new Date().toISOString()
  }

  const updatedRatings = [...ratings]
  updatedRatings[index] = updatedRating

  writeAllBookRatings(updatedRatings)

  return updatedRating
}

export function deleteRating(ratingId, userId) {
  if (
    typeof ratingId !== 'string' ||
    !ratingId.trim()
  ) {
    throw new Error('ID rating tidak valid.')
  }

  if (
    typeof userId !== 'string' ||
    !userId.trim()
  ) {
    throw new Error('Pengguna tidak valid.')
  }

  const users = getUsers()

  const user = users.find(
    item => item && item.id === userId
  )

  if (!user || user.role !== 'user') {
    throw new Error('Pengguna tidak valid.')
  }

  const ratings = readAllBookRatings()

  const rating = ratings.find(
    item => item.id === ratingId
  )

  if (!rating) {
    throw new Error('Rating tidak ditemukan.')
  }

  if (rating.userId !== userId) {
    throw new Error(
      'Kamu hanya dapat menghapus rating milikmu sendiri.'
    )
  }

  writeAllBookRatings(
    ratings.filter(item => item.id !== ratingId)
  )

  return {
    success: true,
    deletedRatingId: ratingId
  }
}

export { STORAGE_KEYS }
