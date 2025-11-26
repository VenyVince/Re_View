// src/pages/product/components/SortSelect.jsx
import React from "react";
import "./SortSelect.css";

// 정렬 옵션 셀렉트 박스
export default function SortSelect({
                                       sortType,         // 현재 선택된 정렬 기준
                                       setSortType,      // 정렬 기준 변경 함수
                                       selectedCategory, // 선택된 카테고리
                                       setPageState      // 페이지 초기화 함수
                                   }) {
    return (
        <select
            className="sortSelect"
            value={sortType}
            onChange={(e) => {
                setSortType(e.target.value);                     // 정렬 기준 변경
                setPageState((prev) => ({                       // 선택된 카테고리의 페이지 0으로 초기화
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
