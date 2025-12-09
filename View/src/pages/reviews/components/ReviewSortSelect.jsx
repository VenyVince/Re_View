import React from "react";
import "./ReviewSortSelect.css";

export default function ReviewSortSelect({ sortType, setSortType }) {
    return (
        <select
            className="reviewSortSelect"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
        >
            <option value="popular">인기순</option>
            <option value="rating_high">평점 높은 순</option>
            <option value="rating_low">평점 낮은 순</option>
            <option value="recent">최신순</option>
        </select>
    );
}
