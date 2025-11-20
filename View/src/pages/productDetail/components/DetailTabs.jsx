import React from "react";
import "./DetailTabs.css";

export default function DetailTabs({ activeTab, setActiveTab }) {
    return (
        <div className="pd-tabs">
            <button
                className={activeTab === "info" ? "active" : ""}
                onClick={() => setActiveTab("info")}
            >
                상품 정보
            </button>

            <button
                className={activeTab === "review" ? "active" : ""}
                onClick={() => setActiveTab("review")}
            >
                상품 후기
            </button>
        </div>
    );
}
