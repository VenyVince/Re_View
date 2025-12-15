// src/pages/mypage/user/UserDeliveryPage.jsx
import React, { useEffect, useState, useMemo } from "react";
// import axiosClient from "api/axiosClient";
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

    // 주문 내역 날짜 필터 (기본: 전체 내역)
    const [filterStart, setFilterStart] = useState("");
    const [filterEnd, setFilterEnd] = useState("");

    // "더보기" 로 노출할 (배송완료 + 리뷰작성완료) 주문 개수
    const [extraShown, setExtraShown] = useState(0);

    // 영수증 팝업 상태
    const [receiptOrderId, setReceiptOrderId] = useState(null);
    const [receiptDetail, setReceiptDetail] = useState(null);
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [receiptError, setReceiptError] = useState("");

    // 리뷰 작성 모달(주문 내 order_item 선택)
    const [reviewSelectOpen, setReviewSelectOpen] = useState(false);
    const [reviewSelectOrderId, setReviewSelectOrderId] = useState(null);
    const [reviewSelectItems, setReviewSelectItems] = useState([]);
    const [reviewSelectLoading, setReviewSelectLoading] = useState(false);
    const [reviewSelectError, setReviewSelectError] = useState("");

    // 페이지네이션 (백엔드 page/size와 맞춰둠) – 지금은 요청용으로만 사용
    const PAGE_SIZE = 10;

    const formatPrice = (value) =>
        value?.toLocaleString("ko-KR", { maximumFractionDigits: 0 }) ?? "0";

    const formatDate = (iso) => {
        if (!iso) return "";
        const date = new Date(iso);
        date.setHours(date.getHours() + 9);
        return date.toISOString().slice(0, 10);
    };

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

    // 주문 상세에서 리뷰 작성 가능 여부 및 가능한 order_item_id 목록 조회
    const fetchReviewWritableInfoForOrder = async (orderId) => {
        try {
            const res = await axiosClient.get(`/api/orders/${orderId}`);
            const orderDetail = res.data || {};
            const items = Array.isArray(orderDetail.order_items) ? orderDetail.order_items : [];

            const checkResults = await Promise.all(
                items.map(async (item) => {
                    try {
                        const resp = await axiosClient.get("/api/reviews/exists/create", {
                            params: { order_item_id: item.order_item_id },
                        });
                        return {
                            order_item_id: item.order_item_id,
                            canCreate:
                                resp.data && typeof resp.data.canCreate === "boolean"
                                    ? resp.data.canCreate
                                    : false,
                        };
                    } catch {
                        return { order_item_id: item.order_item_id, canCreate: false };
                    }
                })
            );

            const writableOrderItemIds = checkResults
                .filter((r) => r.canCreate)
                .map((r) => r.order_item_id);

            return {
                canCreateAny: writableOrderItemIds.length > 0,
                writableOrderItemIds,
            };
        } catch {
            return { canCreateAny: false, writableOrderItemIds: [] };
        }
    };

    // 리뷰 작성 모달 열기: 해당 주문의 리뷰 작성 가능한 order_item 목록을 불러온다.
    const openReviewSelectModal = async (orderId) => {
        try {
            setReviewSelectOpen(true);
            setReviewSelectOrderId(orderId);
            setReviewSelectItems([]);
            setReviewSelectError("");
            setReviewSelectLoading(true);

            // 주문 상세에서 order_items를 가져오고, 각 item별 리뷰 작성 가능 여부를 확인
            const detailRes = await axiosClient.get(`/api/orders/${orderId}`);
            const orderDetail = detailRes.data || {};
            const items = Array.isArray(orderDetail.order_items) ? orderDetail.order_items : [];

            const withCanCreate = await Promise.all(
                items.map(async (item) => {
                    try {
                        const resp = await axiosClient.get("/api/reviews/exists/create", {
                            params: { order_item_id: item.order_item_id },
                        });
                        const canCreate =
                            resp.data && typeof resp.data.canCreate === "boolean"
                                ? resp.data.canCreate
                                : false;
                        return { ...item, canCreate };
                    } catch {
                        return { ...item, canCreate: false };
                    }
                })
            );

            const writable = withCanCreate.filter((i) => i.canCreate === true);
            setReviewSelectItems(writable);
        } catch (e) {
            setReviewSelectError("리뷰 작성 가능한 상품 목록을 불러오지 못했습니다.");
        } finally {
            setReviewSelectLoading(false);
        }
    };

    const closeReviewSelectModal = () => {
        setReviewSelectOpen(false);
        setReviewSelectOrderId(null);
        setReviewSelectItems([]);
        setReviewSelectError("");
        setReviewSelectLoading(false);
    };

    // 주문 리스트 불러오기
    const fetchOrders = async (pageNo = 1) => {
        try {
            setOrderLoading(true);
            setOrderError("");

            const res = await axiosClient.get("/api/orders", {
                // params: {
                //     page: pageNo,
                //     size: PAGE_SIZE,
                // },
            });

            // 컨트롤러가 List<OrderListResponseDTO> 를 바로 리턴
            const list = Array.isArray(res.data) ? res.data : [];
            // 주문별로 리뷰 작성 가능 정보 추가
            const enriched = await Promise.all(
                list.map(async (o) => {
                    const info = await fetchReviewWritableInfoForOrder(o.order_id);
                    return {
                        ...o,
                        review_can_create_any: info.canCreateAny,
                        review_writable_order_item_ids: info.writableOrderItemIds,
                    };
                })
            );
            setOrders(enriched);
        } catch (e) {
            setOrderError("주문 내역을 불러오는 중 오류가 발생했어요.");
        } finally {
            setOrderLoading(false);
        }
    };

    useEffect(() => {
        fetchDefaultAddress();
        fetchOrders(1);
    }, []);

    // 날짜 필터링이 반영된 주문 목록
    // - filterStart 또는 filterEnd 가 설정되어 있으면: 해당 범위(종료일 포함)에 해당하는 주문만
    // - 둘 다 비어 있으면: 전체 주문 내역만
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

        // 날짜 필터가 없으면: 전체 주문 내역을 그대로 표시
        return list;
    }, [orders, filterStart, filterEnd]);

    // 필터가 바뀌면 더보기 초기화
    useEffect(() => {
        setExtraShown(0);
    }, [filterStart, filterEnd]);

    // 상태별 전체 카운트는 전체 orders 기준 (필터와 무관)
    const completedCount = orders.filter(
        (o) => getOrderStatusText(o) === "주문완료"
    ).length;
    const shippingCount = orders.filter(
        (o) => getOrderStatusText(o) === "배송중"
    ).length;
    // 배송완료 카운트는 "리뷰 미작성(작성 가능)" 만 포함
    const deliveredCount = orders.filter(
        (o) => getOrderStatusText(o) === "배송완료" && o.review_can_create_any === true
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

    // 날짜 필터 활성 여부
    const isDateFilterActive = Boolean(filterStart || filterEnd);

    // 기본 노출: 주문완료 / 배송중 / 배송완료(리뷰 미작성)
    const baseOrders = sortedOrders.filter((o) => {
        const status = getOrderStatusText(o);
        if (status === "배송완료") {
            return o.review_can_create_any === true; // 리뷰 미작성(작성 가능)만
        }
        return status === "주문완료" || status === "배송중";
    });

    // 더보기 대상: 배송완료(리뷰 작성 완료)
    const extraOrders = sortedOrders.filter((o) => {
        const status = getOrderStatusText(o);
        return status === "배송완료" && o.review_can_create_any !== true;
    });

    // 날짜 필터가 켜져있으면: 조건(배송완료/리뷰작성여부)과 무관하게 해당 기간 주문을 전부 보여준다.
    // 날짜 필터가 없으면: 기본 노출 + (배송완료/리뷰작성완료는 더보기로 10개씩)
    const visibleOrders = isDateFilterActive
        ? sortedOrders
        : [...baseOrders, ...extraOrders.slice(0, extraShown)];

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
                        *기본 화면에서는 주문완료/배송중/배송완료(리뷰 미작성)만 표시됩니다.
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
                    visibleOrders.length === 0 && (
                        <p className="delivery-order-message">
                            선택한 기간에 해당하는 주문 내역이 없습니다.
                        </p>
                    )}

                {visibleOrders.length > 0 && (
                    <div className="delivery-order-list">
                        {visibleOrders.map((order) => {
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
                                                    {order.review_can_create_any === true ? (
                                                        <button
                                                            type="button"
                                                            className="delivery-order-action-btn delivery-order-review-btn"
                                                            onClick={() => openReviewSelectModal(order.order_id)}
                                                        >
                                                            리뷰 작성하기
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="delivery-order-action-btn delivery-order-review-btn"
                                                            disabled
                                                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                                        >
                                                            리뷰 작성 완료
                                                        </button>
                                                    )}
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

                {/* 더보기: 배송완료(리뷰 작성 완료) 주문을 10개씩 추가 노출 */}
                {!isDateFilterActive && !orderLoading && !orderError && extraOrders.length > extraShown && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                        <button
                            type="button"
                            className="delivery-order-action-btn"
                            onClick={() => setExtraShown((prev) => prev + 10)}
                        >
                            더보기
                        </button>
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
            {/* 리뷰 작성 선택 모달 (주문 내 작성 가능한 상품 목록) */}
            {reviewSelectOpen && (
                <div className="delivery-modal-backdrop" onClick={closeReviewSelectModal}>
                    <div className="delivery-modal" onClick={(e) => e.stopPropagation()}>
                        <h4 className="delivery-modal-title">리뷰 작성할 상품 선택</h4>

                        {reviewSelectLoading && (
                            <p className="delivery-modal-help">목록을 불러오는 중입니다...</p>
                        )}

                        {reviewSelectError && (
                            <p className="delivery-modal-help delivery-modal-help-error">{reviewSelectError}</p>
                        )}

                        {!reviewSelectLoading && !reviewSelectError && reviewSelectItems.length === 0 && (
                            <p className="delivery-modal-help">이 주문에서 리뷰 작성 가능한 상품이 없습니다.</p>
                        )}

                        {!reviewSelectLoading && !reviewSelectError && reviewSelectItems.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                                {reviewSelectItems.map((item) => (
                                    <div
                                        key={item.order_item_id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 12,
                                            padding: "12px 14px",
                                            border: "1px solid #eee",
                                            borderRadius: 12,
                                            background: "#fff",
                                        }}
                                    >
                                        <div
                                            style={{
                                                flex: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                textAlign: "center",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontWeight: 700,
                                                    width: "100%",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {item.product_name || item.prd_name || "상품"}
                                            </div>
                                            <div style={{ fontSize: 13, color: "#777" }}>
                                                주문상품번호 {item.order_item_id}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="delivery-order-action-btn"
                                            onClick={() => {
                                                closeReviewSelectModal();
                                                navigate(`/review/write/${item.product_id}`, {
                                                    // state: {
                                                    //     orderItemId: item.order_item_id,
                                                    //     orderId: reviewSelectOrderId,
                                                    // },
                                                });
                                            }}
                                        >
                                            리뷰 작성
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="delivery-modal-actions" style={{ marginTop: 16 }}>
                            <button type="button" className="delivery-modal-close-btn" onClick={closeReviewSelectModal}>
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserMyPageLayout>
    );
}