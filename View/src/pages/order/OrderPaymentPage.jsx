// src/pages/order/OrderPaymentPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderPaymentPage.css";
import OrderCardPaymentSection from "./OrderCardPaymentSection";
import OrderAddressSelectPanel from "./OrderAddressSelectPanel";

// 기존 MOCK_DEFAULT_ADDRESS, MOCK_SAVED_CARDS 전부 삭제

export default function OrderPaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // 장바구니에서 넘어온 선택 상품들 (cartDummy 스키마)
    const cartItems = location.state?.items || [];

    const [items] = useState(cartItems);
    // 배송지: 기본 배송지를 API에서 조회
    const [address, setAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(true);
    const [addressError, setAddressError] = useState("");

    // 결제수단(카드) 목록 상태 추가
    const [cards, setCards] = useState([]);
    const [cardsLoading, setCardsLoading] = useState(true);
    const [cardsError, setCardsError] = useState("");
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);

    const [availablePoint, setAvailablePoint] = useState(0);
    const [usePoint, setUsePoint] = useState(0);
    const [pointLoading, setPointLoading] = useState(true);
    const [pointError, setPointError] = useState("");
    // ======================
    //  포인트 조회
    // ======================
    const fetchPoints = async () => {
        try {
            setPointLoading(true);
            setPointError("");

            const res = await axios.get("/api/users/me/points", {
                withCredentials: true,
            });

            // 컨트롤러에서 Integer 하나만 리턴하므로 그대로 사용
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
    const [showAddressPanel, setShowAddressPanel] = useState(false); // 패널 토글
    const [cardValid, setCardValid] = useState(false);

    // ======================
    //  기본 배송지 조회
    // ======================
    const fetchDefaultAddress = async () => {
        try {
            setAddressLoading(true);
            setAddressError("");

            const res = await axios.get("/api/addresses", {
                withCredentials: true,
            });

            const data = Array.isArray(res.data)
                ? res.data
                : res.data?.addresses || [];

            // 백엔드 응답을 결제 페이지에서 사용하는 키로 변환
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

            const defaultAddr =
                normalized.find((a) => a.is_default) || normalized[0] || null;

            setAddress(defaultAddr);
        } catch (e) {
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

            const res = await axios.get("/api/users/me/payments", {
                withCredentials: true,
            });

            const data = Array.isArray(res.data)
                ? res.data
                : res.data?.payments || [];

            setCards(data);

            if (data.length > 0) {
                setSelectedPaymentId(data[0].payment_id); // 첫 번째 카드 기본 선택
                setCardValid(true);
            } else {
                setSelectedPaymentId(null);
                setCardValid(false);
            }
        } catch (e) {
            setCardsError("결제수단을 불러오는 중 오류가 발생했습니다.");
            setCardValid(false);
        } finally {
            setCardsLoading(false);
        }
    };

    useEffect(() => {
        fetchDefaultAddress();
        fetchCards(); // 카드도 같이 로딩
        fetchPoints(); // 사용자 보유 포인트 조회
    }, []);

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
        // 배송비까지 포함해서 포인트를 사용할 수 있도록 최대 사용 가능 금액 계산
        const maxByPayable = productsAmount - discountAmount + shippingFee;
        return Math.max(
            0,
            Math.min(usePoint || 0, availablePoint, maxByPayable)
        );
    }, [usePoint, availablePoint, productsAmount, discountAmount, shippingFee]);

    const totalPayAmount =
        productsAmount - discountAmount + shippingFee - safeUsePoint;

    const handlePointChange = (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw === "") {
            setUsePoint(0);
            return;
        }

        const inputVal = Number(raw);
        // 상품 금액 + 배송비 기준 최대 사용 가능 포인트
        const maxByPayable = productsAmount - discountAmount + shippingFee;
        const maxUsable = Math.max(
            0,
            Math.min(inputVal, availablePoint, maxByPayable)
        );

        setUsePoint(maxUsable);
    };

    const handleUseAllPoint = () => {
        // 상품 금액 + 배송비 전체를 포인트로 결제할 수 있게 상한 설정
        const maxByPayable = productsAmount - discountAmount + shippingFee;
        const max = Math.min(availablePoint, maxByPayable);
        setUsePoint(max);
    };

    // ===== 결제수단(카드) 관련 핸들러 =====
    const handleChangeSelectedCard = (paymentId) => {
        setSelectedPaymentId(paymentId);
        setCardValid(!!paymentId);
    };

    const handleCreateCard = async (payload) => {
        try {
            await axios.post("/api/users/me/payments", payload, {
                withCredentials: true,
            });
            await fetchCards();
            alert("결제수단이 추가되었습니다.");
        } catch (e) {
            alert("결제수단 추가 중 오류가 발생했습니다.");
        }
    };


    const handleDeleteCard = async (paymentId) => {
        if (!window.confirm("해당 결제수단을 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`/api/users/me/payments/${paymentId}`, {
                withCredentials: true,
            });
            await fetchCards();
            alert("결제수단이 삭제되었습니다.");
        } catch (e) {
            alert("결제수단 삭제 중 오류가 발생했습니다.");
        }
    };

    // 기존: 주소 페이지로 이동 → 이제는 패널 토글
    const handleClickChangeAddress = () => {
        setShowAddressPanel((prev) => !prev);
    };

    const handleSubmitOrder = async () => {
        if (items.length === 0) {
            alert("주문할 상품이 없습니다. 장바구니에서 다시 시도해 주세요.");
            navigate("/mypage/cart");
            return;
        }

        // 선택된 카드 검증
        if (!cardValid || !selectedPaymentId) {
            alert("결제할 카드를 선택하거나 카드 정보를 정확히 입력해 주세요.");
            return;
        }

        if (!address) {
            alert("배송지를 선택해 주세요.");
            return;
        }

        // OrderCreateDTO.order_list 에 들어갈 OrderDTO 리스트 생성
        // 백엔드 OrderDTO : product_id, buy_quantity
        // cart 아이템에 product_id 가 없고 prd_id 로만 있다면 prd_id 를 사용
        const orderListPayload = items.map((item) => ({
            product_id: item.product_id || item.prd_id,
            buy_quantity: item.quantity,
        }));

        const orderPayload = {
            order_list: orderListPayload,
            using_point: safeUsePoint,
            address_id: address.address_id,
            payment_id: selectedPaymentId,
            total_price: totalPayAmount,
            // user_id 는 OrderController 에서 Security_Util 로 세팅하므로 여기서 넣지 않음
        };

        try {
            // 1) 주문 생성
            await axios.post("/api/orders", orderPayload, {
                withCredentials: true,
            });

            // 2) 방금 생성된 주문을 포함한 최신 주문 목록 1건 재조회
            //    백엔드 /api/orders 가 최신순으로 리턴한다고 가정
            let latestOrderId = null;
            let latestOrderNo = null;
            try {
                const latestRes = await axios.get("/api/orders", {
                    params: {
                        page: 1,
                        size: 1,
                    },
                    withCredentials: true,
                });

                const latestList = Array.isArray(latestRes.data)
                    ? latestRes.data
                    : [];

                if (latestList.length > 0) {
                    latestOrderId = latestList[0].order_id ?? null;
                    latestOrderNo = latestList[0].order_no ?? null;
                }
            } catch (e) {
                console.warn("최신 주문 조회 중 오류 (order_id 없이 진행):", e);
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
                state: {
                    orderSummary,
                    items,
                },
            });
        } catch (e) {
            console.error(e);
            alert("주문 처리 중 오류가 발생했습니다.");
        }
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
                            {addressLoading ? (
                                <p>배송지 정보를 불러오는 중입니다...</p>
                            ) : addressError ? (
                                <p className="order-address-error">{addressError}</p>
                            ) : !address ? (
                                <p>등록된 배송지가 없습니다. 마이페이지에서 배송지를 추가해 주세요.</p>
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

                    {/* 배송지 변경 패널: 배송지 카드 바로 아래에 표시 */}
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

                    {/* API 기반 카드 섹션 사용 */}
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
                                    {shippingFee === 0
                                        ? "무료"
                                        : `${formatPrice(shippingFee)}원`}
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