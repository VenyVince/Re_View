// src/pages/order/OrderPaymentPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderPaymentPage.css";
import OrderCardPaymentSection from "./OrderCardPaymentSection";
import OrderAddressSelectPanel from "./OrderAddressSelectPanel";
import axiosClient from "api/axiosClient";

export default function OrderPaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. 이전 페이지(장바구니/상세)에서 넘겨준 ID와 수량 정보
    // 예: [{ product_id: 1, buy_quantity: 2 }, ...]
    const checkoutItems = location.state?.checkoutItems || [];

    // items: 화면에 보여줄 상세 상품 정보 (API로 받아옴)
    const [items, setItems] = useState([]);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");

    // 배송지: 기본 배송지를 API에서 조회
    const [address, setAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(true);
    const [addressError, setAddressError] = useState("");

    // 결제수단(카드) 목록 상태
    const [cards, setCards] = useState([]);
    const [cardsLoading, setCardsLoading] = useState(true);
    const [cardsError, setCardsError] = useState("");
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);

    // 포인트 관련 상태
    const [availablePoint, setAvailablePoint] = useState(0);
    const [usePoint, setUsePoint] = useState(0);
    const [pointLoading, setPointLoading] = useState(true);
    const [pointError, setPointError] = useState("");

    const [showAddressPanel, setShowAddressPanel] = useState(false);
    const [cardValid, setCardValid] = useState(false);

    // ======================
    //  1. 체크아웃 데이터 조회 (핵심 변경 사항)
    // ======================
    const fetchCheckoutData = async () => {
        // 넘겨받은 데이터가 없으면 중단
        if (checkoutItems.length === 0) return;

        try {
            setCheckoutLoading(true);
            setCheckoutError("");

            console.log("체크아웃 API 요청 Payload:", checkoutItems);

            // POST /api/orders/checkout
            const res = await axiosClient.post("/api/orders/checkout", checkoutItems);

            console.log("체크아웃 API 응답:", res.data);

            const fetchedProducts = res.data.products || [];

            // API 응답을 화면 UI에 맞는 구조로 변환
            const normalizedItems = fetchedProducts.map((p) => ({
                cart_items_id: `checkout_${p.product_id}`, // 고유 키 생성
                product_id: p.product_id,
                prd_id: p.product_id,
                prd_name: p.prd_name,
                prd_brand: p.prd_brand || "", // 브랜드가 없다면 빈 문자열
                price: p.price,
                quantity: p.buy_quantity, // 응답의 buy_quantity를 UI의 quantity로 매핑

                // 썸네일 URL 매핑 (절대 경로로 옴)
                product_thumbnail_url: p.thumbnail_url,
                image_url: p.thumbnail_url,
            }));

            setItems(normalizedItems);

        } catch (e) {
            console.error("체크아웃 정보 조회 실패:", e);
            setCheckoutError("상품 정보를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setCheckoutLoading(false);
        }
    };

    // ======================
    //  포인트 조회
    // ======================
    const fetchPoints = async () => {
        try {
            setPointLoading(true);
            setPointError("");
            const res = await axiosClient.get("/api/users/me/points");
            const totalPoint = typeof res.data === "number" ? res.data : Number(res.data) || 0;
            setAvailablePoint(totalPoint);
        } catch (e) {
            console.error(e);
            setPointError("포인트를 불러오는 중 오류가 발생했습니다.");
            setAvailablePoint(0);
        } finally {
            setPointLoading(false);
        }
    };

    // ======================
    //  기본 배송지 조회
    // ======================
    const fetchDefaultAddress = async () => {
        try {
            setAddressLoading(true);
            setAddressError("");
            const res = await axiosClient.get("/api/addresses");
            const data = Array.isArray(res.data) ? res.data : res.data?.addresses || [];

            const normalized = data.map((a) => ({
                address_id: a.address_id,
                address_name: a.address_name,
                recipient: a.recipient_name,
                phone: a.phone_number,
                postal_code: a.postal_code,
                address: a.address,
                detail_address: a.detail_address,
                is_default: a.is_default === "1",
            }));

            const defaultAddr = normalized.find((a) => a.is_default) || normalized[0] || null;
            setAddress(defaultAddr);
        } catch (e) {
            console.error(e);
            setAddressError("배송지 정보를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setAddressLoading(false);
        }
    };

    // ======================
    //  결제수단(카드) 목록 조회
    // ======================
    const fetchCards = async () => {
        try {
            setCardsLoading(true);
            setCardsError("");
            const res = await axiosClient.get("/api/users/me/payments");
            const data = Array.isArray(res.data) ? res.data : res.data?.payments || [];
            setCards(data);

            if (data.length > 0) {
                setSelectedPaymentId(data[0].payment_id);
                setCardValid(true);
            } else {
                setSelectedPaymentId(null);
                setCardValid(false);
            }
        } catch (e) {
            console.error(e);
            setCardsError("결제수단을 불러오는 중 오류가 발생했습니다.");
            setCardValid(false);
        } finally {
            setCardsLoading(false);
        }
    };

    // 초기 데이터 로딩
    useEffect(() => {
        // checkoutItems가 있을 때만 API 호출
        if (checkoutItems.length > 0) {
            fetchCheckoutData();
        }

        fetchDefaultAddress();
        fetchCards();
        fetchPoints();
    }, []); // 빈 배열: 마운트 시 1회 실행

    const formatPrice = (v) => v.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

    const getThumbnailUrl = (item) => {
        if (!item) return null;

        // 1순위: 백엔드에서 받은 완성된 썸네일 URL (fetchCheckoutData에서 매핑함)
        if (item.product_thumbnail_url) {
            return item.product_thumbnail_url;
        }
        return null;
    };

    // 상품 금액 합계 (API response의 total_price를 써도 되지만, 포인트 차감 로직 연동을 위해 재계산 권장)
    const productsAmount = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    const discountAmount = 0;
    const shippingFee = 3000;

    const safeUsePoint = useMemo(() => {
        const maxByPayable = productsAmount - discountAmount + shippingFee;
        return Math.max(0, Math.min(usePoint || 0, availablePoint, maxByPayable));
    }, [usePoint, availablePoint, productsAmount, discountAmount, shippingFee]);

    const totalPayAmount = productsAmount - discountAmount + shippingFee - safeUsePoint;

    const handlePointChange = (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw === "") {
            setUsePoint(0);
            return;
        }
        const inputVal = Number(raw);
        const maxByPayable = productsAmount - discountAmount + shippingFee;
        const maxUsable = Math.max(0, Math.min(inputVal, availablePoint, maxByPayable));
        setUsePoint(maxUsable);
    };

    const handleUseAllPoint = () => {
        const maxByPayable = productsAmount - discountAmount + shippingFee;
        const max = Math.min(availablePoint, maxByPayable);
        setUsePoint(max);
    };

    // ===== 결제수단 관련 핸들러 =====
    const handleChangeSelectedCard = (paymentId) => {
        setSelectedPaymentId(paymentId);
        setCardValid(!!paymentId);
    };

    const handleCreateCard = async (payload) => {
        try {
            await axiosClient.post("/api/users/me/payments", payload);
            await fetchCards();
            alert("결제수단이 추가되었습니다.");
        } catch (e) {
            console.error(e);
            alert("결제수단 추가 중 오류가 발생했습니다.");
        }
    };

    const handleDeleteCard = async (paymentId) => {
        if (!window.confirm("해당 결제수단을 삭제하시겠습니까?")) return;
        try {
            await axiosClient.delete(`/api/users/me/payments/${paymentId}`);
            await fetchCards();
            alert("결제수단이 삭제되었습니다.");
        } catch (e) {
            console.error(e);
            alert("결제수단 삭제 중 오류가 발생했습니다.");
        }
    };

    const handleClickChangeAddress = () => {
        setShowAddressPanel((prev) => !prev);
    };

    const handleSubmitOrder = async () => {
        if (items.length === 0) {
            alert("주문할 상품 정보가 없습니다.");
            return;
        }

        if (!cardValid || !selectedPaymentId) {
            alert("결제할 카드를 선택하거나 카드 정보를 정확히 입력해 주세요.");
            return;
        }

        if (!address) {
            alert("배송지를 선택해 주세요.");
            return;
        }

        // 주문 요청 데이터 생성
        const orderListPayload = items.map((item) => ({
            product_id: item.product_id,
            buy_quantity: item.quantity,
        }));

        const orderPayload = {
            order_list: orderListPayload,
            using_point: safeUsePoint,
            address_id: address.address_id,
            payment_id: selectedPaymentId,
            total_price: totalPayAmount,
        };

        console.log("최종 전송 Payload:", orderPayload);

        try {
            await axiosClient.post("/api/orders", orderPayload);

            // 결제 완료 후: 장바구니에 같은 product_id가 있으면 삭제 처리
            try {
                const cartRes = await axiosClient.get("/api/cart");
                const cartItems = Array.isArray(cartRes.data) ? cartRes.data : [];

                const orderedProductIds = new Set(
                    (items || []).map((it) => it.product_id).filter((v) => v != null)
                );

                const toDelete = cartItems.filter((ci) => orderedProductIds.has(ci.product_id));

                if (toDelete.length > 0) {
                    await Promise.all(
                        toDelete.map((ci) =>
                            axiosClient.delete("/api/cart", {
                                data: { product_id: ci.product_id },
                            })
                        )
                    );
                }
            } catch (cartErr) {
                // 장바구니 삭제 실패가 주문 완료를 막으면 안 되므로 경고만 출력
                console.warn("[OrderPaymentPage] 결제 후 장바구니 정리 실패:", cartErr);
            }

            // 최신 주문 정보 확인 (Order ID 확보용)
            let latestOrderId = null;
            let latestOrderNo = null;
            try {
                const latestRes = await axiosClient.get("/api/orders", {
                    params: { page: 1, size: 1 },
                });
                const latestList = Array.isArray(latestRes.data) ? latestRes.data : [];
                if (latestList.length > 0) {
                    latestOrderId = latestList[0].order_id ?? null;
                    latestOrderNo = latestList[0].order_no ?? null;
                }
            } catch (e) {
                console.warn("최신 주문 조회 중 오류:", e);
            }

            const orderSummary = {
                amount: totalPayAmount,
                itemCount: items.length,
                firstItemName: items[0]?.prd_name,
                address,
                paymentId: selectedPaymentId,
                order_id: latestOrderId,
                order_no: latestOrderNo,
            };

            navigate("/order/complete", {
                state: { orderSummary, items },
            });
        } catch (e) {
            console.error(e);
            alert("주문 처리 중 오류가 발생했습니다.");
        }
    };

    // 로딩 화면
    if (checkoutLoading) {
        return (
            <div className="order-page">
                <div className="order-layout">
                    <div className="order-main">
                        <div className="order-card">
                            <p>주문 상품 정보를 불러오는 중입니다...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 에러 발생 시
    if (checkoutError) {
        return (
            <div className="order-page">
                <div className="order-layout">
                    <div className="order-main">
                        <div className="order-card">
                            <p>{checkoutError}</p>
                            <button className="order-submit-btn" onClick={() => navigate(-1)}>
                                뒤로가기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 장바구니/바로구매 데이터 없이 접근한 경우 방어
    if (!location.state || checkoutItems.length === 0) {
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
                            {items.map((item, index) => (
                                <div key={item.cart_items_id || index} className="order-item-row">
                                    <div className="order-item-thumb">
                                        {getThumbnailUrl(item) ? (
                                            <img
                                                src={getThumbnailUrl(item)}
                                                alt={item.prd_name || "상품 이미지"}
                                                className="order-item-thumb-img"
                                            />
                                        ) : (
                                            <div className="order-item-thumb-placeholder">
                                                이미지
                                            </div>
                                        )}
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
                            {addressLoading ? (
                                <p>배송지 정보를 불러오는 중입니다...</p>
                            ) : addressError ? (
                                <p className="order-address-error">{addressError}</p>
                            ) : !address ? (
                                <p>
                                    등록된 배송지가 없습니다. 마이페이지에서 배송지를 추가해 주세요.
                                </p>
                            ) : (
                                <>
                                    <div className="order-address-recipient">
                                        <span className="order-address-name">
                                            {address.address_name}
                                        </span>
                                        <span className="order-name">
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
                                </>
                            )}
                        </div>
                    </section>

                    {/* 배송지 변경 패널 */}
                    {showAddressPanel && (
                        <section className="order-card order-address-panel-wrapper">
                            <OrderAddressSelectPanel
                                currentAddress={address}
                                onChangeAddress={(next) => {
                                    setAddress(next);
                                    setShowAddressPanel(false);
                                }}
                                onClose={() => setShowAddressPanel(false)}
                            />
                        </section>
                    )}
                </div>

                {/* 오른쪽: 포인트 + 결제 요약 */}
                <aside className="order-sidebar">
                    <section className="order-card">
                        <h2 className="order-card-title">포인트 사용</h2>

                        {pointLoading ? (
                            <p className="order-point-help">포인트를 불러오는 중입니다...</p>
                        ) : pointError ? (
                            <p className="order-point-help">{pointError}</p>
                        ) : (
                            <>
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
                                    보유 포인트와 결제 금액 한도 내에서만 사용 가능합니다.
                                </p>
                            </>
                        )}
                    </section>

                    {/* API 기반 카드 섹션 */}
                    <OrderCardPaymentSection
                        amount={totalPayAmount}
                        cards={cards}
                        cardsLoading={cardsLoading}
                        cardsError={cardsError}
                        selectedPaymentId={selectedPaymentId}
                        onChangeSelected={handleChangeSelectedCard}
                        onCreateCard={handleCreateCard}
                        onDeleteCard={handleDeleteCard}
                    />

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
                                <span>배송비</span>
                                <span>
                                    {shippingFee === 0 ? "무료" : `${formatPrice(shippingFee)}원`}
                                </span>
                            </div>
                            <div className="order-summary-row">
                                <span>포인트 사용</span>
                                <span>- {formatPrice(safeUsePoint)}원</span>
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