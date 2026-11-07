
<template>
  <div class="admin-premium-page">
    <AppNavbar />

    <main class="admin-container">
      <section class="page-header">
        <span class="page-label">
          PREMIUM MANAGEMENT
        </span>

        <h1>Verifikasi Premium</h1>

        <p>
          Kelola pengajuan dan akses Premium pengguna.
        </p>
      </section>

      <!-- PENGAJUAN PENDING -->
      <section class="section-block">
        <div class="section-title">
          <div>
            <h2>Menunggu Verifikasi</h2>
            <p class="section-description">
              Pengajuan pembayaran yang membutuhkan pemeriksaan admin.
            </p>
          </div>

          <span class="section-count">
            {{ pendingPayments.length }}
          </span>
        </div>

        <div
          v-if="pendingPayments.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">✓</div>

          <h3>Tidak Ada Pengajuan Pending</h3>

          <p>
            Saat ini belum terdapat pengguna yang
            menunggu verifikasi Premium.
          </p>
        </div>

        <div
          v-else
          class="payment-list"
        >
          <article
            v-for="payment in pendingPayments"
            :key="payment.id"
            class="payment-card"
          >
            <div class="payment-header">
              <div>
                <span class="status-badge pending">
                  Pending
                </span>

                <h2>
                  {{ getUserName(payment.userId) }}
                </h2>

                <p>
                  {{ getUserEmail(payment.userId) }}
                </p>
              </div>

              <span class="payment-date">
                {{ formatDate(payment.submittedAt) }}
              </span>
            </div>

            <div class="payment-details">
              <div class="detail-item">
                <span>User ID</span>
                <strong>
                  {{ payment.userId }}
                </strong>
              </div>

              <div class="detail-item">
                <span>Nama File</span>
                <strong>
                  {{ payment.fileName }}
                </strong>
              </div>

              <div class="detail-item">
                <span>Tipe File</span>
                <strong>
                  {{ payment.fileType }}
                </strong>
              </div>

              <div class="detail-item">
                <span>Status</span>
                <strong>
                  Menunggu Verifikasi
                </strong>
              </div>
            </div>

            <div class="prototype-note">
              Bukti pembayaran pada tahap ini masih berupa
              metadata file. File gambar belum disimpan
              secara langsung.
            </div>

            <div class="payment-actions">
              <button
                type="button"
                class="approve-button"
                @click="approvePayment(payment)"
              >
                Verifikasi & Aktifkan Premium
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- PREMIUM AKTIF -->
      <section class="section-block">
        <div class="section-title">
          <div>
            <h2>Premium Aktif</h2>
            <p class="section-description">
              Pengguna yang telah mendapatkan akses Premium.
            </p>
          </div>

          <span class="section-count active-count">
            {{ activePayments.length }}
          </span>
        </div>

        <div
          v-if="activePayments.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">★</div>

          <h3>Belum Ada Premium Aktif</h3>

          <p>
            Belum terdapat pengguna dengan akses
            Premium aktif.
          </p>
        </div>

        <div
          v-else
          class="payment-list"
        >
          <article
            v-for="payment in activePayments"
            :key="payment.id"
            class="payment-card"
          >
            <div class="payment-header">
              <div>
                <span class="status-badge active">
                  Premium Aktif
                </span>

                <h2>
                  {{ getUserName(payment.userId) }}
                </h2>

                <p>
                  {{ getUserEmail(payment.userId) }}
                </p>
              </div>

              <span class="payment-date">
                {{ formatDate(payment.verifiedAt) }}
              </span>
            </div>

            <div class="payment-details">
              <div class="detail-item">
                <span>User ID</span>
                <strong>
                  {{ payment.userId }}
                </strong>
              </div>

              <div class="detail-item">
                <span>Nama File</span>
                <strong>
                  {{ payment.fileName }}
                </strong>
              </div>

              <div class="detail-item">
                <span>Status Pembayaran</span>
                <strong>
                  Disetujui
                </strong>
              </div>

              <div class="detail-item">
                <span>Akses</span>
                <strong>
                  Premium Selamanya
                </strong>
              </div>
            </div>

            <div class="payment-actions">
              <button
                type="button"
                class="revoke-button"
                @click="revokePremium(payment)"
              >
                Cabut Akses Premium
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- PREMIUM DICABUT -->
      <section class="section-block">
        <div class="section-title">
          <div>
            <h2>Akses Premium Dicabut</h2>
            <p class="section-description">
              Riwayat akses Premium yang telah dicabut admin.
            </p>
          </div>

          <span class="section-count revoked-count">
            {{ revokedPayments.length }}
          </span>
        </div>

        <div
          v-if="revokedPayments.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">−</div>

          <h3>Belum Ada Akses yang Dicabut</h3>

          <p>
            Belum terdapat akses Premium yang
            dicabut oleh Admin.
          </p>
        </div>

        <div
          v-else
          class="payment-list"
        >
          <article
            v-for="payment in revokedPayments"
            :key="payment.id"
            class="payment-card"
          >
            <div class="payment-header">
              <div>
                <span class="status-badge revoked">
                  Premium Dicabut
                </span>

                <h2>
                  {{ getUserName(payment.userId) }}
                </h2>

                <p>
                  {{ getUserEmail(payment.userId) }}
                </p>
              </div>

              <span class="payment-date">
                {{ formatDate(payment.revokedAt) }}
              </span>
            </div>

            <div class="payment-details">
              <div class="detail-item">
                <span>User ID</span>
                <strong>
                  {{ payment.userId }}
                </strong>
              </div>

              <div class="detail-item">
                <span>Nama File</span>
                <strong>
                  {{ payment.fileName }}
                </strong>
              </div>

              <div class="detail-item">
                <span>Status</span>
                <strong>
                  Akses Premium Dicabut
                </strong>
              </div>

              <div class="detail-item">
                <span>Riwayat</span>
                <strong>
                  Data pembayaran tetap tersimpan
                </strong>
              </div>
            </div>
          </article>
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

import {
  getLoggedInUser,
  updateUser
} from '../services/authService'

import {
  getPremiumPayments,
  savePremiumPayments,
  getUsers
} from '../services/storageService'

export default {
  name: 'AdminPremium',

  components: {
    AppNavbar
  },

  setup() {
    const currentUser = getLoggedInUser()

    const users = ref(getUsers())

    const payments = ref(
      getPremiumPayments()
    )

    const pendingPayments = computed(() => {
      return payments.value.filter(
        payment =>
          payment.status === 'pending'
      )
    })

    const activePayments = computed(() => {
      return payments.value.filter(
        payment =>
          payment.status === 'approved'
      )
    })

    const revokedPayments = computed(() => {
      return payments.value.filter(
        payment =>
          payment.status === 'revoked'
      )
    })

    function getUserName(userId) {
      const user = users.value.find(
        item => item.id === userId
      )

      return user
        ? user.name
        : 'Pengguna Tidak Ditemukan'
    }

    function getUserEmail(userId) {
      const user = users.value.find(
        item => item.id === userId
      )

      return user
        ? user.email
        : '-'
    }

    function formatDate(date) {
      if (!date) {
        return '-'
      }

      return new Date(date).toLocaleString(
        'id-ID',
        {
          dateStyle: 'medium',
          timeStyle: 'short'
        }
      )
    }

    function approvePayment(payment) {
      const result = updateUser(
        payment.userId,
        {
          isPremium: true,
          premiumStatus: 'active'
        }
      )

      if (!result.success) {
        return
      }

      const updatedPayments =
        payments.value.map(item => {
          if (item.id !== payment.id) {
            return item
          }

          return {
            ...item,
            status: 'approved',
            verifiedAt:
              new Date().toISOString()
          }
        })

      payments.value = updatedPayments

      savePremiumPayments(
        updatedPayments
      )

      users.value = getUsers()
    }

    function revokePremium(payment) {
      const confirmed = window.confirm(
        `Cabut akses Premium untuk ${getUserName(payment.userId)}?`
      )

      if (!confirmed) {
        return
      }

      const result = updateUser(
        payment.userId,
        {
          isPremium: false,
          premiumStatus: 'revoked'
        }
      )

      if (!result.success) {
        return
      }

      const updatedPayments =
        payments.value.map(item => {
          if (item.id !== payment.id) {
            return item
          }

          return {
            ...item,
            status: 'revoked',
            revokedAt:
              new Date().toISOString()
          }
        })

      payments.value = updatedPayments

      savePremiumPayments(
        updatedPayments
      )

      users.value = getUsers()
    }

    return {
      currentUser,
      pendingPayments,
      activePayments,
      revokedPayments,
      getUserName,
      getUserEmail,
      formatDate,
      approvePayment,
      revokePremium
    }
  }
}
</script>

<style scoped>
.admin-premium-page {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(7, 90, 158, 0.04),
      transparent 38%
    ),
    var(--color-secondary);
}

.admin-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 54px 24px 72px;
}

/* PAGE HEADER */

.page-header {
  margin-bottom: 40px;
}

.page-label {
  display: inline-block;

  margin-bottom: 12px;
  padding: 6px 12px;

  border: 1px solid #dce9f6;
  border-radius: 30px;

  background-color: #edf5fc;
  color: var(--color-primary);

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.1px;
}

.page-header h1 {
  margin: 0 0 9px;

  color: var(--color-black);

  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.8px;
  line-height: 1.3;
}

.page-header p {
  margin: 0;

  color: var(--color-gray);

  font-size: 14px;
  line-height: 1.7;
}

/* SECTION */

.section-block {
  margin-bottom: 38px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  margin-bottom: 17px;
}

.section-title h2 {
  margin: 0;

  color: var(--color-black);

  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.section-description {
  margin: 5px 0 0;

  color: var(--color-gray);

  font-size: 12px;
  line-height: 1.6;
}

.section-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 30px;
  height: 30px;
  flex-shrink: 0;

  padding: 0 9px;

  border: 1px solid #f0e4c7;
  border-radius: 30px;

  background-color: #fff7e6;
  color: #93620c;

  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.active-count {
  border-color: #d8eadf;
  background-color: #edf7f0;
  color: #26733d;
}

.revoked-count {
  border-color: #f0dada;
  background-color: #fdf0f0;
  color: #a33a3a;
}

/* STATUS BADGES */

.status-badge {
  display: inline-flex;
  align-items: center;

  margin-bottom: 10px;
  padding: 6px 11px;

  border: 1px solid transparent;
  border-radius: 30px;

  font-size: 11px;
  font-weight: 700;
}

.status-badge.pending {
  border-color: #f0e4c7;
  background-color: #fff7e6;
  color: #93620c;
}

.status-badge.active {
  border-color: #d8eadf;
  background-color: #edf7f0;
  color: #26733d;
}

.status-badge.revoked {
  border-color: #f0dada;
  background-color: #fdf0f0;
  color: #a33a3a;
}

/* EMPTY STATE */

.empty-state {
  padding: 42px 24px;

  text-align: center;

  background-color: var(--color-white);

  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-lg);

  box-shadow: var(--shadow-sm);
}

.empty-icon {
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 15px;

  border-radius: 14px;

  background-color: #f1f5f9;
  color: var(--color-primary);

  font-size: 21px;
  font-weight: 600;
}

.empty-state h3 {
  margin: 0 0 8px;

  color: var(--color-black);

  font-size: 16px;
  font-weight: 700;
}

.empty-state p {
  max-width: 390px;
  margin: 0 auto;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.7;
}

/* PAYMENT LIST */

.payment-list {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

/* PAYMENT CARD */

.payment-card {
  min-width: 0;
  padding: 25px;

  background-color: var(--color-white);

  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-lg);

  box-shadow: var(--shadow-sm);

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.payment-card:hover {
  border-color: #d4dfeb;
  box-shadow: var(--shadow-md);
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;

  padding-bottom: 20px;

  border-bottom: 1px solid #edf0f4;
}

.payment-header h2 {
  margin: 0 0 5px;

  color: var(--color-black);

  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.payment-header p {
  margin: 0;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.6;
}

.payment-date {
  flex-shrink: 0;

  color: var(--color-gray);

  font-size: 11px;
  line-height: 1.6;
  text-align: right;
}

/* PAYMENT DETAILS */

.payment-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 24px;

  padding: 21px 0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;

  min-width: 0;
}

.detail-item span {
  color: var(--color-gray);

  font-size: 11px;
  font-weight: 500;
}

.detail-item strong {
  color: var(--color-black);

  font-size: 13px;
  font-weight: 600;
  line-height: 1.6;

  overflow-wrap: anywhere;
}

/* PROTOTYPE NOTE */

.prototype-note {
  margin-bottom: 20px;
  padding: 13px 15px;

  border: 1px solid #e6edf5;
  border-radius: 9px;

  background-color: #f6f9fc;
  color: #64748b;

  font-size: 12px;
  line-height: 1.7;
}

/* ACTIONS */

.payment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.approve-button,
.revoke-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 42px;
  padding: 10px 17px;

  border-radius: 9px;

  font-family: inherit;
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.approve-button {
  border: 1px solid var(--color-primary);

  background-color: var(--color-primary);
  color: var(--color-white);
}

.approve-button:hover {
  border-color: var(--color-primary-dark);
  background-color: var(--color-primary-dark);

  box-shadow: 0 4px 10px rgba(7, 90, 158, 0.13);
}

.revoke-button {
  border: 1px solid #e5caca;

  background-color: #fff;
  color: #b43838;
}

.revoke-button:hover {
  border-color: #b43838;

  background-color: #b43838;
  color: var(--color-white);
}

.approve-button:active,
.revoke-button:active {
  transform: scale(0.985);
}

.approve-button:focus-visible,
.revoke-button:focus-visible {
  outline: 3px solid rgba(7, 90, 158, 0.17);
  outline-offset: 3px;
}

/* TABLET */

@media (max-width: 768px) {
  .admin-container {
    padding: 40px 20px 56px;
  }

  .page-header {
    margin-bottom: 32px;
  }

  .page-header h1 {
    font-size: 27px;
  }

  .payment-card {
    padding: 21px;
  }

  .payment-header {
    flex-direction: column;
    gap: 10px;
  }

  .payment-date {
    text-align: left;
  }

  .payment-details {
    gap: 18px;
  }
}

/* MOBILE */

@media (max-width: 520px) {
  .admin-container {
    padding: 32px 16px 44px;
  }

  .page-header {
    margin-bottom: 28px;
  }

  .page-header h1 {
    font-size: 25px;
  }

  .page-header p {
    font-size: 13px;
  }

  .section-block {
    margin-bottom: 30px;
  }

  .section-title {
    align-items: flex-start;
  }

  .section-title h2 {
    font-size: 17px;
  }

  .section-description {
    font-size: 11px;
  }

  .payment-card {
    padding: 18px;
  }

  .payment-header h2 {
    font-size: 16px;
  }

  .payment-details {
    grid-template-columns: 1fr;
    gap: 15px;

    padding: 18px 0;
  }

  .payment-actions {
    flex-direction: column;
  }

  .approve-button,
  .revoke-button {
    width: 100%;
    min-height: 44px;
  }

  .empty-state {
    padding: 34px 18px;
  }
}

/* SMALL MOBILE */

@media (max-width: 360px) {
  .admin-container {
    padding-right: 13px;
    padding-left: 13px;
  }

  .payment-card {
    padding: 16px;
  }

  .section-title h2 {
    font-size: 16px;
  }
}

/* REDUCED MOTION */

@media (prefers-reduced-motion: reduce) {
  .payment-card,
  .approve-button,
  .revoke-button {
    transition: none;
  }
}
</style>
