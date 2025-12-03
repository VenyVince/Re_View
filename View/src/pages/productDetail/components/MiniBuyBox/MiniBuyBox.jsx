// src/pages/productDetail/components/MiniBuyBox.jsx
import React from "react";
import "./MiniBuyBox.css";

export default function MiniBuyBox({
                                       showMiniBuyBox,
                                       setShowMiniBuyBox,
                                       product,
                                       qty,
                                       setQty,
                                       miniActionType
                                   }) {

    // 미니박스가 열리지 않았으면 렌더링하지 않음
    if (!showMiniBuyBox) return null;

    // ---------------------------------------------
    // 장바구니 / 구매하기 요청 처리 (POST)
    // ---------------------------------------------
    const handleAction = async () => {
        try {
            // 1) 공통으로 보낼 데이터
            const payload = {
                product_id: product.product_id, // 상품 고유 ID
                quantity: qty                   // 선택한 수량
            };

            // 2) 액션 타입에 따라 API 결정
            const url =
                miniActionType === "cart"
                    ? "/api/mypage/cart"         // 장바구니 담기
                    : "/api/order/payment";    // 구매하기

            // 3) 실제 POST 요청
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                alert("요청 처리 중 오류가 발생했습니다.");
                return;
            }

            // 4) 동작 완료 후 메시지
            if (miniActionType === "cart") {
                alert("장바구니에 담겼습니다!");
            } else {
                alert("구매 페이지로 이동합니다!");
            }

            // 5) 미니박스 닫기
            setShowMiniBuyBox(false);

        } catch (err) {
            console.error("요청 오류:", err);
            alert("서버 요청 중 문제가 발생했습니다.");
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

                {/* 상품명 / 수량조절 / 가격 / 액션 버튼 */}
                <div className="pd-mini-bottom">
                    <div className="pd-mini-title">{product.prd_name}</div>

                    <div className="pd-mini-actions">

                        {/* 수량 조절 */}
                        <div className="pd-mini-qty">
                            <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
                            <span>{qty}</span>
                            <button onClick={() => setQty(qty + 1)}>+</button>
                        </div>

                        {/* 총 금액 */}
                        <div className="pd-mini-price">
                            {(product.price * qty).toLocaleString()}원
                        </div>

                        {/* 장바구니 / 구매 버튼 */}
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
