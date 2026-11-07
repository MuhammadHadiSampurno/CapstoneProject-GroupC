
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# =====================================================
# 1. DATASET ASLI DARI APLIKASI BUKU DIGITAL
# =====================================================

books = [
    {
        "id": "book-01",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "category": "Fiksi",
        "description": (
            "Set in the Jazz Age of 1920s America, the novel follows "
            "Nick Carraway and his encounters with the mysterious "
            "millionaire Jay Gatsby, whose pursuit of love and the past "
            "unfolds amid wealth, ambition, and social change."
        )
    },
    {
        "id": "book-02",
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "category": "Fiksi",
        "description": (
            "A classic romantic novel that follows Elizabeth Bennet "
            "as she navigates relationships, social expectations, "
            "and misunderstandings while developing a complicated "
            "relationship with the wealthy and reserved Mr. Darcy."
        )
    },
    {
        "id": "book-03",
        "title": "Alice's Adventures in Wonderland",
        "author": "Lewis Carroll",
        "category": "Fiksi",
        "description": (
            "Alice follows a mysterious White Rabbit down a rabbit hole "
            "and enters a fantastical world filled with unusual characters, "
            "strange situations, riddles, and adventures as she searches "
            "for a way home."
        )
    },
    {
        "id": "book-04",
        "title": "Sapiens: A Brief History of Humankind",
        "author": "Yuval Noah Harari",
        "category": "Non Fiksi",
        "description": (
            "The book explores the history of Homo sapiens and examines "
            "how human cooperation, shared beliefs, and social structures "
            "enabled our species to become a dominant force in the world."
        )
    },
    {
        "id": "book-05",
        "title": "Atomic Habits",
        "author": "James Clear",
        "category": "Non Fiksi",
        "description": (
            "A practical guide to building better habits through small "
            "and consistent changes, emphasizing how repeated actions "
            "can accumulate over time and contribute to meaningful "
            "personal improvement."
        )
    },
    {
        "id": "book-06",
        "title": "The 7 Habits of Highly Effective People",
        "author": "Stephen R. Covey",
        "category": "Non Fiksi",
        "description": (
            "A personal development book that presents seven principles "
            "for improving effectiveness, personal responsibility, "
            "relationships, and decision-making in both professional "
            "and everyday life."
        )
    },
    {
        "id": "book-07",
        "title": "Introduction to Algorithms",
        "author": (
            "Thomas H. Cormen, Charles E. Leiserson, "
            "Ronald L. Rivest, Clifford Stein"
        ),
        "category": "Edukasi",
        "description": (
            "A comprehensive textbook covering fundamental and advanced "
            "algorithms, combining theoretical rigor with practical "
            "explanations across topics such as sorting, graph algorithms, "
            "data structures, optimization, and machine learning."
        )
    },
    {
        "id": "book-08",
        "title": "Computer Networking: A Top-Down Approach",
        "author": "James F. Kurose, Keith W. Ross",
        "category": "Edukasi",
        "description": (
            "A textbook that explains computer networking through a "
            "top-down approach, beginning with application-layer concepts "
            "before progressing through the network, transport, and lower "
            "layers to build a structured understanding of networking."
        )
    },
    {
        "id": "book-09",
        "title": "IELTS Reading (Academic): Actual Tests With Answers",
        "author": "IELTS",
        "category": "Edukasi",
        "description": (
            "A collection of IELTS Academic Reading practice materials "
            "designed to develop test-taking skills and reading proficiency "
            "through practice questions based on actual or recent test materials."
        )
    },
    {
        "id": "book-10",
        "title": "Harry Potter and the Sorcerer's Stone",
        "author": "J. K. Rowling",
        "category": "Anak dan Remaja",
        "description": (
            "Harry Potter discovers that he is a wizard and begins his "
            "first year at Hogwarts School of Witchcraft and Wizardry, "
            "where he makes new friends and encounters the mysteries "
            "surrounding his past and the magical world."
        )
    },
    {
        "id": "book-11",
        "title": "The Little Prince",
        "author": "Antoine de Saint-Exupéry",
        "category": "Anak dan Remaja",
        "description": (
            "A philosophical and imaginative tale about a young prince "
            "who travels between planets and encounters different characters, "
            "exploring themes of friendship, love, loneliness, responsibility, "
            "and the way people understand the world."
        )
    },
    {
        "id": "book-12",
        "title": "The Chronicles of Narnia",
        "author": "C. S. Lewis",
        "category": "Anak dan Remaja",
        "description": (
            "A fantasy series set in the magical land of Narnia, where "
            "children encounter talking animals, mythical creatures, magic, "
            "and adventures across a world where time moves differently "
            "from their own."
        )
    }
]




# =====================================================
# 2. FUNGSI PENGUJIAN MODEL REKOMENDASI
# =====================================================

def run_recommendation_test(category_weight, selected_book_ids):

    model_name = f"TF-IDF - Bobot Kategori {category_weight} Kali"

    print("\n" + "=" * 75)
    print(f"MODEL: {model_name}")
    print("=" * 75)

    # Menggabungkan fitur buku
    # Jumlah pengulangan kategori disesuaikan dengan bobot
    book_texts = []

    for book in books:

        category_text = " ".join(
            [book["category"]] * category_weight
        )

        text = (
            f"{book['title']} "
            f"{book['author']} "
            f"{category_text} "
            f"{book['description']}"
        )

        book_texts.append(text)

    # Mengubah teks menjadi representasi numerik
    vectorizer = TfidfVectorizer(
        stop_words="english"
    )

    tfidf_matrix = vectorizer.fit_transform(book_texts)

    # Menghitung kemiripan antar buku
    similarity_matrix = cosine_similarity(tfidf_matrix)

    print(f"Jumlah buku         : {len(books)}")
    print(
        f"Jumlah fitur TF-IDF : "
        f"{len(vectorizer.get_feature_names_out())}"
    )

    # Menguji empat buku pilihan
    for selected_book_id in selected_book_ids:

        selected_index = next(
            (
                index
                for index, book in enumerate(books)
                if book["id"] == selected_book_id
            ),
            None
        )

        if selected_index is None:
            print(f"\nID buku {selected_book_id} tidak ditemukan.")
            continue

        selected_book = books[selected_index]

        # Mengurutkan skor kemiripan
        similarity_scores = list(
            enumerate(similarity_matrix[selected_index])
        )

        similarity_scores = sorted(
            similarity_scores,
            key=lambda item: item[1],
            reverse=True
        )

        print("\n" + "-" * 75)
        print(f"Buku pilihan: {selected_book['title']}")
        print(f"Kategori    : {selected_book['category']}")
        print("-" * 75)

        recommendation_count = 0

        for index, score in similarity_scores:

            if index == selected_index:
                continue

            recommendation_count += 1

            recommended_book = books[index]

            print(
                f"\n{recommendation_count}. "
                f"{recommended_book['title']}"
            )

            print(
                f"   Kategori  : "
                f"{recommended_book['category']}"
            )

            print(
                f"   Kemiripan : {score * 100:.2f}%"
            )

            if recommendation_count == 3:
                break


# =====================================================
# 3. MENENTUKAN BUKU UNTUK PENGUJIAN
# =====================================================

selected_book_ids = [
    "book-04",  # Sapiens
    "book-05",  # Atomic Habits
    "book-01",  # The Great Gatsby
    "book-10"   # Harry Potter
]


# =====================================================
# 4. PENGUJIAN MODEL A, B, DAN C
# =====================================================

# Model A: Bobot kategori 1 kali
run_recommendation_test(
    category_weight=1,
    selected_book_ids=selected_book_ids
)


# Model B: Bobot kategori 2 kali
run_recommendation_test(
    category_weight=2,
    selected_book_ids=selected_book_ids
)


# Model C: Bobot kategori 3 kali
run_recommendation_test(
    category_weight=3,
    selected_book_ids=selected_book_ids
)


# =====================================================
# 5. INFORMASI PENGUJIAN
# =====================================================

print("\n" + "=" * 75)
print("PENGUJIAN PERBANDINGAN BOBOT KATEGORI SELESAI")
print("=" * 75)

print(f"Jumlah dataset      : {len(books)} buku")
print("Model A             : Bobot kategori 1 kali")
print("Model B             : Bobot kategori 2 kali")
print("Model C             : Bobot kategori 3 kali")
print("Metode              : TF-IDF")
print("Pengukuran          : Cosine Similarity")
print("Jumlah buku uji     : 4 buku")
print("Status              : Pengujian selesai")

print("=" * 75)

# =====================================================
# 8. PENGUJIAN MODUL ALGORITMA REKOMENDASI FINAL
# =====================================================

from app.recommendation import recommend_books

print("\n" + "=" * 75)
print("PENGUJIAN MODUL REKOMENDASI FINAL")
print("=" * 75)

test_book_ids = [
    "book-04",
    "book-05",
    "book-01",
    "book-10"
]

for selected_book_id in test_book_ids:

    selected_book = next(
        book for book in books
        if book["id"] == selected_book_id
    )

    recommendations = recommend_books(
        books=books,
        selected_book_id=selected_book_id,
        top_n=3
    )

    print(f"\nBuku pilihan: {selected_book['title']}")

    for number, recommendation in enumerate(
        recommendations,
        start=1
    ):
        print(f"\n{number}. {recommendation['title']}")
        print(f"   Kategori  : {recommendation['category']}")
        print(
            f"   Kemiripan : "
            f"{recommendation['similarity'] * 100:.2f}%"
        )

print("\nPengujian modul rekomendasi selesai.")

# =====================================================
# 6. PENGUJIAN MODUL ALGORITMA REKOMENDASI FINAL
# =====================================================

from app.recommendation import recommend_books

print("\n" + "=" * 75)
print("PENGUJIAN MODUL REKOMENDASI FINAL")
print("=" * 75)

test_book_ids = [
    "book-04",
    "book-05",
    "book-01",
    "book-10"
]

for selected_book_id in test_book_ids:

    selected_book = next(
        book for book in books
        if book["id"] == selected_book_id
    )

    recommendations = recommend_books(
        books=books,
        selected_book_id=selected_book_id,
        top_n=3
    )

    print(f"\nBuku pilihan: {selected_book['title']}")

    for number, recommendation in enumerate(
        recommendations,
        start=1
    ):
        print(f"\n{number}. {recommendation['title']}")
        print(f"   Kategori  : {recommendation['category']}")
        print(
            f"   Kemiripan : "
            f"{recommendation['similarity'] * 100:.2f}%"
        )

print("\nPengujian modul rekomendasi selesai.")
