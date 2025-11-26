// src/pages/product/components/CategoryTabs.jsx
import React from "react";
import "./CategoryTabs.css";

// 카테고리 탭 컴포넌트
export default function CategoryTabs({
                                         categories,      // 카테고리 목록
                                         selected,        // 현재 선택된 카테고리
                                         onSelect,        // 클릭 시 선택 변경 함수
                                         resetPageState   // 페이지 인덱스 초기화
                                     }) {
    return (
        <div className="categoryTabs">
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={`categoryTab ${selected === cat ? "active" : ""}`}
                    onClick={() => {
                        onSelect(cat);                                // 카테고리 선택
                        resetPageState((prev) => ({                   // 페이지 0으로 초기화
                            ...prev,
                            [cat]: 0
                        }));
                    }}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
