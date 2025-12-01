// src/pages/reviews/components/ReviewSlider.jsx
import React, { useState } from "react";
import "./ReviewSlider.css";
import ReviewCard from "./ReviewCard";

export default function ReviewSlider({ reviews, pageWidth }) {

    const [currentPage, setCurrentPage] = useState(0);

    if (!Array.isArray(reviews) || reviews.length === 0) {
        return <div className="reviewEmpty">리뷰가 없습니다.</div>;
    }

    const PAGE_SIZE = 8;

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
        <div className="reviewCarousel">

            {/* 왼쪽 버튼 */}
            <button
                className={`reviewSlideButton left ${currentPage === 0 ? "disabled" : ""}`}
                onClick={goPrev}
            >
                &lt;
            </button>

            {/* 리뷰 화면 */}
            <div className="reviewWindow">
                <div
                    className="reviewTrack"
                    style={{ transform: `translateX(${-currentPage * pageWidth}px)` }}
                >
                    {sortedPages.map((page, index) => (
                        <div className="reviewPage" key={index}>
                            <div className="reviewRow">
                                {page.slice(0, 4).map(r => (
                                    <ReviewCard key={r.review_id} review={r} />
                                ))}
                            </div>
                            <div className="reviewRow">
                                {page.slice(4, 8).map(r => (
                                    <ReviewCard key={r.review_id} review={r} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 오른쪽 버튼 */}
            <button
                className={`reviewSlideButton right ${
                    currentPage === sortedPages.length - 1 ? "disabled" : ""
                }`}
                onClick={goNext}
            >
                &gt;
            </button>

            {/* ⭐ 페이지 번호 UI 추가 */}
            <div className="reviewPagination">
                {sortedPages.map((_, idx) => (
                    <button
                        key={idx}
                        className={`reviewPageNumber ${currentPage === idx ? "active" : ""}`}
                        onClick={() => setCurrentPage(idx)}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>

        </div>
    );
}
