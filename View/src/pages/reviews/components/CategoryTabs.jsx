// src/pages/review/components/CategoryTabs.jsx
import React from "react";
import "./CategoryTabs.css";

export default function CategoryTabs({
                                         categories,
                                         selected,
                                         onSelect,
                                         brandList = [],
                                         selectedBrand,
                                         onBrandSelect
                                     }) {

    const isAllCategory = selected === "전체";

    return (
        <div className="filter-wrapper">

            {/* 카테고리 */}
            <div className="filter-row">
                <span className="filter-label">카테고리</span>

                <ul className="filter-list">
                    {categories.map((c, idx) => (
                        <li
                            key={idx}
                            className={`filter-option ${selected === c ? "active" : ""}`}
                            onClick={() => onSelect(c)}
                        >
                            {c}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 브랜드 */}
            <div className="filter-row">
                <span className="filter-label">브랜드</span>

                <ul className="filter-list">

                    <li
                        className={`filter-option ${selectedBrand === null ? "active" : ""}`}
                        onClick={() => onBrandSelect(null)}
                    >
                        전체
                    </li>

                    {!isAllCategory &&
                        brandList.map((b, idx) => (
                            <li
                                key={idx}
                                className={`filter-option ${selectedBrand === b ? "active" : ""}`}
                                onClick={() => onBrandSelect(b)}
                            >
                                {b}
                            </li>
                        ))
                    }
                </ul>
            </div>

        </div>
    );
}
