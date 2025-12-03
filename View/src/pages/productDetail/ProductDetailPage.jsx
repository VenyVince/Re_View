// src/pages/productDetail/ProductDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetailPage.css";

import ProductInfoSection from "./components/ProductInfoSection/ProductInfoSection";
import ProductReviewSection from "./components/ProductReviewSection/ProductReviewSection";
import QnaSection from "./components/QnaSection/QnaSection";

import BottomBar from "./components/BottomBar/BottomBar";
import MiniBuyBox from "./components/MiniBuyBox/MiniBuyBox";

import useBottomBar from "./hooks/useBottomBar";
import useMiniBuyBox from "./hooks/useMiniBuyBox";

export default function ProductDetailPage() {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [activeTab, setActiveTab] = useState("info");
    const [wish, setWish] = useState(false);
    const [qty, setQty] = useState(1);

    const [showMiniBuyBox, setShowMiniBuyBox] = useState(false);
    const [miniActionType, setMiniActionType] = useState("buy");

    const { adjustBottomBarPosition } = useBottomBar();
    const { adjustMiniBoxPosition } = useMiniBuyBox();

    // 상품 상세 정보 조회
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

    // 스크롤 시 TOP 버튼 활성화
    useEffect(() => {
        const onScroll = () => setShowTopBtn(window.scrollY > 300);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // 탭 변경 시 UI 위치 보정
    useEffect(() => {
        requestAnimationFrame(() => {
            adjustBottomBarPosition();
            adjustMiniBoxPosition();
        });
    }, [activeTab]);

    // 스크롤/리사이즈 시 하단바 유지 보정
    useEffect(() => {
        const onScrollOrResize = () => {
            adjustBottomBarPosition();
            if (showMiniBuyBox) adjustMiniBoxPosition();
        };
        window.addEventListener("scroll", onScrollOrResize);
        window.addEventListener("resize", onScrollOrResize);
        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, [showMiniBuyBox]);

    // 미니 박스 열릴 때 즉시 보정
    useEffect(() => {
        if (showMiniBuyBox) {
            requestAnimationFrame(() => {
                adjustBottomBarPosition();
                adjustMiniBoxPosition();
            });
        }
    }, [showMiniBuyBox]);

    if (!product) return <div>상품 정보를 불러오는 중입니다...</div>;

    return (
        <div className="pd-detail-wrapper">
            <div className="pd-page">

                {/* 상단 상품 정보 */}
                <div className="pd-wrap">
                    <div className="pd-left">
                        <div className="pd-image-placeholder">상품 이미지</div>
                    </div>

                    <div className="pd-right">
                        <div className="pd-brand">{product.prd_brand}</div>
                        <div className="pd-name">{product.prd_name}</div>

                        <div className="pd-price">{product.price.toLocaleString()}원</div>

                        <div className="pd-field-box">
                            <span className="pd-field-label">카테고리</span>
                            <div className="pd-field-value">#{product.category}</div>
                        </div>

                        <div className="pd-field-box">
                            <span className="pd-field-label">평균 별점</span>
                            <div className="pd-field-value">
                                {Number(product.rating).toFixed(1)} / 5.0
                            </div>
                        </div>

                        <div className="pd-ingredient-toggle">성분표시</div>
                        <div className="pd-ingredient-balloon">{product.ingredient}</div>
                    </div>
                </div>

                {/* 탭 + 콘텐츠 */}
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

                    <div className="pd-content-area">
                        {activeTab === "info" && <ProductInfoSection product={product} />}

                        {/* ★ 리뷰: productId만 전달 */}
                        {activeTab === "review" && <ProductReviewSection productId={productId} />}

                        {/* ★ QnA: productId만 전달 */}
                        {activeTab === "qna" && <QnaSection productId={productId} />}
                    </div>

                    {/* 미니 구매 박스 */}
                    <MiniBuyBox
                        showMiniBuyBox={showMiniBuyBox}
                        setShowMiniBuyBox={setShowMiniBuyBox}
                        product={product}
                        qty={qty}
                        setQty={setQty}
                        miniActionType={miniActionType}
                    />

                    {/* 하단 고정 바 */}
                    <BottomBar
                        wish={wish}
                        setWish={setWish}
                        setMiniActionType={setMiniActionType}
                        setShowMiniBuyBox={setShowMiniBuyBox}
                        adjustBottomBarPosition={adjustBottomBarPosition}
                        adjustMiniBoxPosition={adjustMiniBoxPosition}
                    />
                </div>

                {/* TOP 버튼 */}
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
