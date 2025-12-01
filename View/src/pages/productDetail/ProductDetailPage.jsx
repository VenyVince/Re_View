// src/pages/productDetail/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetailPage.css";

import ProductInfoSection from "./components/ProductInfoSection";
import ProductReviewSection from "./components/ProductReviewSection";
import QnaSection from "./components/QnaSection";

export default function ProductDetailPage() {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [qnaList, setQnaList] = useState([]);

    const [activeTab, setActiveTab] = useState("info");
    const [wish, setWish] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [qty, setQty] = useState(1);

    // 🔥 상품 상세 API 호출 (이미지 제외)
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`);
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                console.error("상품 상세 조회 오류:", err);
            }
        };

        fetchProduct();
    }, [productId]);

    // 🔥 TOP 버튼 표시
    useEffect(() => {
        const handleScroll = () => {
            setShowTopBtn(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!product) return <div>상품 정보를 불러오는 중입니다...</div>;

    return (
        <div className="pd-detail-wrapper">
            <div className="pd-page">

                {/* 상단 상품 정보 영역 */}
                <div className="pd-wrap">
                    {/* 🔥 지금은 이미지 API 제외 → placeholder */}
                    <div className="pd-left">
                        <div className="pd-image-placeholder">상품 이미지</div>
                    </div>

                    {/* 🔥 API 데이터 반영 */}
                    <div className="pd-right">
                        <div className="pd-brand">{product.prd_brand}</div>
                        <div className="pd-name">{product.prd_name}</div>
                        <div className="pd-price">
                            {product.price.toLocaleString()}원
                        </div>

                        <div className="pd-field-box">
                            <span className="pd-field-label">카테고리</span>
                            <div className="pd-field-value">
                                #{product.category}
                            </div>
                        </div>

                        <div className="pd-field-box">
                            <span className="pd-field-label">평균 별점</span>
                            <div className="pd-field-value">
                                {Number(product.rating).toFixed(1)} / 5.0
                            </div>
                        </div>

                        {/* 성분 표시 */}
                        <div className="pd-ingredient-toggle">성분표시</div>
                        <div className="pd-ingredient-balloon">
                            {product.ingredient}
                        </div>

                        {/* 구매 수량 */}
                        <div className="pd-qty-box">
                            <span className="pd-qty-label">구매 수량</span>
                            <div className="pd-qty-control">
                                <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
                                <span>{qty}</span>
                                <button onClick={() => setQty(qty + 1)}>+</button>
                            </div>
                        </div>

                        <div className="pd-total-price">
                            총 상품금액:{" "}
                            <span>{(product.price * qty).toLocaleString()}원</span>
                        </div>
                    </div>
                </div>

                {/* 탭 */}
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

                        <button
                            className={activeTab === "qna" ? "active" : ""}
                            onClick={() => setActiveTab("qna")}
                        >
                            상품 문의
                        </button>
                    </div>

                    {/* 탭 내용 */}
                    <div className="pd-content-area">
                        {activeTab === "info" && (
                            <ProductInfoSection product={product} />
                        )}

                        {activeTab === "review" && (
                            <ProductReviewSection reviews={reviews} />
                        )}

                        {activeTab === "qna" && (
                            <QnaSection
                                qnaList={qnaList}
                                onWrite={(newQna) => {
                                    const today = new Date().toISOString().slice(0, 10);
                                    setQnaList([
                                        {
                                            qna_id: qnaList.length + 1,
                                            title: newQna.title,
                                            content: newQna.content,
                                            user_nickname: "user99",
                                            created_at: today,
                                            answer: "",
                                        },
                                        ...qnaList,
                                    ]);
                                }}
                            />
                        )}
                    </div>

                    {/* 하단 바 */}
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

                {/* TOP 버튼 */}
                {showTopBtn && (
                    <button
                        className="pd-top-btn"
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                    >
                        <span className="top-arrow">∧</span>
                        <span className="top-text">TOP</span>
                    </button>
                )}
            </div>
        </div>
    );
}
