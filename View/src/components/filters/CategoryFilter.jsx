import React from "react";
import "./Filter.css";

export const categoryGroups = [
    { label: "스킨 / 토너", values: ["스킨", "토너"] },
    { label: "에센스 / 세럼 / 앰플", values: ["에센스", "세럼", "앰플"] },
    { label: "크림", values: ["크림"] },
    { label: "로션", values: ["로션"] },
    { label: "클렌징", values: ["클렌징"] }
];

export default function CategoryFilter({ selectedCategory, onSelect }) {
    return (
        <div className="filter-line category-line">
            <strong className="filter-title">카테고리</strong>
            <ul className="filter-items">
                {categoryGroups.map((item, idx) => (
                    <li
                        key={idx}
                        className={`filter-item ${
                            selectedCategory?.label === item.label ? "active" : ""
                        }`}
                        onClick={() => onSelect(item)}
                    >
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}
