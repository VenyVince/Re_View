// src/pages/reviews/components/ReviewSlider.jsx
import React, { useState } from "react";
import "./ReviewSlider.css";

export default function ReviewSlider({ reviews, pageWidth }) {

    // 🔥 훅은 최상단에서 선언 (조건문보다 위)
    const [currentPage, setCurrentPage] = useState(0);

    // 🔥 데이터 없는 경우 (훅 아래에서 체크)
    if (!Array.isArray(reviews) || reviews.length === 0) {
        return <div className="empty">리뷰가 없습니다.</div>;
    }

    // 페이지당 8개
    const PAGE_SIZE = 8;

    // 🔥 페이지 나누기
    const sortedPages = [];
    for (let i = 0; i < reviews.length; i += PAGE_SIZE) {
        sortedPages.push(reviews.slice(i, i + PAGE_SIZE));
    }

    const goPrev = () => {
        setCurrentPage(prev => Math.max(prev - 1, 0));
    };

    const goNext = () => {
        const last = sortedPages.length - 1;
        setCurrentPage(prev => Math.min(prev + 1, last));
    };

    return (
        <div className="carousel">

            {/* 왼쪽 버튼 */}
            <button
                className={`slideButton left ${currentPage === 0 ? "disabled" : ""}`}
                onClick={goPrev}
            >
                &lt;
            </button>

            {/* 화면 영역 */}
            <div className="window">
                <div
                    className="track"
                    style={{ transform: `translateX(${-currentPage * pageWidth}px)` }}
                >
                    {sortedPages.map((page, index) => (
                        <div className="page" key={index}>

                            {/* 1줄 */}
                            <div className="row">
                                {page.slice(0, 4).map(r => (
                                    <div className="review-card" key={r.review_id}>
                                        <div className="image-wrap">
                                            <img src={r.image_url || "/images/no-img.png"} alt={r.product_name} />
                                        </div>

                                        <div className="brand-rating">
                                            <span className="brand">{r.brand_name}</span>
                                            <span className="rating">⭐ {r.rating.toFixed(1)}</span>
                                        </div>

                                        <div className="product-name">{r.product_name}</div>

                                        <div className="review-content">{r.content}</div>
                                    </div>
                                ))}
                            </div>

                            {/* 2줄 */}
                            <div className="row">
                                {page.slice(4, 8).map(r => (
                                    <div className="review-card" key={r.review_id}>
                                        <div className="image-wrap">
                                            <img src={r.image_url || "/images/no-img.png"} alt={r.product_name} />
                                        </div>

                                        <div className="brand-rating">
                                            <span className="brand">{r.brand_name}</span>
                                            <span className="rating">{r.rating.toFixed(1)}</span>
                                        </div>

                                        <div className="product-name">{r.product_name}</div>

                                        <div className="review-content">{r.content}</div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* 오른쪽 버튼 */}
            <button
                className={`slideButton right ${
                    currentPage === sortedPages.length - 1 ? "disabled" : ""
                }`}
                onClick={goNext}
            >
                &gt;
            </button>

        </div>
    );
}
