
<template>
  <div class="book-reader-page">
    <AppNavbar />

    <main class="reader-content">
      <div class="reader-header">
        <router-link :to="`/book/${bookId}`" class="back-link">
          ← Kembali ke Detail Buku
        </router-link>

        <div v-if="book" class="book-heading">
          <div>
            <h1>{{ book.title }}</h1>
            <p>{{ book.author }}</p>
          </div>

          <span class="reading-status">Digital Reader</span>
        </div>
      </div>

      <section class="reader-toolbar">
        <div class="page-navigation">
          <button
            type="button"
            class="toolbar-button"
            :disabled="!pdfDocument || currentPage <= 1 || isLoading"
            @click="goToPreviousPage"
          >
            ← Sebelumnya
          </button>

          <div class="page-indicator">
            <label for="page-number">Halaman</label>

            <input
              id="page-number"
              v-model.number="pageInput"
              type="number"
              min="1"
              :max="totalPages"
              :disabled="!pdfDocument || isLoading"
              @keydown.enter.prevent="goToInputPage"
              @change="goToInputPage"
            />

            <span>/ {{ totalPages || '-' }}</span>
          </div>

          <button
            type="button"
            class="toolbar-button"
            :disabled="
              !pdfDocument ||
              currentPage >= totalPages ||
              isLoading
            "
            @click="goToNextPage"
          >
            Berikutnya →
          </button>
        </div>

        <div class="zoom-controls">
          <button
            type="button"
            class="zoom-button"
            :disabled="zoom <= 0.6 || !pdfDocument || isLoading"
            @click="changeZoom(-0.1)"
            aria-label="Perkecil tampilan"
          >
            −
          </button>

          <span>{{ Math.round(zoom * 100) }}%</span>

          <button
            type="button"
            class="zoom-button"
            :disabled="zoom >= 2 || !pdfDocument || isLoading"
            @click="changeZoom(0.1)"
            aria-label="Perbesar tampilan"
          >
            +
          </button>
        </div>
      </section>

      <!-- Loading sebelum dokumen PDF tersedia -->
      <div
        v-if="isLoading && !pdfDocument"
        class="reader-message"
      >
        <div class="loading-spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>

      <!-- Pesan kesalahan -->
      <div
        v-else-if="errorMessage"
        class="reader-message error-message"
      >
        <h2>Buku Tidak Dapat Dibuka</h2>
        <p>{{ errorMessage }}</p>

        <button
          type="button"
          class="retry-button"
          :disabled="isLoading"
          @click="loadPdf"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Area pembaca PDF -->
      <section
        v-else-if="pdfDocument"
        class="pdf-viewer"
      >
        <div class="pdf-page-container">
          <div v-if="isLoading" class="render-loading">
            <div class="loading-spinner"></div>
            <p>{{ loadingMessage }}</p>
          </div>

          <canvas
            ref="pdfCanvas"
            :class="{ 'canvas-loading': isLoading }"
          ></canvas>
        </div>

        <p class="progress-information">
          Progres membaca: halaman {{ currentPage }} dari {{ totalPages }}
        </p>
      </section>

      <div v-else class="reader-message">
        <p>Dokumen PDF belum tersedia.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch
} from 'vue'

import { useRoute } from 'vue-router'

import AppNavbar from '../components/AppNavbar.vue'
import { bookData } from '../data/bookData'

import { getLoggedInUser } from '../services/authService'

import {
  getReadingProgress,
  saveReadingProgress
} from '../services/storageService'

import * as pdfjsLib from 'pdfjs-dist'

// ==========================================
// PDF.JS WORKER CONFIGURATION
// ==========================================
// Worker disimpan di folder public proyek.
// Pastikan file tersedia di:
// public/pdf.worker.min.mjs

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

// ==========================================
// ROUTE DAN DATA BUKU
// ==========================================

const route = useRoute()

const bookId = computed(() => {
  return String(route.params.id || '')
})

const book = computed(() => {
  return bookData.find(item => {
    return String(item.id) === bookId.value
  })
})

// ==========================================
// STATE
// ==========================================

const pdfCanvas = ref(null)

// shallowRef mencegah Vue mengubah objek PDF.js
// menjadi reactive proxy yang dapat menyebabkan
// error pada private member internal PDF.js.
const pdfDocument = shallowRef(null)

const currentPage = ref(1)
const totalPages = ref(0)
const pageInput = ref(1)
const zoom = ref(1.2)

const isLoading = ref(true)

const loadingMessage = ref(
  'Mempersiapkan dokumen PDF...'
)

const errorMessage = ref('')

// ==========================================
// PDF PROCESS MANAGEMENT
// ==========================================

let pdfLoadingTask = null
let renderTask = null
let isDestroyed = false

let loadRequestId = 0
let renderRequestId = 0

// ==========================================
// USER MANAGEMENT
// ==========================================

function getUserId() {
  try {
    const user = getLoggedInUser()

    return user?.id || user?.userId || null
  } catch (error) {
    console.error(
      'Gagal mengambil informasi pengguna:',
      error
    )

    return null
  }
}

// ==========================================
// READING PROGRESS
// ==========================================

function loadSavedProgress() {
  try {
    return getReadingProgress(
      getUserId(),
      bookId.value
    )
  } catch (error) {
    console.error(
      'Gagal mengambil progres membaca:',
      error
    )

    return null
  }
}

function saveCurrentProgress() {
  if (
    !book.value ||
    !totalPages.value ||
    !pdfDocument.value
  ) {
    return
  }

  try {
    saveReadingProgress(
      getUserId(),
      bookId.value,
      currentPage.value,
      totalPages.value
    )
  } catch (error) {
    console.error(
      'Gagal menyimpan progres membaca:',
      error
    )
  }
}

// ==========================================
// CANCEL ACTIVE RENDER
// ==========================================

async function cancelCurrentRender() {
  if (!renderTask) return

  const previousTask = renderTask

  renderTask = null

  try {
    previousTask.cancel()

    await previousTask.promise
  } catch (error) {
    if (
      error?.name !== 'RenderingCancelledException'
    ) {
      console.warn(
        'Proses rendering sebelumnya dihentikan:',
        error
      )
    }
  }
}

// ==========================================
// DESTROY PDF LOADING TASK
// ==========================================

async function destroyCurrentPdf() {
  // Batalkan rendering yang masih berjalan.
  renderRequestId++

  await cancelCurrentRender()

  // Hentikan PDF loading task.
  if (pdfLoadingTask) {
    const previousLoadingTask = pdfLoadingTask

    pdfLoadingTask = null

    try {
      await previousLoadingTask.destroy()
    } catch (error) {
      console.warn(
        'Proses PDF sebelumnya sudah dihentikan:',
        error
      )
    }
  }

  // Lepaskan referensi dokumen PDF.
  // Tidak memanggil destroy() pada PDFDocumentProxy.
  pdfDocument.value = null
}

// ==========================================
// RENDER PDF PAGE
// ==========================================

async function renderCurrentPage() {
  if (
    !pdfDocument.value ||
    isDestroyed
  ) {
    return false
  }

  // Setiap proses rendering mempunyai ID sendiri.
  // Ini mencegah hasil rendering lama menimpa halaman baru.
  const currentRenderRequest = ++renderRequestId

  await cancelCurrentRender()

  await nextTick()

  if (
    isDestroyed ||
    currentRenderRequest !== renderRequestId ||
    !pdfCanvas.value ||
    !pdfDocument.value
  ) {
    return false
  }

  const activeDocument = pdfDocument.value
  const targetPage = currentPage.value
  const targetZoom = zoom.value

  try {
    // Ambil halaman PDF.
    const page = await activeDocument.getPage(
      targetPage
    )

    // Periksa apakah dokumen atau permintaan rendering berubah.
    if (
      isDestroyed ||
      currentRenderRequest !== renderRequestId ||
      activeDocument !== pdfDocument.value ||
      !pdfCanvas.value
    ) {
      return false
    }

    // Tentukan ukuran halaman.
    const viewport = page.getViewport({
      scale: targetZoom
    })

    const canvas = pdfCanvas.value
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error(
        'Canvas tidak dapat digunakan oleh browser.'
      )
    }

    // Atur resolusi canvas.
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)

    // Bersihkan tampilan sebelumnya.
    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    )

    // Render halaman menggunakan PDF.js.
    const task = page.render({
      canvasContext: context,
      viewport
    })

    renderTask = task

    await task.promise

    if (renderTask === task) {
      renderTask = null
    }

    // Periksa kembali setelah rendering selesai.
    if (
      isDestroyed ||
      currentRenderRequest !== renderRequestId ||
      activeDocument !== pdfDocument.value
    ) {
      return false
    }

    // Simpan progres membaca.
    saveCurrentProgress()

    return true

  } catch (error) {
    if (
      error?.name === 'RenderingCancelledException'
    ) {
      return false
    }

    console.error(
      'Gagal menampilkan halaman PDF:',
      error
    )

    if (
      !isDestroyed &&
      currentRenderRequest === renderRequestId
    ) {
      errorMessage.value =
        `Gagal menampilkan halaman PDF: ${
          error.message ||
          'Kesalahan tidak diketahui.'
        }`
    }

    return false

  } finally {
    if (
      renderTask &&
      renderTask.promise &&
      currentRenderRequest !== renderRequestId
    ) {
      // Proses render lama tidak boleh menghapus
      // referensi task milik proses render terbaru.
    }
  }
}

// ==========================================
// LOAD PDF DOCUMENT
// ==========================================

async function loadPdf() {
  if (isDestroyed) return

  const currentRequest = ++loadRequestId

  isLoading.value = true

  loadingMessage.value =
    'Mempersiapkan dokumen PDF...'

  errorMessage.value = ''

  // Simpan progres sebelum mengganti dokumen.
  saveCurrentProgress()

  // Hentikan dokumen dan rendering sebelumnya.
  await destroyCurrentPdf()

  if (
    isDestroyed ||
    currentRequest !== loadRequestId
  ) {
    return
  }

  // Reset informasi halaman.
  totalPages.value = 0
  currentPage.value = 1
  pageInput.value = 1

  // Periksa data buku.
  if (!book.value) {
    errorMessage.value =
      'Data buku tidak ditemukan.'

    isLoading.value = false

    return
  }

  // Periksa alamat PDF.
  if (!book.value.pdfUrl) {
    errorMessage.value =
      'File PDF untuk buku ini belum tersedia.'

    isLoading.value = false

    return
  }

  let loadingTask = null

  try {
    loadingMessage.value =
      'Mengunduh dan memproses dokumen PDF...'

    console.log(
      'Memuat PDF:',
      book.value.pdfUrl
    )

    // Buat PDF loading task.
    loadingTask = pdfjsLib.getDocument({
      url: book.value.pdfUrl
    })

    pdfLoadingTask = loadingTask

    // Tunggu dokumen selesai dimuat.
    const document = await loadingTask.promise

    // Pastikan permintaan masih aktif.
    if (
      isDestroyed ||
      currentRequest !== loadRequestId
    ) {
      if (pdfLoadingTask === loadingTask) {
        pdfLoadingTask = null
      }

      await loadingTask.destroy()

      return
    }

    if (
      !document.numPages ||
      document.numPages < 1
    ) {
      throw new Error(
        'Dokumen PDF tidak memiliki halaman.'
      )
    }

    // Simpan dokumen menggunakan shallowRef.
    pdfDocument.value = document

    totalPages.value = document.numPages

    // Ambil progres membaca sebelumnya.
    const savedProgress = loadSavedProgress()

    if (
      savedProgress &&
      Number.isFinite(
        Number(savedProgress.currentPage)
      )
    ) {
      currentPage.value = Math.min(
        Math.max(
          1,
          Number(savedProgress.currentPage)
        ),
        totalPages.value
      )
    } else {
      currentPage.value = 1
    }

    pageInput.value = currentPage.value

    loadingMessage.value =
      'Menampilkan halaman buku...'

    // Tunggu Vue membuat elemen canvas.
    await nextTick()

    if (
      isDestroyed ||
      currentRequest !== loadRequestId
    ) {
      return
    }

    // Render halaman yang terakhir dibaca.
    const renderSuccess = await renderCurrentPage()

    if (
      isDestroyed ||
      currentRequest !== loadRequestId
    ) {
      return
    }

    if (!renderSuccess) {
      throw new Error(
        errorMessage.value ||
        'Halaman PDF tidak berhasil ditampilkan.'
      )
    }

    console.log(
      'PDF berhasil dimuat:',
      book.value.title
    )

    console.log(
      'Jumlah halaman:',
      totalPages.value
    )

  } catch (error) {
    console.error(
      'Gagal memuat PDF:',
      error
    )

    if (
      !isDestroyed &&
      currentRequest === loadRequestId
    ) {
      errorMessage.value =
        errorMessage.value ||
        `File PDF gagal dimuat. ${
          error.message ||
          'Periksa file PDF dan konfigurasi PDF.js.'
        }`
    }

    // Bersihkan loading task jika masih aktif.
    if (
      loadingTask &&
      pdfLoadingTask === loadingTask
    ) {
      pdfLoadingTask = null

      try {
        await loadingTask.destroy()
      } catch (destroyError) {
        console.warn(
          'Gagal membersihkan PDF:',
          destroyError
        )
      }

      pdfDocument.value = null
      totalPages.value = 0
    }

  } finally {
    if (
      !isDestroyed &&
      currentRequest === loadRequestId
    ) {
      isLoading.value = false
    }
  }
}

// ==========================================
// PAGE NAVIGATION
// ==========================================

async function changePage(newPage) {
  if (
    !pdfDocument.value ||
    isLoading.value ||
    isDestroyed
  ) {
    return
  }

  const targetPage = Math.min(
    Math.max(
      1,
      Math.floor(Number(newPage) || 1)
    ),
    totalPages.value
  )

  if (targetPage === currentPage.value) {
    pageInput.value = currentPage.value
    return
  }

  currentPage.value = targetPage
  pageInput.value = targetPage

  await renderCurrentPage()
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    changePage(currentPage.value - 1)
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    changePage(currentPage.value + 1)
  }
}

function goToInputPage() {
  changePage(pageInput.value)
}

// ==========================================
// ZOOM
// ==========================================

async function changeZoom(amount) {
  if (
    !pdfDocument.value ||
    isLoading.value ||
    isDestroyed
  ) {
    return
  }

  const newZoom = Math.min(
    2,
    Math.max(
      0.6,
      Number(
        (zoom.value + amount).toFixed(1)
      )
    )
  )

  if (newZoom === zoom.value) return

  zoom.value = newZoom

  await renderCurrentPage()
}

// ==========================================
// WATCH ROUTE
// ==========================================

watch(bookId, async (newId, oldId) => {
  if (
    newId !== oldId &&
    !isDestroyed
  ) {
    await loadPdf()
  }
})

// ==========================================
// LIFECYCLE
// ==========================================

onMounted(() => {
  isDestroyed = false

  loadPdf()
})

onBeforeUnmount(() => {
  isDestroyed = true

  loadRequestId++
  renderRequestId++

  // Simpan progres sebelum meninggalkan halaman.
  saveCurrentProgress()

  // Bersihkan task PDF.
  destroyCurrentPdf()
})
</script>

<style scoped>
.book-reader-page {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(7, 90, 158, 0.035),
      transparent 38%
    ),
    #f5f7fa;
}

.reader-content {
  width: min(1200px, 94%);
  margin: 0 auto;
  padding: 42px 0 64px;
}

/* HEADER */

.reader-header {
  margin-bottom: 26px;
}

.back-link {
  display: inline-flex;
  align-items: center;

  margin-bottom: 24px;

  color: #667085;
  text-decoration: none;

  font-size: 13px;
  font-weight: 500;

  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-primary);
}

.book-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.book-heading h1 {
  margin: 0 0 7px;

  color: var(--color-black);

  font-size: 27px;
  font-weight: 700;
  letter-spacing: -0.7px;
  line-height: 1.35;
}

.book-heading p {
  margin: 0;

  color: var(--color-gray);

  font-size: 14px;
  line-height: 1.6;
}

.reading-status {
  flex-shrink: 0;

  padding: 8px 14px;

  border: 1px solid #dce9f6;
  border-radius: 30px;

  background-color: #edf5fc;
  color: var(--color-primary);

  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

/* TOOLBAR */

.reader-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  padding: 15px 18px;

  border: 1px solid #e7ebf0;
  border-radius: 13px;

  background-color: var(--color-white);

  box-shadow: var(--shadow-sm);
}

.page-navigation,
.zoom-controls,
.page-indicator {
  display: flex;
  align-items: center;
  gap: 11px;
}

.toolbar-button,
.zoom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #e1e6ed;
  border-radius: 8px;

  background-color: #fff;
  color: #475467;

  font-family: inherit;
  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.toolbar-button {
  min-height: 36px;
  padding: 8px 12px;

  font-size: 12px;
  font-weight: 600;
}

.toolbar-button:hover:not(:disabled),
.zoom-button:hover:not(:disabled) {
  border-color: #b8cfe5;

  background-color: #f4f8fc;
  color: var(--color-primary);
}

.toolbar-button:disabled,
.zoom-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-indicator {
  color: var(--color-gray);
  font-size: 12px;
}

.page-indicator label {
  font-weight: 500;
}

.page-indicator input {
  width: 54px;
  height: 35px;

  padding: 6px;

  border: 1px solid #e1e6ed;
  border-radius: 7px;

  background-color: #fff;
  color: var(--color-black);

  font-family: inherit;
  font-size: 13px;
  text-align: center;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.page-indicator input:focus {
  border-color: var(--color-primary);
  outline: none;

  box-shadow: 0 0 0 3px rgba(7, 90, 158, 0.09);
}

.page-indicator input:disabled {
  background-color: #f5f6f8;
  cursor: not-allowed;
}

.zoom-controls {
  color: #475467;

  font-size: 12px;
  font-weight: 600;
}

.zoom-controls span {
  min-width: 43px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.zoom-button {
  width: 34px;
  height: 34px;

  font-size: 19px;
  line-height: 1;
}

/* PDF VIEWER */

.pdf-viewer {
  margin-top: 24px;
  text-align: center;
}

.pdf-page-container {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  overflow: auto;

  min-height: 450px;
  padding: 28px;

  border: 1px solid #e2e7ed;
  border-radius: 13px;

  background-color: #edf0f4;
}

.pdf-page-container canvas {
  display: block;

  max-width: 100%;
  height: auto;

  background-color: #fff;

  box-shadow:
    0 2px 5px rgba(24, 39, 58, 0.06),
    0 8px 24px rgba(24, 39, 58, 0.12);
}

.pdf-page-container canvas.canvas-loading {
  visibility: hidden;
}

.render-loading {
  position: absolute;
  top: 50%;
  left: 50%;

  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;

  transform: translate(-50%, -50%);
}

.render-loading p {
  margin: 0;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.6;
}

.progress-information {
  margin: 15px 0 0;

  color: var(--color-gray);

  font-size: 12px;
  line-height: 1.6;
}

/* MESSAGES */

.reader-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 380px;
  margin-top: 24px;
  padding: 32px 24px;

  border: 1px solid #e7ebf0;
  border-radius: 13px;

  background-color: var(--color-white);

  text-align: center;
  box-shadow: var(--shadow-sm);
}

.reader-message p {
  margin: 12px 0 0;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.7;
}

.error-message h2 {
  margin: 0;

  color: #a83232;

  font-size: 19px;
  font-weight: 700;
}

.error-message p {
  max-width: 520px;
}

.retry-button {
  min-height: 40px;
  margin-top: 18px;
  padding: 9px 18px;

  border: 1px solid var(--color-primary);
  border-radius: 8px;

  background-color: var(--color-primary);
  color: #fff;

  font-family: inherit;
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.retry-button:hover:not(:disabled) {
  border-color: var(--color-primary-dark);
  background-color: var(--color-primary-dark);
}

.retry-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* LOADING SPINNER */

.loading-spinner {
  width: 36px;
  height: 36px;

  border: 3px solid #e5eaf0;
  border-top-color: var(--color-primary);
  border-radius: 50%;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* FOCUS ACCESSIBILITY */

.toolbar-button:focus-visible,
.zoom-button:focus-visible,
.retry-button:focus-visible,
.back-link:focus-visible {
  outline: 3px solid rgba(7, 90, 158, 0.18);
  outline-offset: 3px;
}

/* TABLET */

@media (max-width: 768px) {
  .reader-content {
    width: 94%;
    padding-top: 32px;
  }

  .book-heading h1 {
    font-size: 23px;
  }

  .reader-toolbar {
    flex-wrap: wrap;
  }

  .page-navigation {
    flex-wrap: wrap;
  }

  .pdf-page-container {
    min-height: 350px;
    padding: 18px;
  }
}

/* MOBILE */

@media (max-width: 600px) {
  .reader-content {
    width: 94%;
    padding-top: 26px;
    padding-bottom: 42px;
  }

  .reader-header {
    margin-bottom: 20px;
  }

  .back-link {
    margin-bottom: 19px;
    font-size: 12px;
  }

  .book-heading {
    align-items: flex-start;
    gap: 12px;
  }

  .book-heading h1 {
    font-size: 20px;
  }

  .book-heading p {
    font-size: 12px;
  }

  .reading-status {
    padding: 6px 9px;
    font-size: 9px;
  }

  .reader-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;

    padding: 14px;
  }

  .page-navigation {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 7px;
  }

  .toolbar-button {
    min-width: 0;
    padding: 9px 6px;

    font-size: 10px;
    white-space: nowrap;
  }

  .page-indicator {
    justify-content: center;
    gap: 5px;

    font-size: 10px;
  }

  .page-indicator input {
    width: 43px;
    height: 33px;

    font-size: 12px;
  }

  .page-indicator span {
    white-space: nowrap;
  }

  .zoom-controls {
    justify-content: center;
    padding-top: 2px;
  }

  .pdf-viewer {
    margin-top: 17px;
  }

  .pdf-page-container {
    min-height: 280px;
    padding: 10px;

    border-radius: 10px;
  }

  .progress-information {
    font-size: 11px;
  }

  .reader-message {
    min-height: 300px;
    padding: 25px 18px;
  }
}

/* SMALL MOBILE */

@media (max-width: 360px) {
  .reader-content {
    width: 95%;
  }

  .book-heading h1 {
    font-size: 18px;
  }

  .reading-status {
    font-size: 8px;
  }

  .reader-toolbar {
    padding: 11px;
  }

  .toolbar-button {
    font-size: 9px;
  }

  .page-indicator {
    gap: 4px;
    font-size: 9px;
  }

  .page-indicator input {
    width: 37px;
  }

  .pdf-page-container {
    padding: 7px;
  }
}

/* REDUCED MOTION */

@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation-duration: 1.8s;
  }

  .back-link,
  .toolbar-button,
  .zoom-button,
  .retry-button {
    transition: none;
  }
}
</style>
