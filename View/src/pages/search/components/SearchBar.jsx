// src/pages/search/components/SearchBar.jsx
import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ mode, setMode, setSortType }) {
    const [sort, setSort] = useState("인기순");

    const handleSortChange = (e) => {
        const val = e.target.value;
        setSort(val);

        if (val === "인기순") setSortType("popular");
        if (val === "최신순") setSortType("latest");

        if (val === "가격 낮은순") setSortType("price_low");
        if (val === "가격 높은순") setSortType("price_high");

        if (val === "별점 높은순") setSortType("rating_high");
        if (val === "별점 낮은순") setSortType("rating_low");
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
                        <option>인기순</option>
                        <option>최신순</option>

                        {mode === "product" ? (
                            <>
                                <option>가격 낮은순</option>
                                <option>가격 높은순</option>
                            </>
                        ) : (
                            <>
                                <option>별점 낮은순</option>
                                <option>별점 높은순</option>
                            </>
                        )}
                    </select>
                </div>
            </div>
        </div>
    );
}