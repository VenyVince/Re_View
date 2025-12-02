// src/pages/search/components/CategoryFilter.jsx
import React from "react";
import "../components/Filter.css";

export default function CategoryFilter({ categories = [], selectedCategory, onSelect }) {
    return (
        <div className="filter-line category-line">
            <strong className="filter-title">카테고리</strong>
            <ul className="filter-items">
                {categories.map((item, idx) => {
                    const isActive = selectedCategory === item && item !== "전체";

                    return (
                        <li
                            key={idx}
                            className={`filter-item ${isActive ? "active" : ""}`}
                            onClick={() => onSelect(item)}
                        >
                            {item}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
