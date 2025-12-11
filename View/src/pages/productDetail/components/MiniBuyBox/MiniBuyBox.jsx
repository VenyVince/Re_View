// src/pages/productDetail/components/MiniBuyBox/MiniBuyBox.jsx
import React from "react";
import "./MiniBuyBox.css";
import { useNavigate } from "react-router-dom";

export default function MiniBuyBox({
                                       showMiniBuyBox,
                                       setShowMiniBuyBox,
                                       product,
                                       qty,
                                       setQty,
                                       miniActionType,
                                       setShowCartPopup
                                   }) {
    const navigate = useNavigate();

    if (!showMiniBuyBox) return null;

    const handleAction = async () => {
        try {
            // ----------------------------
            // 🚀 구매하기 동작
            // ----------------------------
            if (miniActionType === "buy") {
                // OrderPaymentPage가 요구하는 데이터 구조로 직접 전달
                const orderItem = {
                    product_id: product.product_id,
                    prd_name: product.prd_name,
                    prd_brand: product.prd_brand,
                    price: product.price,
                    quantity: qty
                };

                navigate("/order/payment", {
                    state: {
                        items: [orderItem]   // 반드시 배열로 전달!
                    }
                });

                setShowMiniBuyBox(false);
                return;
            }

            // ----------------------------
            // 🧺 장바구니 담기
            // ----------------------------
            const payload = {
                product_id: product.product_id,
                quantity: qty
            };

            const response = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                alert("요청 처리 중 오류가 발생했습니다.");
                return;
            }

            // 장바구니 팝업 표시
            setShowCartPopup(true);
            setShowMiniBuyBox(false);

        } catch (err) {
            console.error("요청 오류:", err);
            alert("서버 요청 중 문제가 발생했습니다.");
        }
    };

    return (
        <div className="pd-mini-buy-box">
            <div className="pd-mini-inner">

                <div className="pd-mini-top">
                    <button
                        className="pd-mini-close"
                        onClick={() => setShowMiniBuyBox(false)}
                    >
                        ✕
                    </button>
                </div>

                <div className="pd-mini-bottom">
                    <div className="pd-mini-title">{product.prd_name}</div>

                    <div className="pd-mini-actions">

                        <div className="pd-mini-qty">
                            <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
                            <span>{qty}</span>
                            <button onClick={() => setQty(qty + 1)}>+</button>
                        </div>

                        <div className="pd-mini-price">
                            {(product.price * qty).toLocaleString()}원
                        </div>

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
