
<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/dashboard" class="navbar-brand">
        <img
          src="../assets/images/logo-ut.png"
          alt="Logo Universitas Terbuka"
          class="navbar-logo"
        />
      </router-link>

      <!-- Navigation -->
      <nav class="navbar-menu">
        <router-link
          to="/dashboard"
          class="nav-link"
          active-class="active"
        >
          Dashboard
        </router-link>

        <router-link
          to="/search-book"
          class="nav-link"
          active-class="active"
        >
          Search Book
        </router-link>

        <!-- Category -->
        <div class="category-wrapper">
          <button
            type="button"
            class="nav-link category-button"
            @click="toggleCategory"
          >
            Category Book
            <span class="category-arrow">
              {{ showCategory ? '▲' : '▼' }}
            </span>
          </button>

          <div
            v-if="showCategory"
            class="category-dropdown"
          >
            <router-link
              to="/category/fiksi"
              class="category-link"
              @click="closeCategory"
            >
              Fiksi
            </router-link>

            <router-link
              to="/category/non-fiksi"
              class="category-link"
              @click="closeCategory"
            >
              Non Fiksi
            </router-link>

            <router-link
              to="/category/edukasi"
              class="category-link"
              @click="closeCategory"
            >
              Edukasi
            </router-link>

            <router-link
              to="/category/anak-remaja"
              class="category-link"
              @click="closeCategory"
            >
              Anak dan Remaja
            </router-link>
          </div>
        </div>

        <router-link
          to="/trending-book"
          class="nav-link"
          active-class="active"
        >
          Trending Book
        </router-link>

        <router-link
          to="/bookmark"
          class="nav-link"
          active-class="active"
        >
          Bookmark
        </router-link>

        <router-link
          to="/history"
          class="nav-link"
          active-class="active"
        >
          History
        </router-link>

        <router-link
          to="/premium"
          class="nav-link"
          active-class="active"
        >
          Premium
        </router-link>

        <router-link
          to="/community"
          class="nav-link"
          active-class="active"
        >
          Join Komunitas
        </router-link>
      </nav>

      <!-- Logout -->
      <button
        type="button"
        class="logout-button"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '../services/authService'

export default {
  name: 'AppNavbar',

  setup() {
    const router = useRouter()

    const showCategory = ref(false)

    function toggleCategory() {
      showCategory.value = !showCategory.value
    }

    function closeCategory() {
      showCategory.value = false
    }

    function handleLogout() {
      logout()
      router.push('/login')
    }

    return {
      showCategory,
      toggleCategory,
      closeCategory,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* ================================
   NAVBAR CONTAINER
================================ */

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;

  width: 100%;

  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-light-gray);
  box-shadow: var(--shadow-sm);
}

.navbar-container {
  display: flex;
  align-items: center;

  width: 100%;
  max-width: 1440px;
  min-height: 76px;

  margin: 0 auto;
  padding: 0 32px;
  gap: 28px;
}

/* ================================
   BRAND / LOGO
================================ */

.navbar-brand {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
}

.navbar-logo {
  display: block;

  width: 46px;
  height: 46px;

  object-fit: contain;
}

/* ================================
   NAVIGATION MENU
================================ */

.navbar-menu {
  display: flex;
  align-items: center;

  flex: 1;
  gap: 3px;

  min-width: 0;
}

.nav-link {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 11px 10px;

  border: none;
  border-radius: var(--radius-sm);

  background-color: transparent;
  color: var(--color-gray);

  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.nav-link:hover {
  color: var(--color-primary);
  background-color: var(--color-secondary);
}

.nav-link.active {
  color: var(--color-primary);
  background-color: rgba(7, 90, 158, 0.07);
  font-weight: 600;
}

/* Active indicator */

.nav-link.active::after {
  position: absolute;
  bottom: 3px;
  left: 50%;

  width: 16px;
  height: 2px;

  border-radius: 10px;
  background-color: var(--color-primary);

  content: '';
  transform: translateX(-50%);
}

/* Keyboard accessibility */

.nav-link:focus-visible,
.logout-button:focus-visible,
.category-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

/* ================================
   CATEGORY DROPDOWN
================================ */

.category-wrapper {
  position: relative;
  flex-shrink: 0;
}

.category-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.category-arrow {
  font-size: 9px;
  color: var(--color-gray);
  transition: color 0.2s ease;
}

.category-button:hover .category-arrow {
  color: var(--color-primary);
}

.category-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;

  z-index: 1100;

  min-width: 205px;
  padding: 7px;

  background-color: var(--color-white);
  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-md);

  box-shadow: var(--shadow-md);
}

.category-link {
  display: block;

  padding: 11px 13px;

  border-radius: var(--radius-sm);

  color: var(--color-gray);
  font-size: 13px;
  font-weight: 500;

  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.category-link:hover {
  color: var(--color-primary);
  background-color: var(--color-secondary);
}

/* ================================
   LOGOUT BUTTON
================================ */

.logout-button {
  flex-shrink: 0;

  padding: 10px 19px;

  border: 1px solid rgba(7, 90, 158, 0.25);
  border-radius: var(--radius-sm);

  background-color: transparent;
  color: var(--color-primary);

  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.logout-button:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: var(--color-white);

  box-shadow: 0 3px 10px rgba(7, 90, 158, 0.15);
}

/* ================================
   RESPONSIVE: TABLET
================================ */

@media (max-width: 1100px) {
  .navbar-container {
    gap: 14px;
    padding: 0 20px;
  }

  .navbar-menu {
    gap: 1px;
  }

  .nav-link {
    padding: 10px 7px;
    font-size: 12px;
  }

  .logout-button {
    padding: 9px 13px;
    font-size: 12px;
  }
}

/* ================================
   RESPONSIVE: SMALL TABLET
================================ */

@media (max-width: 900px) {
  .navbar-container {
    flex-wrap: wrap;
    gap: 0;
    padding: 12px 22px;
  }

  .navbar-brand {
    margin-right: auto;
  }

  .navbar-menu {
    order: 3;
    flex: 0 0 100%;

    flex-wrap: wrap;
    gap: 5px;

    padding-top: 12px;
  }

  .nav-link {
    padding: 9px 10px;
    font-size: 12px;
  }

  .logout-button {
    margin-left: 16px;
  }
}

/* ================================
   RESPONSIVE: MOBILE
================================ */

@media (max-width: 520px) {
  .navbar-container {
    padding: 12px 16px;
  }

  .navbar-logo {
    width: 40px;
    height: 40px;
  }

  .navbar-menu {
    gap: 4px;
    padding-top: 12px;
  }

  .nav-link {
    padding: 9px 10px;
    font-size: 12px;
  }

  .logout-button {
    padding: 8px 13px;
    font-size: 12px;
  }

  .category-dropdown {
    min-width: 185px;
  }
}

@media (max-width: 360px) {
  .navbar-menu {
    gap: 2px;
  }

  .nav-link {
    padding: 8px;
    font-size: 11px;
  }
}
</style>
