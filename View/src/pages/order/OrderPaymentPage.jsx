// src/pages/order/OrderPaymentPage.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderPaymentPage.css";

const MOCK_DEFAULT_ADDRESS = {
    recipient: "홍길동",
    phone: "010-1234-5678",
    postal_code: "04524",
    address: "서울특별시 중구 을지로 00길 00",
    detail_address: "OOO아파트 101동 101호",
    is_default: true,
};

export default function OrderPaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();



    // 🧡 장바구니에서 넘어온 선택 상품들 (cartDummy 스키마)
    const cartItems = location.state?.items || [];

    const [items] = useState(cartItems);
    const [address] = useState(MOCK_DEFAULT_ADDRESS);
    const [availablePoint] = useState(15000);
    const [usePoint, setUsePoint] = useState(0);

    const formatPrice = (v) =>
        v.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

    // 상품 금액 합계
    const productsAmount = useMemo(
        () =>
            items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            ),
        [items]
    );

    const discountAmount = 0;

    const shippingFee = productsAmount >= 50000 ? 0 : 3000;

    const safeUsePoint = useMemo(() => {
        const maxByPrice = productsAmount - discountAmount;
        return Math.max(
            0,
            Math.min(usePoint || 0, availablePoint, maxByPrice)
        );
    }, [usePoint, availablePoint, productsAmount, discountAmount]);

    const totalPayAmount =
        productsAmount - discountAmount - safeUsePoint + shippingFee;

    const handlePointChange = (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        setUsePoint(raw === "" ? 0 : Number(raw));
    };

    const handleUseAllPoint = () => {
        const maxByPrice = productsAmount - discountAmount;
        const max = Math.min(availablePoint, maxByPrice);
        setUsePoint(max);
    };

    const handleClickChangeAddress = () => {
        navigate("/mypage/address");
    };

    const handleSubmitOrder = () => {
        if (items.length === 0) {
            alert("주문할 상품이 없습니다. 장바구니에서 다시 시도해 주세요.");
            navigate("/mypage/cart");
            return;
        }

        // TODO: 실제 주문 API 호출
        alert(
            `결제 요청\n\n총 결제 금액: ${formatPrice(
                totalPayAmount
            )}원\n(실제 결제 연동은 나중에 구현)`
        );
    };

    // 장바구니에서 안 거치고 바로 들어온 경우 방어
    if (!location.state || !cartItems.length) {
        return (
            <div className="order-page">
                <div className="order-layout">
                    <div className="order-main">
                        <div className="order-card">
                            <p>주문할 상품이 없습니다. 장바구니에서 다시 시도해 주세요.</p>
                            <button
                                type="button"
                                className="order-submit-btn"
                                onClick={() => navigate("/mypage/cart")}
                            >
                                장바구니로 이동
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-page">
            <div className="order-layout">
                {/* 왼쪽: 주문 상품 + 배송지 */}
                <div className="order-main">
                    {/* 주문 상품 */}
                    <section className="order-card">
                        <h2 className="order-card-title">주문 상품</h2>

                        <div className="order-items">
                            {items.map((item) => (
                                <div
                                    key={item.cart_items_id}
                                    className="order-item-row"
                                >
                                    <div className="order-item-thumb">
                                        <div className="order-item-thumb-placeholder">
                                            이미지
                                        </div>
                                    </div>

                                    <div className="order-item-info">
                                        <div className="order-item-brand">
                                            {item.prd_brand}
                                        </div>
                                        <div className="order-item-name">
                                            {item.prd_name}
                                        </div>
                                        <div className="order-item-meta">
                                            <span>수량 {item.quantity}개</span>
                                        </div>
                                    </div>

                                    <div className="order-item-price">
                                        {formatPrice(item.price * item.quantity)}원
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 배송지 */}
                    <section className="order-card">
                        <div className="order-card-header">
                            <h2 className="order-card-title">배송지 정보</h2>
                            <button
                                type="button"
                                className="order-link-btn"
                                onClick={handleClickChangeAddress}
                            >
                                배송지 변경
                            </button>
                        </div>

                        <div className="order-address-box">
                            <div className="order-address-recipient">
                <span className="order-address-name">
                  {address.recipient}
                </span>
                                <span className="order-address-phone">
                  {address.phone}
                </span>
                                {address.is_default && (
                                    <span className="order-address-badge">
                    기본 배송지
                  </span>
                                )}
                            </div>
                            <div className="order-address-line">
                                ({address.postal_code}) {address.address}
                            </div>
                            <div className="order-address-line">
                                {address.detail_address}
                            </div>
                        </div>
                    </section>
                </div>

                {/* 오른쪽: 포인트 + 결제 요약 */}
                <aside className="order-sidebar">
                    <section className="order-card">
                        <h2 className="order-card-title">포인트 사용</h2>

                        <div className="order-point-row">
                            <span className="order-point-label">보유 포인트</span>
                            <span className="order-point-value">
                {formatPrice(availablePoint)}P
              </span>
                        </div>

                        <div className="order-point-input-row">
                            <input
                                type="text"
                                className="order-point-input"
                                value={usePoint || ""}
                                onChange={handlePointChange}
                                placeholder="사용할 포인트 입력"
                            />
                            <button
                                type="button"
                                className="order-point-all-btn"
                                onClick={handleUseAllPoint}
                            >
                                전액 사용
                            </button>
                        </div>
                        <p className="order-point-help">
                            결제 금액을 초과하여 포인트를 사용할 수 없습니다.
                        </p>
                    </section>

                    <section className="order-card">
                        <h2 className="order-card-title">결제 금액</h2>

                        <div className="order-summary">
                            <div className="order-summary-row">
                                <span>상품 금액</span>
                                <span>{formatPrice(productsAmount)}원</span>
                            </div>
                            <div className="order-summary-row">
                                <span>할인 금액</span>
                                <span>- {formatPrice(discountAmount)}원</span>
                            </div>
                            <div className="order-summary-row">
                                <span>포인트 사용</span>
                                <span>- {formatPrice(safeUsePoint)}원</span>
                            </div>
                            <div className="order-summary-row">
                                <span>배송비</span>
                                <span>
                  {shippingFee === 0
                      ? "무료"
                      : `${formatPrice(shippingFee)}원`}
                </span>
                            </div>

                            <div className="order-summary-divider" />

                            <div className="order-summary-row order-summary-total">
                                <span>총 결제 금액</span>
                                <span className="order-summary-total-amount">
                  {formatPrice(totalPayAmount)}원
                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="order-submit-btn"
                            onClick={handleSubmitOrder}
                        >
                            결제하기
                        </button>
                    </section>
                </aside>
            </div>
        </div>
    );
}