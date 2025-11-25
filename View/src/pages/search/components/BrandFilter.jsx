import React from "react";
import "../components/Filter.css";

export default function BrandFilter({ selectedBrand, onSelect, brands = [] }) {
    return (
        <div className="filter-line brand-line">
            <strong className="filter-title">브랜드</strong>
            <ul className="filter-items">
                {/* 전체는 항상 존재하지만 active X */}
                <li className="filter-item" onClick={() => onSelect("")}>
                    전체
                </li>

                {/* 브랜드 리스트 */}
                {brands.map((b, idx) => (
                    <li
                        key={idx}
                        className={`filter-item ${
                            selectedBrand === b.name ? "active" : ""
                        }`}
                        onClick={() => onSelect(b.name)}
                    >
                        {b.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}