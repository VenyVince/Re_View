import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ mode, setMode }) {
    const [sort, setSort] = useState("인기순");

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
                <div className="date-range">
                    <label>기간</label>
                    <div className="date-inputs">
                        <input type="date" defaultValue="2025-11-01" />
                        <span>~</span>
                        <input type="date" defaultValue="2025-11-07" />
                    </div>
                </div>

                <div className="sort-select">
                    <label>정렬</label>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
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