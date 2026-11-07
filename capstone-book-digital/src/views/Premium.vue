
<template>
  <div class="premium-page">
    <AppNavbar />

    <main class="premium-container">
      <section class="premium-header">
        <h1>Premium</h1>
        <p>
          Nikmati akses membaca buku secara lebih lengkap
          dengan layanan premium.
        </p>
      </section>

      <!-- PREMIUM AKTIF -->
      <section
        v-if="isPremium"
        class="status-card premium-active"
      >
        <div class="status-icon">✓</div>

        <div>
          <h2>Premium Aktif</h2>
          <p>
            Akun Anda sudah memiliki akses Premium Selamanya.
          </p>
        </div>
      </section>

      <!-- TRIAL AKTIF -->
      <section
        v-else-if="isTrialActive"
        class="status-card trial-active"
      >
        <div class="status-icon">⏳</div>

        <div>
          <h2>Free Trial Aktif</h2>

          <p>
            Anda masih memiliki akses Free Trial.
          </p>

          <strong>
            Sisa waktu:
            {{ remainingTrialText }}
          </strong>
        </div>
      </section>

      <!-- MENUNGGU VERIFIKASI -->
      <section
        v-else-if="isPaymentPending"
        class="status-card payment-pending"
      >
        <div class="status-icon">!</div>

        <div>
          <h2>Menunggu Verifikasi</h2>

          <p>
            Bukti pembayaran Anda telah berhasil dikirim
            dan sedang menunggu verifikasi admin.
          </p>

          <span class="pending-label">
            Status Pembayaran: Pending
          </span>
        </div>
      </section>

      <!-- TRIAL SUDAH BERAKHIR -->
      <section
        v-else-if="hasUsedTrial"
        class="status-card trial-expired"
      >
        <div class="status-icon">!</div>

        <div>
          <h2>Free Trial Telah Berakhir</h2>

          <p>
            Masa Free Trial 7 hari Anda telah berakhir.
            Anda dapat melanjutkan akses dengan Premium Selamanya.
          </p>
        </div>
      </section>

      <!-- FREE TRIAL -->
      <section
        v-if="!isPremium && !isTrialActive && !isPaymentPending && !hasUsedTrial"
        class="premium-card"
      >
        <div class="card-content">
          <span class="card-label">
            GRATIS
          </span>

          <h2>Free Trial 7 Hari</h2>

          <p>
            Coba pengalaman membaca buku digital secara
            gratis selama 7 hari.
          </p>

          <ul>
            <li>Akses fitur premium selama 7 hari</li>
            <li>Tidak membutuhkan pembayaran</li>
            <li>Masa trial hanya dapat digunakan satu kali</li>
          </ul>

          <button
            type="button"
            class="primary-button"
            @click="startTrial"
          >
            Mulai Free Trial
          </button>
        </div>
      </section>

      <!-- PREMIUM PAYMENT -->
      <section
        v-if="!isPremium && !isPaymentPending"
        class="premium-card"
      >
        <div class="card-content">
          <span class="card-label">
            PREMIUM
          </span>

          <h2>Akses Premium Selamanya</h2>

          <p>
            Dapatkan akses Premium Selamanya dengan melakukan
            pembayaran melalui Virtual Account.
          </p>

          <div class="payment-info">
            <div class="payment-row">
              <span>Metode Pembayaran</span>
              <strong>Virtual Account</strong>
            </div>

            <div class="payment-row">
              <span>Nomor VA</span>
              <strong>8800123456789012</strong>
            </div>

            <div class="payment-row">
              <span>Status</span>
              <strong>Pembayaran Manual</strong>
            </div>
          </div>

          <div class="upload-section">
            <label for="payment-proof">
              Upload Bukti Pembayaran
            </label>

            <input
              id="payment-proof"
              type="file"
              accept="image/*"
              @change="handleFileChange"
            />

            <p
              v-if="selectedFile"
              class="file-name"
            >
              File dipilih:
              {{ selectedFile.name }}
            </p>
          </div>

          <button
            type="button"
            class="primary-button"
            :disabled="!selectedFile || isSubmitting"
            @click="submitPayment"
          >
            {{ isSubmitting
              ? 'Mengirim...'
              : 'Kirim Bukti Pembayaran'
            }}
          </button>

          <p
            v-if="submitMessage"
            class="submit-message"
          >
            {{ submitMessage }}
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue'

import AppNavbar from '../components/AppNavbar.vue'

import {
  getLoggedInUser,
  updateUser
} from '../services/authService'

import {
  getPremiumPayment,
  savePremiumPayment
} from '../services/storageService'

export default {
  name: 'Premium',

  components: {
    AppNavbar
  },

  setup() {
    const currentUser = ref(getLoggedInUser())

    const selectedFile = ref(null)
    const isSubmitting = ref(false)
    const submitMessage = ref('')

    const remainingTrialText = ref('')

    const isPremium = computed(() => {
      return currentUser.value?.isPremium === true
    })

    const isPaymentPending = computed(() => {
      return (
        currentUser.value?.premiumStatus === 'pending'
      )
    })

    const hasUsedTrial = computed(() => {
      return Boolean(
        currentUser.value?.trialStartedAt
      )
    })

    const isTrialActive = computed(() => {
      if (!currentUser.value?.trialEndAt) {
        return false
      }

      return (
        new Date(currentUser.value.trialEndAt).getTime() >
        Date.now()
      )
    })

    function updateRemainingTrial() {
      if (!currentUser.value?.trialEndAt) {
        remainingTrialText.value = ''
        return
      }

      const endTime = new Date(
        currentUser.value.trialEndAt
      ).getTime()

      const remaining =
        endTime - Date.now()

      if (remaining <= 0) {
        remainingTrialText.value = 'Trial telah berakhir'
        return
      }

      const totalMinutes = Math.floor(
        remaining / 1000 / 60
      )

      const days = Math.floor(
        totalMinutes / 1440
      )

      const hours = Math.floor(
        (totalMinutes % 1440) / 60
      )

      const minutes =
        totalMinutes % 60

      remainingTrialText.value =
        `${days} hari ${hours} jam ${minutes} menit`
    }

    function startTrial() {
      if (!currentUser.value) {
        return
      }

      if (currentUser.value.trialStartedAt) {
        return
      }

      const startDate = new Date()

      const endDate = new Date(
        startDate.getTime() +
        7 * 24 * 60 * 60 * 1000
      )

      const updates = {
        trialStartedAt: startDate.toISOString(),
        trialEndAt: endDate.toISOString(),
        premiumStatus: 'trial',
        isPremium: false
      }

      const result = updateUser(
        currentUser.value.id,
        updates
      )

      if (result.success) {
        currentUser.value = {
          ...currentUser.value,
          ...updates
        }

        updateRemainingTrial()
      }
    }

    function handleFileChange(event) {
      const file =
        event.target.files?.[0] || null

      selectedFile.value = file
      submitMessage.value = ''
    }

    function submitPayment() {
      if (
        !currentUser.value ||
        !selectedFile.value
      ) {
        return
      }

      isSubmitting.value = true
      submitMessage.value = ''

      const payment = {
        id: `payment-${Date.now()}`,
        userId: currentUser.value.id,
        fileName: selectedFile.value.name,
        fileType: selectedFile.value.type,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      }

      savePremiumPayment(payment)

      const updates = {
        premiumStatus: 'pending'
      }

      const result = updateUser(
        currentUser.value.id,
        updates
      )

      if (result.success) {
        /*
         * Penting:
         * currentUser diperbarui langsung agar
         * tampilan segera berubah menjadi Pending
         * tanpa harus refresh halaman.
         */
        currentUser.value = {
          ...currentUser.value,
          ...updates
        }

        selectedFile.value = null

        submitMessage.value =
          'Bukti pembayaran berhasil dikirim.'
      }

      isSubmitting.value = false
    }

    onMounted(() => {
      if (!currentUser.value) {
        return
      }

      /*
       * Sinkronisasi ulang status pembayaran
       * dari localStorage ketika halaman dibuka.
       */
      const payment = getPremiumPayment(
        currentUser.value.id
      )

      if (
        payment &&
        payment.status === 'pending'
      ) {
        currentUser.value = {
          ...currentUser.value,
          premiumStatus: 'pending'
        }
      }

      updateRemainingTrial()

      window.trialTimer = setInterval(
        updateRemainingTrial,
        60000
      )
    })

    onBeforeUnmount(() => {
      if (window.trialTimer) {
        clearInterval(window.trialTimer)
        window.trialTimer = null
      }
    })

    return {
      currentUser,
      selectedFile,
      isSubmitting,
      submitMessage,
      remainingTrialText,
      isPremium,
      isPaymentPending,
      hasUsedTrial,
      isTrialActive,
      startTrial,
      handleFileChange,
      submitPayment
    }
  }
}
</script>

<style scoped>
.premium-page {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(7, 90, 158, 0.045),
      transparent 38%
    ),
    var(--color-secondary);
}

.premium-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 54px 24px 72px;
}

/* PAGE HEADER */

.premium-header {
  margin-bottom: 38px;
  text-align: center;
}

.premium-header h1 {
  margin: 0 0 10px;

  color: var(--color-black);

  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.8px;
  line-height: 1.3;
}

.premium-header p {
  max-width: 520px;
  margin: 0 auto;

  color: var(--color-gray);

  font-size: 14px;
  line-height: 1.7;
}

/* STATUS CARD */

.status-card {
  display: flex;
  align-items: center;
  gap: 18px;

  margin-bottom: 24px;
  padding: 24px;

  background-color: var(--color-white);

  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-lg);

  box-shadow: var(--shadow-sm);
}

.status-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background-color: #edf5fc;
  color: var(--color-primary);

  font-size: 21px;
  font-weight: 700;
}

.status-card h2 {
  margin: 0 0 7px;

  color: var(--color-black);

  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.status-card p {
  margin: 0;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.7;
}

.status-card strong {
  display: inline-block;
  margin-top: 10px;

  color: var(--color-primary);

  font-size: 13px;
  font-weight: 600;
}

/* STATUS VARIANTS */

.premium-active {
  border-color: #013a90;

  background: linear-gradient(
    125deg,
    #0045bd 0%,
    #013a90 48%,
    #0b53c8 100%
  );
}

.premium-active .status-icon {
  background-color: #ffffff;
  color: #0045bd;
}

.premium-active h2,
.premium-active p {
  color: #ffffff;
}

.trial-active {
  border-color: #dce8f7;
  background-color: #fbfdff;
}

.trial-active .status-icon {
  background-color: #edf4fc;
  color: var(--color-primary);
}

.payment-pending {
  border-color: #f1e4c5;
  background-color: #fffefa;
}

.payment-pending .status-icon {
  background-color: #fff3d9;
  color: #a36d0b;
}

.trial-expired {
  border-color: #e8e2df;
  background-color: #fffdfc;
}

.trial-expired .status-icon {
  background-color: #f5eeeb;
  color: #9b5945;
}

.pending-label {
  display: inline-flex;
  align-items: center;

  margin-top: 12px;
  padding: 6px 11px;

  border: 1px solid #f1e2bd;
  border-radius: 30px;

  background-color: #fff7e6;
  color: #93620c;

  font-size: 11px;
  font-weight: 600;
}

/* PREMIUM CARD */

.premium-card {
  margin-bottom: 22px;
  overflow: hidden;

  background-color: var(--color-white);

  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-lg);

  box-shadow: var(--shadow-sm);
}

.card-content {
  padding: 30px;
}

.card-label {
  display: inline-flex;
  align-items: center;

  margin-bottom: 15px;
  padding: 6px 11px;

  border: 1px solid #dce9f6;
  border-radius: 30px;

  background-color: #edf5fc;
  color: var(--color-primary);

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
}

.card-content h2 {
  margin: 0 0 10px;

  color: var(--color-black);

  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.4;
}

.card-content > p {
  margin: 0 0 22px;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.75;
}

/* TRIAL BENEFITS */

.card-content ul {
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin: 0 0 26px;
  padding: 0;

  list-style: none;
}

.card-content li {
  position: relative;

  padding-left: 27px;

  color: #475467;

  font-size: 13px;
  line-height: 1.6;
}

.card-content li::before {
  content: "✓";

  position: absolute;
  top: 0;
  left: 0;

  width: 18px;
  height: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background-color: #edf5fc;
  color: var(--color-primary);

  font-size: 11px;
  font-weight: 700;
}

/* PAYMENT INFORMATION */

.payment-info {
  margin: 24px 0;
  padding: 8px 18px;

  border: 1px solid #e9edf3;
  border-radius: var(--radius-md);

  background-color: #f8fafc;
}

.payment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  padding: 14px 0;

  border-bottom: 1px solid #e8edf3;
}

.payment-row:last-child {
  border-bottom: none;
}

.payment-row span {
  color: var(--color-gray);
  font-size: 12px;
}

.payment-row strong {
  color: var(--color-black);

  font-size: 12px;
  font-weight: 600;
  text-align: right;
}

/* FILE UPLOAD */

.upload-section {
  margin-bottom: 20px;
}

.upload-section label {
  display: block;
  margin-bottom: 10px;

  color: var(--color-black);

  font-size: 13px;
  font-weight: 600;
}

.upload-section input {
  width: 100%;
  min-height: 46px;
  padding: 9px 11px;

  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-sm);

  background-color: #fff;

  color: var(--color-gray);
  font-family: inherit;
  font-size: 12px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.upload-section input:hover {
  border-color: #c6d5e5;
}

.upload-section input:focus {
  outline: none;

  border-color: var(--color-primary);

  box-shadow: 0 0 0 3px rgba(7, 90, 158, 0.1);
}

.upload-section input::file-selector-button {
  margin-right: 12px;
  padding: 7px 11px;

  border: 1px solid #dce5ef;
  border-radius: 6px;

  background-color: #f3f7fb;
  color: var(--color-primary);

  font-family: inherit;
  font-size: 11px;
  font-weight: 600;

  cursor: pointer;
}

.file-name {
  margin-top: 10px !important;
  margin-bottom: 0 !important;

  color: var(--color-primary) !important;

  font-size: 12px !important;
  overflow-wrap: anywhere;
}

/* PRIMARY BUTTON */

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 44px;
  padding: 11px 20px;

  border: 1px solid var(--color-primary);
  border-radius: 9px;

  background-color: var(--color-primary);
  color: var(--color-white);

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.primary-button:hover:not(:disabled) {
  border-color: var(--color-primary-dark);
  background-color: var(--color-primary-dark);

  box-shadow: 0 4px 10px rgba(7, 90, 158, 0.14);
}

.primary-button:active:not(:disabled) {
  transform: scale(0.985);
}

.primary-button:focus-visible {
  outline: 3px solid rgba(7, 90, 158, 0.2);
  outline-offset: 3px;
}

.primary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* SUBMISSION FEEDBACK */

.submit-message {
  margin-top: 14px !important;
  margin-bottom: 0 !important;

  color: #218653 !important;

  font-size: 12px !important;
  font-weight: 500;
  line-height: 1.6;
}

/* TABLET */

@media (max-width: 768px) {
  .premium-container {
    padding: 40px 20px 56px;
  }

  .premium-header {
    margin-bottom: 30px;
  }

  .premium-header h1 {
    font-size: 27px;
  }

  .card-content {
    padding: 26px;
  }
}

/* MOBILE */

@media (max-width: 520px) {
  .premium-container {
    padding: 32px 16px 44px;
  }

  .premium-header {
    margin-bottom: 25px;
    text-align: left;
  }

  .premium-header h1 {
    font-size: 25px;
  }

  .premium-header p {
    margin: 0;
    font-size: 13px;
  }

  .status-card {
    align-items: flex-start;
    gap: 14px;

    padding: 19px;
  }

  .status-icon {
    width: 42px;
    height: 42px;

    border-radius: 12px;

    font-size: 18px;
  }

  .status-card h2 {
    font-size: 17px;
  }

  .status-card p {
    font-size: 12px;
  }

  .card-content {
    padding: 22px 19px;
  }

  .card-content h2 {
    font-size: 20px;
  }

  .payment-info {
    padding-right: 14px;
    padding-left: 14px;
  }

  .payment-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .payment-row strong {
    text-align: left;
    overflow-wrap: anywhere;
  }

  .primary-button {
    width: 100%;
  }
}

/* SMALL MOBILE */

@media (max-width: 360px) {
  .premium-container {
    padding-right: 13px;
    padding-left: 13px;
  }

  .card-content {
    padding: 19px 16px;
  }

  .status-card {
    padding: 16px;
  }

  .premium-header h1 {
    font-size: 23px;
  }

  .card-content h2 {
    font-size: 18px;
  }
}

/* REDUCED MOTION */

@media (prefers-reduced-motion: reduce) {
  .primary-button,
  .upload-section input {
    transition: none;
  }
}
</style>
