import React, { useState, useEffect } from "react";
import "./ProductDetailPage.css";

import DetailTabs from "./components/DetailTabs";
import ProductInfoSection from "./components/ProductInfoSection";
import ProductReviewSection from "./components/ProductReviewSection";

export default function ProductDetailPage() {
    const [showIngredient, setShowIngredient] = useState(false);
    const [activeTab, setActiveTab] = useState("info");
    const [wish, setWish] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);

    const product = {
        prd_name: "바이오더마 하이드라비오 토너",
        prd_brand: "바이오더마",
        price: 38000,
        image_url: "",
        category: "토너",
        rating: 4.5,
        ingredient: "정제수, 글리세린, 폴리솔베이트20...",
        description: "건조한 피부를 위한 진정 토너"
    };

    const reviews = [
        {
            review_id: 1,
            nickname: "스킨케어러버",
            baumann_type: "DSPT",
            rating: 5,
            like_count: 12,
            dislike_count: 1,
            title: "인생 토너 찾았어요",
            content: "촉촉하고 피부가 편안해져요. 재구매 확정입니다!",
            created_at: "2025-02-01",
            images: ["https://picsum.photos/150?1"]
        },
        {
            review_id: 2,
            nickname: "건성이불편해",
            baumann_type: "OSPW",
            rating: 3,
            like_count: 2,
            dislike_count: 0,
            title: "그냥 무난",
            content: "저한테는 조금 무난했어요. 가성비는 괜찮아요.",
            created_at: "2025-01-28",
            images: []
        },
        {
            review_id: 3,
            nickname: "촉촉맨",
            baumann_type: "DSNW",
            rating: 4,
            like_count: 6,
            dislike_count: 0,
            title: "수분감은 좋음",
            content: "냄새도 좋고 수분감 최고! 건성에게 찰떡임.",
            created_at: "2025-01-21",
            images: ["https://picsum.photos/150?2"]
        }
    ];


    // 스크롤 감지 (TOP 버튼 표시/숨기기)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) setShowTopBtn(true);
            else setShowTopBtn(false);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="pd-detail-wrapper">

            <div className="pd-page">

                {/* 상단 상품 영역 */}
                <div className="pd-wrap">

                    <div className="pd-left">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.prd_name}
                                className="pd-image"
                            />
                        ) : (
                            <div className="pd-image-placeholder">상품 이미지</div>
                        )}
                    </div>

                    <div className="pd-right">
                        <div className="pd-brand">{product.prd_brand}</div>
                        <div className="pd-name">{product.prd_name}</div>
                        <div className="pd-price">
                            {product.price.toLocaleString()}원
                        </div>

                        <div className="pd-field-box">
                            <span className="pd-field-label">카테고리</span>
                            <div className="pd-field-value">#{product.category}</div>
                        </div>

                        <div className="pd-field-box">
                            <span className="pd-field-label">평균 별점</span>
                            <div className="pd-field-value">{product.rating} / 5.0</div>
                        </div>

                        <div
                            className="pd-ingredient-toggle"
                            onClick={() => setShowIngredient(!showIngredient)}
                        >
                            성분표시
                        </div>

                        {showIngredient && (
                            <div className="pd-ingredient-balloon">
                                {product.ingredient}
                            </div>
                        )}
                    </div>

                </div>

                {/* 탭 영역 */}
                <div className="pd-bottom-section">

                    <div className="pd-tabs-row">
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

                    <div className="pd-content-area">
                        {activeTab === "info" && (
                            <ProductInfoSection product={product} />
                        )}
                        {activeTab === "review" && (
                            <ProductReviewSection reviews={reviews} />
                        )}
                    </div>

                    {/* 하단바 */}
                    <div className="pd-bottom-bar">
                        <button
                            className={`pd-btm-btn wish ${wish ? "active" : ""}`}
                            onClick={() => setWish(!wish)}
                        >
                            {wish ? "♥" : "♡"}
                        </button>

                        <button className="pd-btm-btn cart">장바구니</button>
                        <button className="pd-btm-btn buy">바로구매</button>
                    </div>

                </div>

                {/* TOP 버튼: sticky */}
                {showTopBtn && (
                    <button
                        className="pd-top-btn"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        <span className="top-arrow">∧</span>
                        <span className="top-text">TOP</span>
                    </button>


                )}


            </div>

        </div>
    );
}
