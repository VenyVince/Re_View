// src/pages/mypage/user/UserDeliveryPage.jsx
import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
import axiosClient from "../../../../api/axiosClient";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserDeliveryPage.css";
import { useNavigate } from "react-router-dom";

export default function UserDeliveryPage() {
    const navigate = useNavigate();

    // 기본 배송지 상태
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [addrLoading, setAddrLoading] = useState(true);
    const [addrError, setAddrError] = useState("");

    // 주문 목록 상태
    const [orders, setOrders] = useState([]);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState("");
    const [trackingOrder, setTrackingOrder] = useState(null);

    // 주문 내역 날짜 필터 (기본: 최근 1개월)
    const [filterStart, setFilterStart] = useState("");
    const [filterEnd, setFilterEnd] = useState("");

    // 영수증 팝업 상태
    const [receiptOrderId, setReceiptOrderId] = useState(null);
    const [receiptDetail, setReceiptDetail] = useState(null);
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [receiptError, setReceiptError] = useState("");

    // 주문 목록은 백엔드에서 전체 내역을 최신순으로 내려줌

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

    // 카드 번호 마스킹
    const maskCardNumber = (cardNumber) => {
        if (!cardNumber) return "";
        const digits = String(cardNumber).replace(/\s+/g, "");
        if (digits.length <= 4) return digits;
        return "****-****-****-" + digits.slice(-4);
    };

    // 기본 배송지 불러오기
    const fetchDefaultAddress = async () => {
        try {
            setAddrLoading(true);
            setAddrError("");

            const res = await axiosClient.get("/api/addresses");

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
            setAddrError("기본 배송지 정보를 불러오는 중 오류가 발생했어요.");
        } finally {
            setAddrLoading(false);
        }
    };

    // 주문 리스트 불러오기
    const fetchOrders = async () => {
        try {
            setOrderLoading(true);
            setOrderError("");

            const res = await axiosClient.get("/api/orders", {
                params: { page: 0, size: 1000 },
            });

            const data = res.data;

            // 1) List<OrderListResponseDTO> 그대로 오는 경우
            if (Array.isArray(data)) {
                setOrders(data);
                return;
            }

            if (Array.isArray(data?.orderList)) {
                setOrders(data.orderList);
                return;
            }
            if (Array.isArray(data?.data)) {
                setOrders(data.data);
                return;
            }

            // 알 수 없는 구조면 빈 배열
            setOrders([]);
        } catch (e) {
            console.error("주문 내역 조회 오류:", e);
            setOrderError("주문 내역을 불러오는 중 오류가 발생했어요.");
        } finally {
            setOrderLoading(false);
        }
    };

    useEffect(() => {
        fetchDefaultAddress();
        fetchOrders();
    }, []);

    // 날짜 필터링이 반영된 주문 목록
    // - filterStart 또는 filterEnd 가 설정되어 있으면: 해당 범위(종료일 포함)에 해당하는 주문만
    // - 둘 다 비어 있으면: 전체 주문 내역 표시
    const filteredOrders = useMemo(() => {
        if (!orders || orders.length === 0) return [];

        const list = [...orders];

        // 날짜 필터가 하나라도 설정된 경우: 사용자가 지정한 기간 우선
        if (filterStart || filterEnd) {
            let start = filterStart ? new Date(filterStart) : null;
            let end = filterEnd ? new Date(filterEnd) : null;

            if (start) {
                // 시작일 00:00:00
                start.setHours(0, 0, 0, 0);
            }
            if (end) {
                // 종료일은 선택한 날짜의 끝까지 포함되도록 다음날 00:00:00 기준으로 비교
                end.setHours(0, 0, 0, 0);
                end.setDate(end.getDate() + 1);
            }

            return list.filter((o) => {
                if (!o.created_at) return true;

                const created = new Date(o.created_at);
                if (Number.isNaN(created.getTime())) return true;

                if (start && created < start) return false;
                if (end && created >= end) return false;

                return true;
            });
        }

        // 날짜 필터가 없으면: 전체 주문 내역 표시
        return list;
    }, [orders, filterStart, filterEnd]);

    // 상태별 전체 카운트는 전체 orders 기준 (필터와 무관)
    const completedCount = orders.filter(
        (o) => getOrderStatusText(o) === "주문완료"
    ).length;
    const shippingCount = orders.filter(
        (o) => getOrderStatusText(o) === "배송중"
    ).length;
    const deliveredCount = orders.filter(
        (o) => getOrderStatusText(o) === "배송완료"
    ).length;

    // 화면에 보여줄 목록은 필터링된 주문만 정렬
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        const orderRank = {
            "주문완료": 0,
            "배송중": 1,
            "배송완료": 2,
        };

        const aStatus = getOrderStatusText(a);
        const bStatus = getOrderStatusText(b);

        const aRank = orderRank[aStatus] ?? 999;
        const bRank = orderRank[bStatus] ?? 999;

        if (aRank !== bRank) return aRank - bRank;

        // 같은 상태일 때는 최신 주문이 위로 오도록 날짜 기준 정렬
        return (b.created_at || "").localeCompare(a.created_at || "");
    });

    const openTrackingModal = (order) => {
        setTrackingOrder(order);
    };

    const closeTrackingModal = () => {
        setTrackingOrder(null);
    };

    // 영수증 모달 열기
    const openReceiptModal = async (orderId) => {
        try {
            setReceiptOrderId(orderId);
            setReceiptDetail(null);
            setReceiptError("");
            setReceiptLoading(true);

            const res = await axiosClient.get(`/api/orders/${orderId}`);
            setReceiptDetail(res.data);
        } catch (e) {
            setReceiptError("영수증 정보를 불러오는 중 오류가 발생했어요.");
        } finally {
            setReceiptLoading(false);
        }
    };

    const closeReceiptModal = () => {
        setReceiptOrderId(null);
        setReceiptDetail(null);
        setReceiptError("");
        setReceiptLoading(false);
    };

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

                {/* 날짜 필터 (1개월보다 이전 내역 조회용) */}
                <div className="delivery-order-datefilter">
                    <div className="delivery-order-datefilter-text">
                        *전체 주문 내역이 기본으로 표시됩니다.
                    </div>
                    <div className="delivery-order-datefilter-controls">
                        <span className="delivery-order-datefilter-label">조회 기간</span>
                        <input
                            type="date"
                            value={filterStart}
                            onChange={(e) => setFilterStart(e.target.value)}
                        />
                        <span> ~ </span>
                        <input
                            type="date"
                            value={filterEnd}
                            onChange={(e) => setFilterEnd(e.target.value)}
                        />
                    </div>
                </div>

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
                {!orderLoading &&
                    !orderError &&
                    orders.length > 0 &&
                    sortedOrders.length === 0 && (
                        <p className="delivery-order-message">
                            선택한 기간에 해당하는 주문 내역이 없습니다.
                        </p>
                    )}

                {sortedOrders.length > 0 && (
                    <div className="delivery-order-list">
                        {sortedOrders.map((order) => {
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
                                            {statusText === "배송완료" ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="delivery-order-action-btn delivery-order-review-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/review/write?orderId=${order.order_id}&order_id=${order.order_id}`,
                                                                {
                                                                    //navigate state: { orderId: 123, order_id: 123 }
                                                                    state: { orderId: order.order_id, order_id: order.order_id },
                                                                }
                                                            )
                                                        }
                                                    >
                                                        리뷰 작성하기
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="delivery-order-action-btn"
                                                        onClick={() =>
                                                            openReceiptModal(order.order_id)
                                                        }
                                                    >
                                                        영수증 조회
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="delivery-order-action-btn"
                                                        onClick={() => openTrackingModal(order)}
                                                    >
                                                        배송 조회
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="delivery-order-action-btn"
                                                        onClick={() =>
                                                            openReceiptModal(order.order_id)
                                                        }
                                                    >
                                                        영수증 조회
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* 배송 조회 모달 */}
            {trackingOrder && (
                <div
                    className="delivery-modal-backdrop"
                    onClick={closeTrackingModal}
                >
                    <div
                        className="delivery-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="delivery-modal-title">배송 조회</h4>

                        <div className="delivery-modal-row">
                            <span className="label">주문번호</span>
                            <span className="value">{trackingOrder.order_id}</span>
                        </div>
                        <div className="delivery-modal-row">
                            <span className="label">배송 상태</span>
                            <span className="value">
                                {getOrderStatusText(trackingOrder)}
                            </span>
                        </div>
                        <div className="delivery-modal-row">
                            <span className="label">운송장 번호</span>
                            <span className="value">
                                {trackingOrder.delivery_num ||
                                    "등록된 운송장 번호가 없습니다."}
                            </span>
                        </div>

                        <p className="delivery-modal-help">
                            택배사 시스템과 연동 전입니다. 운송장 번호를 통해 택배사
                            사이트에서 상세 배송 정보를 확인할 수 있습니다.
                        </p>

                        <div className="delivery-modal-actions">
                            <button
                                type="button"
                                className="delivery-modal-close-btn"
                                onClick={closeTrackingModal}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 영수증 모달 */}
            {receiptOrderId && (
                <div
                    className="delivery-modal-backdrop"
                    onClick={closeReceiptModal}
                >
                    <div
                        className="delivery-modal delivery-modal-receipt"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="delivery-modal-title">영수증 조회</h4>

                        {receiptLoading && !receiptDetail && (
                            <p className="delivery-modal-help">
                                영수증 정보를 불러오는 중입니다...
                            </p>
                        )}

                        {receiptError && (
                            <p className="delivery-modal-help delivery-modal-help-error">
                                {receiptError}
                            </p>
                        )}

                        {receiptDetail && (
                            <>
                                <div className="delivery-modal-row">
                                    <span className="label">주문번호</span>
                                    <span className="value">
                                        {receiptDetail.order_id}
                                    </span>
                                </div>
                                <div className="delivery-modal-row">
                                    <span className="label">주문일자</span>
                                    <span className="value">
                                        {formatDate(receiptDetail.created_at)}
                                    </span>
                                </div>
                                <div className="delivery-modal-row">
                                    <span className="label">결제수단</span>
                                    <span className="value">
                                        {receiptDetail.card_company}{" "}
                                        {maskCardNumber(receiptDetail.card_number)}
                                    </span>
                                </div>
                                <div className="delivery-modal-row">
                                    <span className="label">총 결제금액</span>
                                    <span className="value">
                                        {formatPrice(receiptDetail.total_price)}원
                                    </span>
                                </div>

                                <div className="delivery-receipt-divider" />

                                <div className="delivery-receipt-items">
                                    <div className="delivery-receipt-items-header">
                                        상품 정보
                                    </div>
                                    {Array.isArray(receiptDetail.order_items) &&
                                        receiptDetail.order_items.map((item) => (
                                            <div
                                                key={item.order_item_id}
                                                className="delivery-receipt-item"
                                            >
                                                <div className="delivery-receipt-item-main">
                                                    <div className="delivery-receipt-item-name">
                                                        {item.product_name}
                                                    </div>
                                                    <div className="delivery-receipt-item-meta">
                                                        수량 {item.quantity}개
                                                    </div>
                                                </div>
                                                <div className="delivery-receipt-item-price">
                                                    {formatPrice(item.total_amount)}원
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </>
                        )}

                        <div className="delivery-modal-actions">
                            <button
                                type="button"
                                className="delivery-modal-close-btn"
                                onClick={closeReceiptModal}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserMyPageLayout>
    );
}