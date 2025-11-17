// src/pages/search/components/CategoryFilter.jsx
import React from "react";
import "../components/Filter.css";

export default function CategoryFilter({ selectedCategory, onSelect }) {
    const categories = [
        "전체",
        "스킨 / 토너",
        "에센스 / 세럼 / 앰플",
        "크림",
        "로션",
        "미스트 / 오일",
    ];

    return (
        <div className="filter-line category-line">
            <strong className="filter-title">카테고리</strong>
            <ul className="filter-items">
                {categories.map((item, idx) => (
                    <li
                        key={idx}
                        className={`filter-item ${
                            (item === "전체" && selectedCategory === "all") ||
                            (item !== "전체" && selectedCategory === item) ? "active" : ""
                        }`}
                        onClick={() => onSelect(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}