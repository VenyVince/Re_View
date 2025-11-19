
// src/pages/search/components/SearchResult.jsx
import React from "react";
import "../SearchPage.css";

export default function SearchResult({
                                         mode,
                                         results,
                                         selectedCategory,
                                         selectedBrand,
                                         sortType
                                     }) {
    let safeResults = Array.isArray(results) ? [...results] : [];

    if (!safeResults.length) {
        return (
            <p className="no-result">
                {mode === "product"
                    ? "해당 조건의 상품이 없습니다."
                    : "해당 조건의 리뷰가 없습니다."}
            </p>
        );
    }

    const categoryMap = {
        "스킨 / 토너": ["스킨", "토너"],
        "에센스 / 세럼 / 앰플": ["에센스", "세럼", "앰플"],
        "크림": ["크림"],
        "로션": ["로션"],
        "미스트 / 오일": ["미스트", "오일"]
    };

    const matchedCategories = categoryMap[selectedCategory] || [];

    // ---------------------- 상품 모드 ----------------------
    if (mode === "product") {
        let filteredProducts = safeResults.filter((p) => {
            if (selectedBrand && p.prd_brand !== selectedBrand) return false;
            if (selectedCategory && !matchedCategories.includes(p.category)) return false;
            return true;
        });

        // ★ 인기순 알고리즘: rating * log(review_count+1)
        if (sortType === "popular") {
            filteredProducts.sort((a, b) => {
                const scoreA = a.rating * Math.log((a.review_count || 0) + 1);
                const scoreB = b.rating * Math.log((b.review_count || 0) + 1);
                return scoreB - scoreA;
            });
        }

        if (sortType === "price_low") {
            filteredProducts.sort((a, b) => a.price - b.price);
        }

        if (sortType === "price_high") {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        return (
            <div className="product-list">
                {filteredProducts.map((p, idx) => (
                    <div key={idx} className="product-card">
                        <div className="product-img" />
                        <div className="product-meta">
                            <span className="product-brand">{p.prd_brand}</span>
                            <span className="product-rating">
                                {p.rating?.toFixed(1) || "0.0"} / 5.0
                            </span>
                        </div>
                        <p className="product-name">{p.prd_name}</p>
                        <p className="product-price">
                            {p.price ? `${p.price.toLocaleString()}원` : ""}
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    // ---------------------- 리뷰 모드 ----------------------
    let filteredReviews = safeResults.filter((r) => {
        if (selectedBrand && r.prd_brand !== selectedBrand) return false;
        return true;
    });

    // 리뷰 인기순 = like_count
    if (sortType === "popular") {
        filteredReviews.sort((a, b) => b.like_count - a.like_count);
    }

    if (sortType === "latest") {
        filteredReviews.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
    }

    if (sortType === "rating_high") {
        filteredReviews.sort((a, b) => b.rating - a.rating);
    }

    if (sortType === "rating_low") {
        filteredReviews.sort((a, b) => a.rating - b.rating);
    }

    return (
        <div className="product-list">
            {filteredReviews.map((r, idx) => (
                <div key={idx} className="product-card">
                    <div className="product-img" />
                    <div className="product-meta">
                        <span className="product-brand">{r.nickname}</span>
                        <span className="product-rating">
                            {r.rating?.toFixed(1) || "0.0"} / 5.0
                        </span>
                    </div>
                    <p className="product-name">{r.prd_name}</p>
                    <p className="review-content">“{r.content}”</p>
                </div>
            ))}
        </div>
    );
}
