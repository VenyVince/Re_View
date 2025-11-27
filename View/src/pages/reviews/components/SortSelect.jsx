import React from "react";
import "./SortSelect.css";

export default function SortSelect({ sortType, setSortType }) {
    return (
        <div className="reviewSortSelect">
            <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                <option value="popular">인기순</option>
                <option value="low">낮은 가격순</option>
                <option value="high">높은 가격순</option>
            </select>
        </div>
    );
}
