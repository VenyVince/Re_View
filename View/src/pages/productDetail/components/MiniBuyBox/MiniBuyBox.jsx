// src/pages/productDetail/components/MiniBuyBox/MiniBuyBox.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "./MiniBuyBox.css";

import axiosClient from "api/axiosClient";

/**
 * 상품 상세 페이지 하단 미니 구매 박스
 * - 구매하기 / 장바구니 담기 공통 처리
 */
export default function MiniBuyBox({
                                       showMiniBuyBox,
                                       setShowMiniBuyBox,
                                       product,
                                       qty,
                                       setQty,
                                       miniActionType,
                                       setShowCartPopup,
                                   }) {
    const navigate = useNavigate();

    // 미니 구매 박스 비활성화 상태면 렌더링하지 않음
    if (!showMiniBuyBox) return null;

    /**
     * 구매 / 장바구니 버튼 클릭 처리
     */
    const handleAction = async () => {
        try {
            /**
             * [구매하기]
             * - OrderPaymentPage에서 사용하는 데이터 구조로 전달
             * - state.items는 반드시 배열
             */
            if (miniActionType === "buy") {
                const orderItem = {
                    product_id: product.product_id,
                    prd_name: product.prd_name,
                    prd_brand: product.prd_brand,
                    price: product.price,
                    quantity: qty,
                };

                navigate("/order/payment", {
                    state: {
                        items: [orderItem],
                    },
                });

                setShowMiniBuyBox(false);
                return;
            }

            /**
             * [장바구니 담기]
             * - axiosClient 사용
             * - baseURL = http://localhost:8080
             * - API 경로는 /api/cart
             */
            const payload = {
                product_id: product.product_id,
                quantity: qty,
            };

            await axiosClient.post("/api/cart", payload);

            // 성공 시 장바구니 팝업 표시
            setShowCartPopup(true);
            setShowMiniBuyBox(false);

        } catch (err) {
            console.error("장바구니 요청 오류:", err);
            alert("장바구니 처리 중 문제가 발생했습니다.");
        }
    };

    return (
        <div className="pd-mini-buy-box">
            <div className="pd-mini-inner">
                {/* 닫기 버튼 */}
                <div className="pd-mini-top">
                    <button
                        className="pd-mini-close"
                        onClick={() => setShowMiniBuyBox(false)}
                    >
                        ✕
                    </button>
                </div>

                <div className="pd-mini-bottom">
                    {/* 상품명 */}
                    <div className="pd-mini-title">{product.prd_name}</div>

                    <div className="pd-mini-actions">
                        {/* 수량 조절 */}
                        <div className="pd-mini-qty">
                            <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>
                                -
                            </button>
                            <span>{qty}</span>
                            <button onClick={() => setQty(qty + 1)}>+</button>
                        </div>

                        {/* 총 가격 */}
                        <div className="pd-mini-price">
                            {(product.price * qty).toLocaleString()}원
                        </div>

                        {/* 구매 / 담기 버튼 */}
                        <button
                            className="pd-mini-buy-btn"
                            onClick={handleAction}
                        >
                            {miniActionType === "buy" ? "구매" : "담기"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
