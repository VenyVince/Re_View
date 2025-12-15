import React from "react";
import "./ReviewSortSelect.css";

export default function ReviewSortSelect({ sortType, setSortType }) {
    return (
        <select
            className="reviewSortSelect"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
        >
            <option value="likes">좋아요 순</option>
            <option value="dislikes">싫어요 순</option>
            <option value="high_rating">평점 높은 순</option>
            <option value="low_rating">평점 낮은 순</option>
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
        </select>
    );
}
