// src/pages/search/components/SearchBar.jsx
import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ mode, setMode, setSortType }) {
    const [sort, setSort] = useState("최신순");

    const handleSortChange = (e) => {
        const label = e.target.value;
        setSort(label);

        const sortMap = mode === "product"
            ? PRODUCT_SORT_MAP
            : REVIEW_SORT_MAP;

        setSortType(sortMap[label]);
    };
    const PRODUCT_SORT_MAP = {
        "오래된순": "oldest",
        "최신순": "latest",
        "평균 별점 높은순": "high_rating",
        "평균 별점 낮은순": "low_rating",
        "가격 낮은순": "low_price",
        "가격 높은순": "high_price",
        "리뷰 많은순": "reviews",
    };

    const REVIEW_SORT_MAP = {
        "최신순": "latest",
        "오래된순": "oldest",
        "별점 높은순": "high_rating",
        "별점 낮은순": "low_rating",
        "좋아요순": "likes",
        "인기순": "popular",
    };

    return (
        <div className="search-inline">
            <div className="button-wrap">
                <button
                    type="button"
                    className={`mode-btn ${mode === "product" ? "active" : ""}`}
                    onClick={() => setMode("product")}
                >
                    상품
                </button>
                <button
                    type="button"
                    className={`mode-btn ${mode === "review" ? "active" : ""}`}
                    onClick={() => setMode("review")}
                >
                    리뷰
                </button>
            </div>

            <div className="right-section">
                <div className="sort-select">
                    <label>정렬</label>
                    <select value={sort} onChange={handleSortChange}>
                        {mode === "product" ? (
                            <>
                                <option>최신순</option>
                                <option>리뷰 많은순</option>
                                <option>오래된순</option>
                                <option>평균 별점 높은순</option>
                                <option>평균 별점 낮은순</option>
                                <option>가격 낮은순</option>
                                <option>가격 높은순</option>
                            </>
                        ) : (
                            <>
                                <option>최신순</option>
                                <option>좋아요순</option>
                                <option>인기순</option>
                                <option>오래된순</option>
                                <option>별점 높은순</option>
                                <option>별점 낮은순</option>
                            </>
                        )}
                    </select>
                </div>
            </div>
        </div>
    );
}