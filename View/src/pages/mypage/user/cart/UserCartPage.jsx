// src/pages/mypage/user/cart/UserCartPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import "./UserCartPage.css";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import { useNavigate } from "react-router-dom";
import axiosClient from "api/axiosClient";

export default function UserCartPage() {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const formatPrice = (value) =>
        value.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

    const getThumbnailUrl = (item) => {
        if (!item) return null;

        // 1순위: 백엔드에서 완성된 썸네일 URL을 내려주는 경우
        if (item.product_thumbnail_url) {
            return item.product_thumbnail_url;
        }

        // 2순위: image_url 이 절대 URL이면 그대로 사용
        if (item.image_url && /^https?:\/\//.test(item.image_url)) {
            return item.image_url;
        }

        // 3순위: image_url 이 상대 경로인 경우 Minio BASE URL 과 조합
        if (item.image_url) {
            const base = process.env.REACT_APP_MINIO_BASE_URL || "";
            if (!base) return item.image_url;

            const trimBase = base.replace(/\/$/, "");
            const trimPath = String(item.image_url).replace(/^\//, "");
            return `${trimBase}/${trimPath}`;
        }

        return null;
    };

    // 장바구니 목록 조회: GET /api/cart
    const fetchCart = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axiosClient.get("/api/cart");

            const data = Array.isArray(res.data) ? res.data : [];

            setItems(
                data.map((item) => ({
                    ...item,
                    // 기본 체크: 품절이 아닌 상품만
                    checked: !item.is_sold_out,
                }))
            );
        } catch (e) {
            setError("아직 장바구니에 담긴 상품이 없습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 첫 로딩 시 장바구니 데이터 가져오기
    useEffect(() => {
        fetchCart();
    }, []);

    // 체크 가능한(= 품절 아님) 상품 기준 전체 선택 여부
    const allChecked = useMemo(() => {
        const selectable = items.filter((it) => !it.is_sold_out);
        return (
            selectable.length > 0 &&
            selectable.every((it) => it.checked === true)
        );
    }, [items]);

    // 선택된 상품 수량 (품절 제외)
    const selectedCount = useMemo(
        () => items.filter((it) => it.checked && !it.is_sold_out).length,
        [items]
    );

    // 선택된 상품 총 금액 (품절 제외)
    const totalPrice = useMemo(
        () =>
            items
                .filter((it) => it.checked && !it.is_sold_out)
                .reduce((sum, it) => sum + it.price * it.quantity, 0),
        [items]
    );

    // 개별 상품 체크 토글 (품절이면 무시)
    const handleToggleItem = (cartItemId) => {
        setItems((prev) =>
            prev.map((it) =>
                it.cart_items_id === cartItemId && !it.is_sold_out
                    ? { ...it, checked: !it.checked }
                    : it
            )
        );
    };

    // 전체 선택/해제 (품절 제외)
    const handleToggleAll = () => {
        const next = !allChecked;
        setItems((prev) =>
            prev.map((it) =>
                it.is_sold_out ? it : { ...it, checked: next }
            )
        );
    };

    // 수량 변경 (최소 1, 품절이면 변경 X) + 백엔드 PATCH 연동
    // PATCH /api/cart  (CartitemRequestDTO)
    // body 예시: { "product_id": 123, "quantity": 3 }
    const handleQuantityChange = (cartItemId, delta) => {
        setItems((prev) => {
            const target = prev.find(
                (it) => it.cart_items_id === cartItemId && !it.is_sold_out
            );
            if (!target) return prev;

            const newQty = Math.max(1, target.quantity + delta);
            if (newQty === target.quantity) return prev;

            const updated = prev.map((it) =>
                it.cart_items_id === cartItemId
                    ? { ...it, quantity: newQty }
                    : it
            );

            const productId = target.product_id;

            (async () => {
                try {
                    await axiosClient.patch("/api/cart", {
                        product_id: productId,
                        quantity: newQty,
                    });
                } catch (e) {
                    alert("수량 변경 중 오류가 발생했어요. 다시 시도해 주세요.");

                    // 실패 시 이전 수량으로 롤백
                    setItems((rollbackPrev) =>
                        rollbackPrev.map((it) =>
                            it.cart_items_id === cartItemId
                                ? { ...it, quantity: target.quantity }
                                : it
                        )
                    );
                }
            })();

            return updated;
        });
    };

    // 선택 상품 삭제 (백엔드 연동)
    // DELETE /api/cart   body: { "product_id": XXX }
    const handleDeleteSelected = async () => {
        const selected = items.filter(
            (it) => it.checked && !it.is_sold_out
        );



        if (!window.confirm("선택한 상품을 삭제하시겠습니까?")) return;

        try {
            // 모든 선택 상품에 대해 DELETE 호출
            await Promise.all(
                selected.map((item) =>
                    axiosClient.delete("/api/cart", {
                        data: { product_id: item.product_id }, // ⭐ Map<String, Integer> request.get("product_id")
                    })
                )
            );

            // 프론트 상태에서도 제거
            setItems((prev) =>
                prev.filter((it) => !selected.some((s) => s.cart_items_id === it.cart_items_id))
            );
        } catch (e) {
            alert("선택한 상품 삭제 중 오류가 발생했어요.");
        }
    };

    // 개별 행 삭제 (백엔드 연동)
    const handleDeleteOne = async (cartItemId, productId) => {
        if (!window.confirm("해당 상품을 장바구니에서 삭제하시겠습니까?")) return;

        try {
            await axiosClient.delete("/api/cart", {
                data: { product_id: productId },
            });

            setItems((prev) =>
                prev.filter((it) => it.cart_items_id !== cartItemId)
            );
        } catch (e) {
            alert("상품 삭제 중 오류가 발생했어요.");
        }
    };

    // 주문하기 → 결제 페이지로 선택된 상품 전달
    // 주문하기 버튼 핸들러
    const handleOrder = () => {
        const selectedItems = items.filter(
            (it) => it.checked && !it.is_sold_out
        );

        if (selectedItems.length === 0) {
            alert("주문할 상품을 선택해주세요.");
            return;
        }
        const simpleOrderList = selectedItems.map((item) => ({
            product_id: item.product_id,
            buy_quantity: item.quantity,
        }));

        navigate("/order/payment", {
            state: {
                checkoutItems: simpleOrderList,
            },
        });
    };

    return (
        <UserMyPageLayout>
            <section className="mypage-section cart-section">
                <h3 className="mypage-section-title">장바구니</h3>

                {loading && (
                    <div className="cart-empty-box">장바구니를 불러오는 중입니다...</div>
                )}
                {error && <div className="cart-empty-box">{error}</div>}

                {/* 비어 있을 때 UI */}
                {!loading && !error && items.length === 0 ? (
                    <div className="cart-empty-box">
                        아직 장바구니에 담긴 상품이 없습니다.
                    </div>
                ) : (
                    !loading &&
                    !error && (
                        <>
                            {/* 상단 전체 선택 / 선택삭제 영역 */}
                            <div className="cart-top-bar">
                                <label className="cart-top-check">
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        onChange={handleToggleAll}
                                    />
                                    <span>전체 선택</span>
                                </label>

                                <button
                                    type="button"
                                    className="cart-delete-btn"
                                    onClick={handleDeleteSelected}
                                    disabled={selectedCount === 0}
                                >
                                    선택삭제
                                </button>
                            </div>

                            {/* 리스트 영역 */}
                            <div className="cart-list">
                                {items.map((item) => {
                                    const thumbUrl = getThumbnailUrl(item);

                                    return (
                                        <div
                                            key={item.cart_items_id}
                                            className={`cart-item${
                                                item.is_sold_out ? " cart-item-soldout" : ""
                                            }`}
                                        >
                                        {/* 왼쪽: 체크박스 + 썸네일 + 상품정보 */}
                                        <div className="cart-item-left">
                                            <input
                                                type="checkbox"
                                                className="cart-item-checkbox"
                                                checked={item.checked && !item.is_sold_out}
                                                disabled={item.is_sold_out}
                                                onChange={() =>
                                                    handleToggleItem(item.cart_items_id)
                                                }
                                            />

                                            <div
                                                className="cart-thumb"
                                                onClick={() =>
                                                    item.product_id &&
                                                    navigate(`/product/${item.product_id}`)
                                                }
                                            >
                                                {thumbUrl ? (
                                                    <img
                                                        src={thumbUrl}
                                                        alt={item.prd_name || "상품 이미지"}
                                                        className="cart-thumb-img"
                                                    />
                                                ) : (
                                                    <span className="cart-thumb-placeholder">
                                                        이미지
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                className="cart-info"
                                                onClick={() =>
                                                    item.product_id &&
                                                    navigate(`/product/${item.product_id}`)
                                                }
                                            >
                                                <div className="cart-brand">
                                                    {item.prd_brand}
                                                </div>
                                                <div className="cart-name">
                                                    {item.prd_name}
                                                </div>
                                                <div className="cart-category">
                                                    {item.category}
                                                </div>
                                                {item.is_sold_out && (
                                                    <span className="cart-soldout-label">
                                                        품절
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* 오른쪽: 삭제 + 가격(합계) + 수량 */}
                                        <div className="cart-item-right">
                                            <button
                                                type="button"
                                                className="cart-row-delete"
                                                onClick={() =>
                                                    handleDeleteOne(
                                                        item.cart_items_id,
                                                        item.product_id
                                                    )
                                                }
                                            >
                                                삭제
                                            </button>

                                            {/* 합계 가격 */}
                                            <div className="cart-subtotal">
                                                {formatPrice(item.price * item.quantity)}원
                                            </div>

                                            {/* 수량 조절 박스 */}
                                            <div className="cart-qty-box">
                                                <button
                                                    type="button"
                                                    className="qty-btn"
                                                    disabled={item.is_sold_out}
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.cart_items_id,
                                                            -1
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>

                                                <span className="cart-qty-value">
                                                    {item.quantity}개
                                                </span>

                                                <button
                                                    type="button"
                                                    className="qty-btn"
                                                    disabled={item.is_sold_out}
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.cart_items_id,
                                                            +1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                                })}
                            </div>

                            {/* 하단 합계 영역 */}
                            <div className="cart-bottom-bar">
                                <div className="cart-bottom-left">
                                    총 <strong>{selectedCount}개</strong> 상품 선택
                                </div>
                                <div className="cart-bottom-right">
                                    <span className="cart-total-label">합계</span>
                                    <span className="cart-total-price">
                                        {formatPrice(totalPrice)}원
                                    </span>
                                    <button
                                        type="button"
                                        className="cart-order-btn"
                                        onClick={handleOrder}
                                        disabled={selectedCount === 0}
                                    >
                                        선택 상품 주문하기
                                    </button>
                                </div>
                            </div>
                        </>
                    )
                )}
            </section>
        </UserMyPageLayout>
    );
}