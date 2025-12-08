import React from "react";
import "./ProductSortSelect.css";

export default function ProductSortSelect({
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
                const newSort = e.target.value;
                setSortType(newSort);

                if (setPageState && selectedCategory) {
                    setPageState((prev) => ({
                        ...prev,
                        [selectedCategory]: 0
                    }));
                }
            }}
        >
            <option value="recommend">인기순</option>
            <option value="price_low">낮은 가격순</option>
            <option value="price_high">높은 가격순</option>
            <option value="name">상품명순</option>
        </select>
    );
}
