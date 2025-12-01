// src/pages/product/components/SortSelect.jsx
import React from "react";
import "./SortSelect.css";

export default function SortSelect({
                                       sortType,
                                       setSortType,
                                       selectedCategory,
                                       setPageState
                                   }) {
    return (
        <select
            className="productSortSelect"
            value={sortType}
            onChange={(e) => {
                setSortType(e.target.value);
                setPageState((prev) => ({
                    ...prev,
                    [selectedCategory]: 0
                }));
            }}
        >
            <option value="recommend">추천순</option>
            <option value="price_low">낮은 가격순</option>
            <option value="price_high">높은 가격순</option>
            <option value="name">상품명순</option>
        </select>
    );
}
