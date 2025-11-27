import React from "react";
import "./CategoryTabs.css";

export default function CategoryTabs({ categories, selected, onSelect }) {
    return (
        <div className="reviewCategoryTabs">
            {categories.map((c, idx) => (
                <div
                    key={idx}
                    className={`reviewCategoryTab ${selected === c ? "active" : ""}`}
                    onClick={() => onSelect(c)}
                >
                    {c}
                </div>
            ))}
        </div>

    );
}
