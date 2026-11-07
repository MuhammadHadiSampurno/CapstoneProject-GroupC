
import { createRouter, createWebHistory } from 'vue-router'

import LoginUser from '../views/LoginUser.vue'
import LoginAdmin from '../views/LoginAdmin.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import SearchBook from '../views/SearchBook.vue'
import CategoryBook from '../views/CategoryBook.vue'
import TrendingBook from '../views/TrendingBook.vue'
import BookDetail from '../views/BookDetail.vue'
import BookReader from '../views/BookReader.vue'
import Bookmark from '../views/Bookmark.vue'
import History from '../views/History.vue'
import Premium from '../views/Premium.vue'
import AdminPremium from '../views/AdminPremium.vue'
import Community from '../views/Community.vue'
import CommunityDetail from '../views/CommunityDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // Halaman utama
    {
      path: '/',
      redirect: '/login'
    },

    // Autentikasi
    {
      path: '/login',
      name: 'LoginUser',
      component: LoginUser
    },
    {
      path: '/login-admin',
      name: 'LoginAdmin',
      component: LoginAdmin
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },

    // Dashboard
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },

    // Katalog dan pencarian buku
    {
      path: '/search-book',
      name: 'SearchBook',
      component: SearchBook
    },
    {
      path: '/category/:category',
      name: 'CategoryBook',
      component: CategoryBook
    },
    {
      path: '/trending-book',
      name: 'TrendingBook',
      component: TrendingBook
    },

    // Detail dan pembaca buku digital
    {
      path: '/book/:id',
      name: 'BookDetail',
      component: BookDetail
    },
    {
      path: '/book/:id/read',
      name: 'BookReader',
      component: BookReader
    },

    // Bookmark dan riwayat membaca
    {
      path: '/bookmark',
      name: 'Bookmark',
      component: Bookmark
    },
    {
      path: '/history',
      name: 'History',
      component: History
    },

    // Premium
    {
      path: '/premium',
      name: 'Premium',
      component: Premium
    },
    {
      path: '/admin/premium',
      name: 'AdminPremium',
      component: AdminPremium
    },

    // Komunitas
    {
      path: '/community',
      name: 'Community',
      component: Community
    },
    {
      path: '/community/:id',
      name: 'CommunityDetail',
      component: CommunityDetail
    }
  ]
})

export default router
