
<template>
  <router-link
    :to="{
      name: 'BookDetail',
      params: {
        id: book.id
      }
    }"
    class="book-card-link"
  >
    <article class="book-card">

      <div class="book-cover-wrapper">
        <img
          :src="book.cover"
          :alt="`Cover ${book.title}`"
          class="book-cover"
        />
      </div>

      <div class="book-content">

        <span class="book-category">
          {{ book.category }}
        </span>

        <h3 class="book-title">
          {{ book.title }}
        </h3>

        <p class="book-author">
          {{ book.author }}
        </p>

        <div class="book-meta">

          <span
            v-if="book.rating !== null"
            class="book-rating"
          >
            ★ {{ book.rating }}
          </span>

          <span
            v-else
            class="book-rating unavailable"
          >
            Rating belum tersedia
          </span>

          <span class="book-popularity">
            Popularity {{ book.popularityScore }}
          </span>

        </div>

      </div>

    </article>
  </router-link>
</template>

<script>
export default {
  name: 'BookCard',

  props: {
    book: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
/* ================================
   BOOK CARD
================================ */

.book-card-link {
  display: block;
  height: 100%;

  color: inherit;
  text-decoration: none;

  border-radius: var(--radius-lg);
  outline: none;
}

.book-card {
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  overflow: hidden;

  background-color: var(--color-white);
  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-lg);

  box-shadow: var(--shadow-sm);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.book-card-link:hover .book-card {
  transform: translateY(-4px);

  border-color: rgba(7, 90, 158, 0.18);
  box-shadow: var(--shadow-md);
}

.book-card-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}

/* ================================
   BOOK COVER
================================ */

.book-cover-wrapper {
  position: relative;

  width: 100%;
  height: 280px;
  overflow: hidden;

  background-color: #F0F3F7;
}

.book-cover {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  transition: transform 0.35s ease;
}

.book-card-link:hover .book-cover {
  transform: scale(1.035);
}

/* ================================
   BOOK INFORMATION
================================ */

.book-content {
  display: flex;
  flex-direction: column;
  flex: 1;

  padding: 18px 17px 16px;
}

/* Category */

.book-category {
  align-self: flex-start;

  display: inline-flex;
  align-items: center;

  max-width: 100%;
  margin-bottom: 11px;
  padding: 5px 10px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  border: 1px solid rgba(7, 90, 158, 0.09);
  border-radius: 999px;

  background-color: #F0F6FC;
  color: var(--color-primary);

  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

/* Title */

.book-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;

  min-height: 45px;
  max-height: 45px;

  margin: 0 0 7px;
  overflow: hidden;

  color: var(--color-black);

  font-size: 16px;
  font-weight: 650;
  line-height: 1.4;
  letter-spacing: -0.2px;

  overflow-wrap: anywhere;
}

/* Author */

.book-author {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;

  min-height: 40px;
  max-height: 40px;

  margin: 0;
  overflow: hidden;

  color: var(--color-gray);

  font-size: 12px;
  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* ================================
   BOOK METADATA
================================ */

.book-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;

  flex-wrap: wrap;
  gap: 7px;

  margin-top: auto;
  padding-top: 13px;

  border-top: 1px solid #EDF0F4;

  font-size: 11px;
}

/* Rating */

.book-rating {
  color: #A66C16;
  font-weight: 600;
  white-space: nowrap;
}

.book-rating.unavailable {
  color: var(--color-gray);
  font-weight: 400;
}

/* Popularity */

.book-popularity {
  color: var(--color-primary);
  font-weight: 600;
  white-space: nowrap;
}

/* ================================
   RESPONSIVE: TABLET
================================ */

@media (max-width: 768px) {
  .book-cover-wrapper {
    height: 240px;
  }

  .book-content {
    padding: 15px 14px;
  }

  .book-title {
    font-size: 15px;
  }

  .book-meta {
    font-size: 10px;
  }
}

/* ================================
   RESPONSIVE: MOBILE
================================ */

@media (max-width: 520px) {
  .book-cover-wrapper {
    height: 260px;
  }

  .book-content {
    padding: 16px;
  }

  .book-title {
    font-size: 16px;
  }

  .book-author {
    font-size: 12px;
  }

  .book-meta {
    font-size: 11px;
  }
}

/* ================================
   REDUCED MOTION
================================ */

@media (prefers-reduced-motion: reduce) {
  .book-card,
  .book-cover {
    transition: none;
  }

  .book-card-link:hover .book-card,
  .book-card-link:hover .book-cover {
    transform: none;
  }
}
</style>
