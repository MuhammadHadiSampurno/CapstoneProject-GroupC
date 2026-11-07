
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.books import books
from app.recommendation import recommend_books


app = FastAPI(
    title="Capstone Book Digital API",
    description="Backend Machine Learning untuk rekomendasi buku",
    version="1.0.0"
)


# Mengizinkan komunikasi dari aplikasi Vue.js lokal
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Capstone Book Digital API is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "success",
        "message": "Python backend is ready"
    }


@app.get("/api/recommendations/{book_id}")
def get_recommendations(
    book_id: str,
    top_n: int = Query(default=3, ge=1)
):
    try:
        recommendations = recommend_books(
            books=books,
            selected_book_id=book_id,
            top_n=top_n
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    return {
        "status": "success",
        "selected_book_id": book_id,
        "total": len(recommendations),
        "recommendations": recommendations
    }
