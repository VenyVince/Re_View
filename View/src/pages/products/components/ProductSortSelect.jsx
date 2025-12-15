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
            <option value="popular">인기순</option>
            <option value="latest">최신순</option>
            <option value="low_price">낮은 가격순</option>
            <option value="high_price">높은 가격순</option>
            <option value="name">상품명순</option>
            <option value="high_rating">평점 높은 순</option>
            <option value="low_rating">평점 낮은 순</option>
        </select>
    );
}
