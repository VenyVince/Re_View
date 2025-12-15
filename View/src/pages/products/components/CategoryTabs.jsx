// src/pages/product/components/CategoryTabs.jsx
import React, { useMemo } from "react";
import "./CategoryTabs.css";

export default function CategoryTabs({
                                         categories,
                                         selected,
                                         onSelect,
                                         products = [],
                                         selectedBrand,
                                         onBrandSelect,
                                         loading,
                                     }) {
    const filteredCategories = useMemo(() => {
        return categories.filter((cat) => cat !== "전체");
    }, [categories]);

    const brandList = useMemo(() => {
        const brands = products.map((p) => p.prd_brand).filter(Boolean);
        return Array.from(new Set(brands)).sort((a, b) => a.localeCompare(b));
    }, [products]);

    const isAllCategory = selected === null;

    return (
        <div className="filter-wrapper">
            <div className="filter-row">
                <span className="filter-label">카테고리</span>
                <ul className="filter-list">
                    <li
                        className={`filter-option ${isAllCategory ? "active" : ""}`}
                        onClick={() => onSelect(null)}
                    >
                        전체
                    </li>

                    {filteredCategories.map((cat, idx) => (
                        <li
                            key={idx}
                            className={`filter-option ${selected === cat ? "active" : ""}`}
                            onClick={() => onSelect(cat)}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>

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
                        !loading &&
                        brandList.map((brand, idx) => (
                            <li
                                key={idx}
                                className={`filter-option ${
                                    selectedBrand === brand ? "active" : ""
                                }`}
                                onClick={() => onBrandSelect(brand)}
                            >
                                {brand}
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
