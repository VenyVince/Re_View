// src/pages/search/components/SearchResult.jsx
import React from "react";
import "../SearchPage.css";

export default function SearchResult({
                                         mode,
                                         results,
                                         selectedCategory,
                                         selectedBrand,
                                     }) {
    const safeResults = Array.isArray(results) ? results : [];

    if (!safeResults.length) {
        return (
            <p className="no-result">
                {mode === "product"
                    ? "해당 조건의 상품이 없습니다."
                    : "해당 조건의 리뷰가 없습니다."}
            </p>
        );
    }

    // 카테고리 매핑
    const categoryMap = {
        "스킨 / 토너": ["스킨", "토너"],
        "에센스 / 세럼 / 앰플": ["에센스", "세럼", "앰플"],
        "크림": ["크림"],
        "로션": ["로션"],
        "미스트 / 오일": ["미스트", "오일"],
    };

    const matchedCategories = categoryMap[selectedCategory] || [];

    // 상품 모드
    if (mode === "product") {
        const filteredProducts = safeResults.filter((p) => {
            if (selectedBrand && p.prd_brand !== selectedBrand) return false;

            if (selectedCategory) {
                if (!matchedCategories.includes(p.category)) return false;
            }

            return true;
        });

        return (
            <div className="product-list">
                {filteredProducts.map((p, idx) => (
                    <div key={idx} className="product-card">
                        <p className="product-brand">{p.prd_brand}</p>
                        <p className="product-name">{p.prd_name}</p>
                        <p className="product-price">
                            {p.price?.toLocaleString()}원
                        </p>
                        <p className="product-rating">⭐ {p.rating}</p>
                    </div>
                ))}
            </div>
        );
    }

    // 리뷰 모드
    const filteredReviews = safeResults.filter((r) => {
        if (selectedBrand && r.prd_brand !== selectedBrand) return false;
        return true;
    });

    return (
        <div className="product-list">
            {filteredReviews.map((r, idx) => (
                <div key={idx} className="product-card">
                    <p className="product-brand">{r.prd_brand}</p>
                    <p className="product-name">{r.prd_name}</p>
                    <p className="review-content">“{r.content}”</p>
                    <p className="product-rating">⭐ {r.rating}</p>
                </div>
            ))}
        </div>
    );
}
