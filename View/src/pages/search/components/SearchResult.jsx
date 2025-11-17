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

    // ⭐ 상품 모드
    if (mode === "product") {
        const filteredProducts = safeResults.filter((p) => {
            // 🔥 prd_category가 백엔드에서 안 오는 상태 → 비교하면 무조건 false
            // if (selectedCategory && p.prd_category !== selectedCategory) return false;

            if (selectedBrand && p.prd_brand !== selectedBrand) return false;
            return true;
        });

        return (
            <div className="product-list">
                {filteredProducts.map((p, idx) => (
                    <div key={idx} className="product-card">
                        <p className="product-name">{p.prd_name}</p>
                        <p className="product-brand">{p.prd_brand}</p>
                        <p className="product-price">
                            {p.price?.toLocaleString()}원
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    // ⭐ 리뷰 모드
    const filteredReviews = safeResults.filter((r) => {
        if (selectedBrand && r.prd_brand !== selectedBrand) return false;
        // 리뷰에서는 category 필드가 있을 수도 있고 없을 수도 있음 → 그대로 둠
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
