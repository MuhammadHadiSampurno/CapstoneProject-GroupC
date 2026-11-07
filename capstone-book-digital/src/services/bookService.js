
const API_BASE_URL = 'http://127.0.0.1:8000'

/**
 * Mengambil rekomendasi buku dari Python FastAPI.
 *
 * @param {string} bookId - ID buku yang sedang dibuka.
 * @param {number} topN - Jumlah rekomendasi yang diminta.
 * @returns {Promise<Array>} Daftar buku rekomendasi.
 */
export async function getBookRecommendations(bookId, topN = 3) {
  if (!bookId) {
    throw new Error('ID buku tidak boleh kosong.')
  }

  if (!Number.isInteger(topN) || topN < 1) {
    throw new Error('Jumlah rekomendasi minimal 1.')
  }

  const params = new URLSearchParams({
    top_n: String(topN)
  })

  let response

  try {
    response = await fetch(
      `${API_BASE_URL}/api/recommendations/${encodeURIComponent(bookId)}?${params}`
    )
  } catch (error) {
    throw new Error(
      'Tidak dapat terhubung ke Python backend. Pastikan FastAPI sedang berjalan.'
    )
  }

  let data

  try {
    data = await response.json()
  } catch (error) {
    throw new Error('Respons dari Python backend tidak valid.')
  }

  if (!response.ok) {
    throw new Error(
      data.detail || 'Gagal mengambil rekomendasi buku.'
    )
  }

  if (
    data.status !== 'success' ||
    !Array.isArray(data.recommendations)
  ) {
    throw new Error('Format data rekomendasi tidak sesuai.')
  }

  return data.recommendations
}
