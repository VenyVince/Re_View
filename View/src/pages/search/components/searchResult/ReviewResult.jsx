// src/pages/search/components/SearchResult/ReviewResult.jsx
import React from "react";
import ReviewCard from "./ReviewCard";

export default function ReviewResult({ reviews, selectedBrand, selectedCategory }) {
    console.log("===== 리뷰 데이터 도착 =====");
    console.log(reviews);


    let filtered = reviews;

    // 🔥 카테고리 필터 추가 (핵심)
    if (selectedCategory && selectedCategory !== "전체") {
        filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // 🔥 브랜드 필터
    if (selectedBrand) {
        filtered = filtered.filter(r => r.prd_brand === selectedBrand);
    }

    return (
        <div className="review-result">
            {filtered.length === 0 ? (
                <p className="no-result">리뷰가 없습니다.</p>
            ) : (
                <ul className="result-list">
                    {filtered.map(review => (
                        <ReviewCard key={review.review_id} review={review} />
                    ))}
                </ul>
            )}
        </div>

    );
}

