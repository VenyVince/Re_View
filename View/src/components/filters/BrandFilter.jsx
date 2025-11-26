import React from "react";
import "./Filter.css";

export default function BrandFilter({ selectedBrand, onSelect, brands = [] }) {
    return (
        <div className="filter-line brand-line">
            <strong className="filter-title">브랜드</strong>
            <ul className="filter-items">

                <li
                    className="filter-item"
                    onClick={() => onSelect("")}
                >
                    전체
                </li>


                {brands.map((name, idx) => (
                    <li
                        key={idx}
                        className={`filter-item ${selectedBrand === name ? "active" : ""}`}
                        onClick={() => onSelect(name)}
                    >
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
