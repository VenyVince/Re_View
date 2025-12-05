// src/pages/mypage/user/UserDeliveryPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserDeliveryPage.css";
// ❌ 더미 데이터는 이제 사용 안 함
// import addressDummy from "../dummy/addressDummy";
import { useNavigate } from "react-router-dom";

export default function UserDeliveryPage() {
    const navigate = useNavigate();

    // 🔹 기본 배송지 상태
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [addrLoading, setAddrLoading] = useState(true);
    const [addrError, setAddrError] = useState("");

    // 🔹 주문 목록 상태
    const [orders, setOrders] = useState([]);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState("");

    // 페이지네이션 (백엔드 page/size와 맞춰둠)
    const PAGE_SIZE = 10;

    const formatPrice = (value) =>
        value?.toLocaleString("ko-KR", { maximumFractionDigits: 0 }) ?? "0";

    const formatDate = (iso) => (iso ? iso.slice(0, 10) : "");

    const getOrderStatusText = (order) =>
        (order.order_status || order.status || "").trim();

    const getRepProductName = (order) =>
        order.rep_product_name ||
        order.main_product_name ||
        order.product_name ||
        "상품 정보";

    const getTotalItemCount = (order) =>
        typeof order.total_item_count === "number"
            ? order.total_item_count
            : typeof order.item_count === "number"
                ? order.item_count
                : 1;

    // 🔸 기본 배송지 불러오기
    const fetchDefaultAddress = async () => {
        try {
            setAddrLoading(true);
            setAddrError("");

            const res = await axios.get("/api/addresses", {
                withCredentials: true,
            });

            // 서비스가 List<AddressDTO> 를 바로 리턴한다고 가정
            const raw = Array.isArray(res.data)
                ? res.data
                : res.data?.addresses || [];

            // is_default: "1" / "0" → boolean 으로 변환
            const normalized = raw.map((a) => ({
                ...a,
                is_default: a.is_default === "1",
            }));

            // 기본 배송지 찾기 (없으면 첫 번째)
            const def =
                normalized.find((a) => a.is_default) ||
                normalized[0] ||
                null;

            setDefaultAddress(def);
        } catch (e) {
            console.error("📛 기본 배송지 조회 실패:", e);
            setAddrError("기본 배송지 정보를 불러오는 중 오류가 발생했어요.");
        } finally {
            setAddrLoading(false);
        }
    };

    // 🔸 주문 리스트 불러오기
    const fetchOrders = async (pageNo = 1) => {
        try {
            setOrderLoading(true);
            setOrderError("");

            const res = await axios.get("/api/orders", {
                params: {
                    page: pageNo,
                    size: PAGE_SIZE,
                },
                withCredentials: true,
            });

            // 컨트롤러가 List<OrderListResponseDTO> 를 바로 리턴
            const list = Array.isArray(res.data) ? res.data : [];
            setOrders(list);
        } catch (e) {
            console.error("📛 주문 내역 조회 실패:", e);
            setOrderError("주문 내역을 불러오는 중 오류가 발생했어요.");
        } finally {
            setOrderLoading(false);
        }
    };

    useEffect(() => {
        fetchDefaultAddress();
        fetchOrders(1);
    }, []);

    const completedCount = orders.filter(
        (o) => getOrderStatusText(o) === "주문완료"
    ).length;
    const shippingCount = orders.filter(
        (o) => getOrderStatusText(o) === "배송중"
    ).length;
    const deliveredCount = orders.filter(
        (o) => getOrderStatusText(o) === "배송완료"
    ).length;

    return (
        <UserMyPageLayout>
            {/* ▶ 세션 카드 1 : 주문 배송 관리(기본 배송지 카드) */}
            <section className="mypage-section delivery-summary-section">
                <div className="delivery-default-card">
                    {addrLoading ? (
                        <div className="delivery-default-loading">
                            기본 배송지를 불러오는 중입니다...
                        </div>
                    ) : addrError ? (
                        <div className="delivery-default-error">{addrError}</div>
                    ) : !defaultAddress ? (
                        <div className="delivery-default-empty">
                            등록된 기본 배송지가 없습니다.
                            <button
                                type="button"
                                className="delivery-manage-btn inline"
                                onClick={() => navigate("/mypage/address")}
                            >
                                배송지 등록하러 가기
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="delivery-default-left">
                                <div className="delivery-default-label">기본 배송지</div>
                                <div className="delivery-default-main">
                                    <span className="delivery-tag">
                                        {defaultAddress.address_name || "배송지"}
                                    </span>
                                    <span className="delivery-recipient">
                                        {defaultAddress.recipient_name}
                                    </span>
                                    <span className="delivery-phone">
                                        {defaultAddress.phone_number}
                                    </span>
                                </div>
                                <div className="delivery-default-sub">
                                    ({defaultAddress.postal_code}) {defaultAddress.address}{" "}
                                    {defaultAddress.detail_address}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="delivery-manage-btn"
                                onClick={() => navigate("/mypage/address")}
                            >
                                배송지 관리
                            </button>
                        </>
                    )}
                </div>
            </section>

            {/* ▶ 세션 카드 2 : 주문 배송 현황 */}
            <section className="mypage-section delivery-status-section">
                <h3 className="mypage-section-title">주문 배송 현황</h3>

                <div className="delivery-status-card-wrapper">
                    <div className="delivery-status-card">
                        <div className="delivery-status-label">주문완료</div>
                        <div className="delivery-status-value">{completedCount}</div>
                    </div>
                    <div className="delivery-status-card">
                        <div className="delivery-status-label">배송중</div>
                        <div className="delivery-status-value">{shippingCount}</div>
                    </div>
                    <div className="delivery-status-card">
                        <div className="delivery-status-label">배송완료</div>
                        <div className="delivery-status-value">{deliveredCount}</div>
                    </div>
                </div>
            </section>

            {/* ▶ 세션 카드 3 : 최근 주문 내역 */}
            <section className="mypage-section delivery-orders-section">
                <h3 className="mypage-section-title">최근 주문 내역</h3>

                {orderLoading && (
                    <p className="delivery-order-message">주문 내역을 불러오는 중...</p>
                )}
                {orderError && (
                    <p className="delivery-order-message error">{orderError}</p>
                )}
                {!orderLoading && !orderError && orders.length === 0 && (
                    <p className="delivery-order-message">
                        아직 주문 내역이 없습니다.
                    </p>
                )}

                {orders.length > 0 && (
                    <div className="delivery-order-list">
                        {orders.map((order) => {
                            const statusText = getOrderStatusText(order) || "주문완료";
                            const totalCount = getTotalItemCount(order);
                            const mainName = getRepProductName(order);

                            return (
                                <article
                                    key={order.order_id}
                                    className="delivery-order-card"
                                >
                                    {/* 상단: 상태 + 자세히 링크 */}
                                    <div className="delivery-order-header">
                                        <span className="delivery-order-status-label">
                                            {statusText}
                                        </span>
                                        <button
                                            type="button"
                                            className="delivery-order-detail-link"
                                            onClick={() =>
                                                navigate(`/mypage/orders/${order.order_id}`)
                                            }
                                        >
                                            자세히 &gt;
                                        </button>
                                    </div>

                                    {/* 하단: 좌측 텍스트 / 우측 버튼들 */}
                                    <div className="delivery-order-body">
                                        <div className="delivery-order-left">
                                            <div className="delivery-order-date">
                                                {formatDate(order.created_at)} 주문
                                            </div>

                                            <div className="delivery-order-title">
                                                {mainName}
                                            </div>

                                            {totalCount > 1 && (
                                                <div className="delivery-order-sub">
                                                    외 {totalCount - 1}개 상품 ( 총 {totalCount}개 )
                                                </div>
                                            )}

                                            <div className="delivery-order-price">
                                                {formatPrice(
                                                    order.total_price || order.payment_amount
                                                )}
                                                원
                                            </div>

                                            <div className="delivery-order-id">
                                                주문번호 {order.order_id}
                                            </div>
                                        </div>

                                        <div className="delivery-order-right">
                                            <button
                                                type="button"
                                                className="delivery-order-action-btn"
                                                onClick={() =>
                                                    navigate(`/orders/${order.order_id}#shipping`)
                                                }
                                            >
                                                배송 조회
                                            </button>
                                            <button
                                                type="button"
                                                className="delivery-order-action-btn"
                                                onClick={() =>
                                                    navigate(`/orders/${order.order_id}#receipt`)
                                                }
                                            >
                                                영수증 조회
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </UserMyPageLayout>
    );
}