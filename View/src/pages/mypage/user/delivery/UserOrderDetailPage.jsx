import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserMyPageLayout from "../layout/UserMyPageLayout"; // 경로는 프로젝트 구조에 맞게 조정
import "./UserOrderDetailPage.css";

export default function UserOrderDetailPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const formatPrice = (v) =>
        v?.toLocaleString("ko-KR", { maximumFractionDigits: 0 }) ?? "0";

    const formatDateTime = (iso) => {
        if (!iso) return "";
        try {
            const d = new Date(iso);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const hh = String(d.getHours()).padStart(2, "0");
            const mi = String(d.getMinutes()).padStart(2, "0");
            return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
        } catch {
            return iso;
        }
    };

    const maskCardNumber = (num) => {
        if (!num) return "-";
        const clean = String(num).replace(/[^0-9]/g, "");
        if (clean.length <= 4) return `**** **** **** ${clean}`;
        const last4 = clean.slice(-4);
        return `**** **** **** ${last4}`;
    };

    // 상품 금액 합계와 배송비 추정 (total_price - 상품합)
    const itemsTotal = useMemo(() => {
        if (!order?.order_items) return 0;
        return order.order_items.reduce(
            (sum, item) => sum + (item.total_amount ?? 0),
            0
        );
    }, [order]);

    const shippingFee = useMemo(() => {
        if (!order) return 0;
        const diff = order.total_price - itemsTotal;
        return diff > 0 ? diff : 0;
    }, [order, itemsTotal]);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await axios.get(`/api/orders/${orderId}`, {
                    withCredentials: true,
                });

                setOrder(res.data);
            } catch (e) {
                if (e.response?.status === 404) {
                    setError("해당 주문을 찾을 수 없습니다.");
                } else if (e.response?.status === 401) {
                    setError("로그인이 필요합니다. 다시 로그인해 주세요.");
                } else {
                    setError("주문 상세를 불러오는 중 오류가 발생했어요.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    if (loading) {
        return (
            <UserMyPageLayout>
                <section className="mypage-section">
                    <p>주문 상세 정보를 불러오는 중입니다...</p>
                </section>
            </UserMyPageLayout>
        );
    }

    if (error) {
        return (
            <UserMyPageLayout>
                <section className="mypage-section">
                    <p className="order-detail-error">{error}</p>
                    <button
                        type="button"
                        className="order-detail-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        이전으로 돌아가기
                    </button>
                </section>
            </UserMyPageLayout>
        );
    }

    if (!order) {
        return (
            <UserMyPageLayout>
                <section className="mypage-section">
                    <p className="order-detail-error">
                        주문 정보를 찾을 수 없습니다.
                    </p>
                </section>
            </UserMyPageLayout>
        );
    }

    return (
        <UserMyPageLayout>
            <section className="mypage-section order-detail-section">
                <header className="order-detail-header">
                    <div>
                        <h3 className="order-detail-title">주문 상세</h3>
                        <p className="order-detail-sub">
                            주문 번호 {order.order_id} ·{" "}
                            {formatDateTime(order.created_at)}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="order-detail-back-btn"
                        onClick={() => navigate("/mypage")}
                    >
                        주문 배송 관리로
                    </button>
                </header>

                {/* 상단 구분선 */}
                <div className="order-detail-divider" />

                {/* 주문 정보 요약 */}
                <div className="order-detail-summary">
                    <div className="order-detail-summary-row">
                        <span className="order-detail-label">주문 상태</span>
                        <span className="order-detail-status-badge">
                            {order.order_status}
                        </span>
                    </div>
                    <div className="order-detail-summary-row">
                        <span className="order-detail-label">송장 번호</span>
                        <span className="order-detail-value">
                            {order.delivery_num || "-"}
                        </span>
                    </div>
                    <div className="order-detail-summary-row">
                        <span className="order-detail-label">총 결제 금액</span>
                        <span className="order-detail-value order-detail-total">
                            {formatPrice(order.total_price)}원
                        </span>
                    </div>
                </div>

                {/* 배송지 / 결제 정보 2열 레이아웃 */}
                <div className="order-detail-two-column">
                    {/* 배송지 정보 */}
                    <section className="order-detail-block">
                        <h4 className="order-detail-block-title">배송지 정보</h4>
                        <div className="order-detail-block-body">
                            <div className="order-detail-row">
                                <span className="order-detail-label">받는 분</span>
                                <span className="order-detail-value">
                                    {order.recipient}
                                </span>
                            </div>
                            <div className="order-detail-row">
                                <span className="order-detail-label">연락처</span>
                                <span className="order-detail-value">
                                    {order.phone}
                                </span>
                            </div>
                            <div className="order-detail-row">
                                <span className="order-detail-label">주소</span>
                                <span className="order-detail-value">
                                    ({order.postal_code}) {order.address}{" "}
                                    {order.detail_address}
                                </span>
                            </div>
                        </div>
                    </section>
                    <h4 className="order-detail-block-title">주문 상품</h4>
                    <div className="order-detail-items">
                        {order.order_items && order.order_items.length > 0 ? (
                            order.order_items.map((item) => (
                                <div
                                    key={item.order_item_id}
                                    className="order-detail-item-row"
                                >
                                    <div className="order-detail-item-main">
                                        <div className="order-detail-item-name">
                                            {item.product_name}
                                        </div>
                                        <div className="order-detail-item-meta">
                                            수량 {item.quantity}개 · 개당{" "}
                                            {formatPrice(item.product_price)}원
                                        </div>
                                    </div>
                                    <div className="order-detail-item-price">
                                        {formatPrice(item.total_amount)}원
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="order-detail-empty">
                                주문된 상품이 없습니다.
                            </p>
                        )}
                    </div>

                </div>

                {/* 주문 상품 목록 */}
                <section className="order-detail-block">
                    <h4 className="order-detail-block-title">결제 정보</h4>
                    {/* 결제 정보 */}
                    <section className="order-detail-block">

                        <div className="order-detail-block-body">
                            <div className="order-detail-row">
                                <span className="order-detail-label">결제 수단</span>
                                <span className="order-detail-value">
                                    {order.card_company || "-"}{" "}
                                    {maskCardNumber(order.card_number)}
                                </span>
                            </div>
                            <div className="order-detail-row">
                                <span className="order-detail-label">상품 금액</span>
                                <span className="order-detail-value">
                                    {formatPrice(itemsTotal)}원
                                </span>
                            </div>
                            <div className="order-detail-row">
                                <span className="order-detail-label">배송비</span>
                                <span className="order-detail-value">
                                    {shippingFee > 0
                                        ? `${formatPrice(shippingFee)}원`
                                        : "무료"}
                                </span>
                            </div>
                            <div className="order-detail-row order-detail-row-total">
                                <span className="order-detail-label">총 결제 금액</span>
                                <span className="order-detail-value order-detail-total">
                                    {formatPrice(order.total_price)}원
                                </span>
                            </div>
                        </div>
                    </section>


                </section>
            </section>
        </UserMyPageLayout>
    );
}