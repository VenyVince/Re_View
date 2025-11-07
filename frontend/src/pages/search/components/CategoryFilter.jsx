import React from "react";
import "../components/Filter.css";

export default function CategoryFilter() {
    const categories = [
        "스킨 / 토너",
        "에센스 / 세럼 / 앰플",
        "크림",
        "로션",
        "미스트 / 오일",
        "더보기 ∨",
    ];

    return (
        <div className="filter-line">
            <strong className="filter-title">카테고리</strong>
            <ul className="filter-items">
                {categories.map((item, idx) => (
                    <li key={idx} className="filter-item">
                        {item}
                    </li>
                ))}
            </ul>
            <hr className="divider-light" />
        </div>
    );
}
