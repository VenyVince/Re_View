// src/pages/order/OrderCompletePage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderCompletePage.css";

export default function OrderCompletePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const orderSummary = location.state?.orderSummary;


    const formatPrice = (v) =>
        (v ?? 0).toLocaleString("ko-KR", { maximumFractionDigits: 0 });

    // 잘못 들어온 경우 방어
    if (!orderSummary) {
        return (
            <div className="order-complete-page">
                <div className="order-complete-card">
                    <p className="order-complete-message">
                        유효한 주문 정보가 없습니다.
                    </p>
                    <button
                        type="button"
                        className="order-complete-btn"
                        onClick={() => navigate("/")}
                    >
                        메인으로 이동
                    </button>
                </div>
            </div>
        );
    }

    const { amount, itemCount, firstItemName, address } = orderSummary;
    const orderId = orderSummary.order_id || orderSummary.orderId;

    const productsLabel =
        itemCount === 1
            ? firstItemName
            : `${firstItemName} 외 ${itemCount - 1}건`;

    return (
        <div className="order-complete-page">
            <div className="order-complete-card">
                <div className="order-complete-icon-wrap">
                    <div className="order-complete-icon">✓</div>
                </div>

                <h2 className="order-complete-title">결제가 완료되었습니다.</h2>
                <p className="order-complete-sub">
                    주문해 주셔서 감사합니다. 아래에서 결제 내역을 확인하실 수 있어요.
                </p>

                <div className="order-complete-summary">
                    <div className="order-complete-row">
                        <span className="order-complete-label">결제 금액</span>
                        <span className="order-complete-value order-complete-amount">
              {formatPrice(amount)}원
            </span>
                    </div>
                    <div className="order-complete-row">
                        <span className="order-complete-label">주문 상품</span>
                        <span className="order-complete-value">{productsLabel}</span>
                    </div>
                    {address && (
                        <div className="order-complete-row order-complete-row-address">
                            <span className="order-complete-label">배송지</span>
                            <span className="order-complete-value">
                <div>{address.recipient} · {address.phone}</div>
                <div>
                  ({address.postal_code}) {address.address}
                </div>
                <div>{address.detail_address}</div>
              </span>
                        </div>
                    )}
                </div>

                <div className="order-complete-actions">
                    <button
                        type="button"
                        className="order-complete-btn order-complete-btn-secondary"
                        onClick={() => navigate(`/mypage/orders/${orderId}`)}
                    >
                        주문상세
                    </button>
                    <button
                        type="button"
                        className="order-complete-btn"
                        onClick={() => navigate("/")}
                    >
                        홈으로 가기
                    </button>
                </div>
            </div>
        </div>
    );
}