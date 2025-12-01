// src/pages/product/components/CategoryTabs.jsx
import React from "react";
import "./CategoryTabs.css";

// 카테고리 탭 컴포넌트
export default function CategoryTabs({
                                         categories,
                                         selected,
                                         onSelect,
                                         resetPageState
                                     }) {
    return (
        <div className="productCategoryTabs">
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={`productCategoryTab ${selected === cat ? "active" : ""}`}
                    onClick={() => {
                        onSelect(cat);
                        resetPageState((prev) => ({
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
