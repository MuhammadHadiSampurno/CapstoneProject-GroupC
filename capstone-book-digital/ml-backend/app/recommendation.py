
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def recommend_books(books, selected_book_id, top_n=3):
    """
    Menghasilkan rekomendasi buku menggunakan
    TF-IDF dan Cosine Similarity.

    Parameter:
    - books: daftar data buku
    - selected_book_id: ID buku yang dipilih
    - top_n: jumlah rekomendasi yang dihasilkan

    Return:
    - Daftar buku rekomendasi beserta skor kemiripan
    """

    # Validasi dataset
    if not books:
        raise ValueError("Dataset buku tidak boleh kosong.")

    if top_n < 1:
        raise ValueError("Jumlah rekomendasi minimal 1.")

    # Memastikan setiap buku memiliki ID yang unik
    book_ids = [book.get("id") for book in books]

    if None in book_ids or len(book_ids) != len(set(book_ids)):
        raise ValueError("Setiap buku harus memiliki ID yang unik.")

    # Mencari buku yang dipilih
    selected_index = next(
        (
            index
            for index, book in enumerate(books)
            if book["id"] == selected_book_id
        ),
        None
    )

    if selected_index is None:
        raise ValueError(
            f"Buku dengan ID {selected_book_id} tidak ditemukan."
        )

    # Menyiapkan representasi teks setiap buku
    book_texts = []

    for book in books:
        title = book.get("title") or ""
        author = book.get("author") or ""
        category = book.get("category") or ""
        description = book.get("description") or ""

        # Kategori diberikan bobot 2 kali
        text = (
            f"{title} "
            f"{author} "
            f"{category} "
            f"{category} "
            f"{description}"
        )

        book_texts.append(text)

    # Mengubah teks menjadi representasi numerik
    vectorizer = TfidfVectorizer(
        stop_words="english"
    )

    tfidf_matrix = vectorizer.fit_transform(book_texts)

    # Menghitung kemiripan buku yang dipilih
    similarity_scores = cosine_similarity(
        tfidf_matrix[selected_index],
        tfidf_matrix
    ).flatten()

    # Mengurutkan buku berdasarkan skor kemiripan
    ranked_indices = sorted(
        range(len(books)),
        key=lambda index: similarity_scores[index],
        reverse=True
    )

    recommendations = []

    for index in ranked_indices:

        # Tidak merekomendasikan buku yang sedang dipilih
        if index == selected_index:
            continue

        book = books[index]

        recommendations.append({
            "id": book["id"],
            "title": book.get("title"),
            "author": book.get("author"),
            "category": book.get("category"),
            "similarity": float(similarity_scores[index])
        })

        if len(recommendations) >= top_n:
            break

    return recommendations
