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
                                         loading
                                     }) {

    // 브랜드 목록 생성
    const brandList = useMemo(() => {
        const brands = products.map((p) => p.prd_brand).filter(Boolean);
        return Array.from(new Set(brands)).sort((a, b) => a.localeCompare(b));
    }, [products]);

    // 전체 카테고리 여부
    const isAllCategory = selected === null;

    // 전체 카테고리 UI
    if (isAllCategory) {
        return (
            <div className="filter-wrapper">

                {/* 카테고리 선택 */}
                <div className="filter-row">
                    <span className="filter-label">카테고리</span>
                    <ul className="filter-list">
                        <li
                            className="filter-option active"
                            onClick={() => onSelect(null)}
                        >
                            전체
                        </li>

                        {categories.map((cat, idx) => (
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

                {/* 브랜드 고정(전체만 표시) */}
                <div className="filter-row">
                    <span className="filter-label">브랜드</span>
                    <ul className="filter-list">
                        <li className="filter-option active">전체</li>
                    </ul>
                </div>

            </div>
        );
    }

    // 특정 카테고리 UI
    return (
        <div className="filter-wrapper">

            {/* 카테고리 선택 */}
            <div className="filter-row">
                <span className="filter-label">카테고리</span>
                <ul className="filter-list">
                    <li
                        className={`filter-option ${selected === null ? "active" : ""}`}
                        onClick={() => onSelect(null)}
                    >
                        전체
                    </li>

                    {categories.map((cat, idx) => (
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

            {/* 브랜드 선택 */}
            <div className="filter-row">
                <span className="filter-label">브랜드</span>

                <ul className="filter-list">
                    <li
                        className={`filter-option ${selectedBrand === null ? "active" : ""}`}
                        onClick={() => onBrandSelect(null)}
                    >
                        전체
                    </li>

                    {brandList.map((brand, idx) => (
                        <li
                            key={idx}
                            className={`filter-option ${selectedBrand === brand ? "active" : ""}`}
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
