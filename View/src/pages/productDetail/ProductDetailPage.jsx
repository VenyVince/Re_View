// src/pages/productDetail/ProductDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetailPage.css";

import axiosClient from "../../api/axiosClient";

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

    const [showCartPopup, setShowCartPopup] = useState(false);

    const { adjustBottomBarPosition } = useBottomBar();
    const { adjustMiniBoxPosition } = useMiniBuyBox();

    // 상품 상세 조회 API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axiosClient.get(`/api/products/${productId}`);
                setProduct(res.data);
            } catch (err) {
                console.error("상품 상세 조회 오류:", err);
            }
        };
        fetchProduct();
    }, [productId]);

    // product 로딩 여부 확인용 로그
    useEffect(() => {
        if (product) console.log("로딩된 product:", product);
    }, [product]);

    // 스크롤 위치에 따라 TOP 버튼 표시
    useEffect(() => {
        const onScroll = () => setShowTopBtn(window.scrollY > 300);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // 탭 변경 시 하단 UI 위치 보정
    useEffect(() => {
        requestAnimationFrame(() => {
            adjustBottomBarPosition();
            adjustMiniBoxPosition();
        });
    }, [activeTab]);

    // 스크롤 또는 리사이즈 시 위치 보정
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

    // 미니 구매 박스 열릴 때 위치 보정
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

                <div className="pd-wrap">
                    <div className="pd-left">

                        {/* 상품 대표 이미지 표시 */}
                        <div className="pd-image-wrapper">
                            <img
                                src={product.product_images?.[0] || ""}
                                alt={product.prd_name}
                                className="pd-image"
                            />
                        </div>

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

                {/* 상품 정보 / 후기 / 문의 탭 */}
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

                    {/* 탭에 따라 다른 컴포넌트 렌더링 */}
                    <div className="pd-content-area">
                        {activeTab === "info" && <ProductInfoSection product={product} />}
                        {activeTab === "review" && <ProductReviewSection productId={productId} />}
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
                        setShowCartPopup={setShowCartPopup}
                    />

                    {/* 하단 고정 구매 영역 */}
                    <BottomBar
                        wish={wish}
                        setWish={setWish}
                        setMiniActionType={setMiniActionType}
                        setShowMiniBuyBox={setShowMiniBuyBox}
                        adjustBottomBarPosition={adjustBottomBarPosition}
                        adjustMiniBoxPosition={adjustMiniBoxPosition}
                        product={product}
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

                {/* 장바구니 추가 팝업 */}
                {showCartPopup && (
                    <div className="cart-popup-overlay">
                        <div className="cart-popup">
                            <div className="popup-message">
                                <p>장바구니에 담겼습니다.</p>
                                <p>장바구니로 이동하시겠습니까?</p>
                            </div>

                            <div className="popup-buttons">
                                <button
                                    className="popup-close"
                                    onClick={() => setShowCartPopup(false)}
                                >
                                    닫기
                                </button>

                                <button
                                    className="popup-go-cart"
                                    onClick={() => (window.location.href = "/mypage/cart")}
                                >
                                    장바구니 이동
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
