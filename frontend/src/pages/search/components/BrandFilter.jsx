import React from "react";
import "../components/Filter.css";

export default function BrandFilter() {
    const brands = [
        "닥터지",
        "피지오겔",
        "라운드랩",
        "더랩",
        "유세린",
        "닥터자르트",
        "에스트라",
        "더샘",
        "비오템",
        "한율",
    ];

    return (
        <div className="filter-line">
            <strong className="filter-title">브랜드</strong>
            <ul className="filter-items">
                {brands.map((item, idx) => (
                    <li key={idx} className="filter-item">
                        {item}
                    </li>
                ))}
            </ul>

        </div>
    );
}
