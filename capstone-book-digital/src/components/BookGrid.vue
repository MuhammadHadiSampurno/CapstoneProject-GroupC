
<template>
  <div class="book-grid">
    <BookCard
      v-for="book in books"
      :key="book.id"
      :book="book"
    />
  </div>
</template>

<script>
import BookCard from './BookCard.vue'

export default {
  name: 'BookGrid',

  components: {
    BookCard
  },

  props: {
    books: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
/* ================================
   BOOK GRID
================================ */

.book-grid {
  display: grid;

  width: 100%;

  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: stretch;

  column-gap: 22px;
  row-gap: 28px;
}

/* ================================
   RESPONSIVE: LAPTOP
================================ */

@media (max-width: 1100px) {
  .book-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 20px;
    row-gap: 24px;
  }
}

/* ================================
   RESPONSIVE: TABLET
================================ */

@media (max-width: 800px) {
  .book-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 18px;
    row-gap: 22px;
  }
}

/* ================================
   RESPONSIVE: MOBILE
================================ */

@media (max-width: 520px) {
  .book-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 12px;
    row-gap: 18px;
  }
}

/* ================================
   RESPONSIVE: SMALL MOBILE
================================ */

@media (max-width: 340px) {
  .book-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}
</style>
