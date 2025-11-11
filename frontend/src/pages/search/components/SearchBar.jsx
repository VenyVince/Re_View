import React from "react";
import "./SearchBar.css";

export default function SearchBar({ keyword, setKeyword }) {
    const handleChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <label>
                상품명
                <input
                    type="text"
                    value={keyword}
                    onChange={handleChange}
                    placeholder="검색어를 입력하세요"
                />
            </label>

            <label>
                기간
                <input type="date" defaultValue="2025-11-01" /> ~{" "}
                <input type="date" defaultValue="2025-11-07" />
            </label>

            <label>
                정렬
                <select>
                    <option>인기순</option>
                    <option>최신순</option>
                    <option>가격 낮은순</option>
                    <option>가격 높은순</option>
                </select>
            </label>

            <button type="submit" className="search-btn">
                검색
            </button>
        </form>
    );
}
