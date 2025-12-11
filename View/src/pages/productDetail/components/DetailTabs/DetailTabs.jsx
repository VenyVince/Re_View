import React from "react";
import "./DetailTabs.css";

export default function DetailTabs({ activeTab, setActiveTab }) {
    return (
        <div className="pd-tabs">

            {/* 상품 정보 탭 */}
            <button
                className={activeTab === "info" ? "active" : ""}
                onClick={() => setActiveTab("info")}
            >
                상품 정보
            </button>

            {/* 리뷰 탭 */}
            <button
                className={activeTab === "review" ? "active" : ""}
                onClick={() => setActiveTab("review")}
            >
                상품 후기
            </button>
        </div>
    );
}
