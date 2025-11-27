// src/pages/mypage/user/UserCartPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import "./UserCartPage.css";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import cartDummy from "../dummy/cartDummy";
import { useNavigate } from "react-router-dom";

export default function UserCartPage() {
    const navigate = useNavigate();

    //  초기 상태: 아직 장바구니 데이터 없음 (이후 useEffect에서 채움)
    const [items, setItems] = useState([]);

    useEffect(() => {
        // 더미 데이터 기준 초기값 설정 (품절이 아닌 상품만 기본 체크)
        setItems(
            cartDummy.map((item) => ({
                ...item,
                checked: !item.is_sold_out,
            }))
        );
    }, []);

    // 체크 가능한(= 품절 아님) 상품 기준 전체 선택 여부
    const allChecked = useMemo(() => {
        const selectable = items.filter((it) => !it.is_sold_out);
        return (
            selectable.length > 0 && selectable.every((it) => it.checked === true)
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

    const formatPrice = (value) =>
        value.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

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

    // 수량 변경 (최소 1, 품절이면 변경 X)
    const handleQuantityChange = (cartItemId, delta) => {
        setItems((prev) =>
            prev.map((it) =>
                it.cart_items_id === cartItemId && !it.is_sold_out
                    ? { ...it, quantity: Math.max(1, it.quantity + delta) }
                    : it
            )
        );
    };

    // 선택 상품 삭제
    const handleDeleteSelected = () => {
        if (selectedCount === 0) {
            alert("삭제할 상품을 선택해주세요.");
            return;
        }
        if (!window.confirm("선택한 상품을 삭제하시겠습니까?")) return;

        setItems((prev) => prev.filter((it) => !it.checked));
    };

    // 개별 행 삭제
    const handleDeleteOne = (cartItemId) => {
        setItems((prev) =>
            prev.filter((it) => it.cart_items_id !== cartItemId)
        );
    };

    // ✅ 주문하기 → 결제 페이지로 선택된 상품 전달
    const handleOrder = () => {
        const selectedItems = items.filter(
            (it) => it.checked && !it.is_sold_out
        );

        if (selectedItems.length === 0) {
            alert("주문할 상품을 선택해주세요.");
            return;
        }

        // 결제 페이지로 이동 + 선택된 상품들을 state로 전달
        navigate("/order/payment", {
            state: {
                items: selectedItems,
            },
        });
    };

    return (
        <UserMyPageLayout>
            <section className="mypage-section cart-section">
                <h3 className="mypage-section-title">장바구니</h3>

                {/* 비어 있을 때 UI */}
                {items.length === 0 ? (
                    <div className="cart-empty-box">
                        아직 장바구니에 담긴 상품이 없습니다.
                    </div>
                ) : (
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
                            {items.map((item) => (
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

                                        <div className="cart-thumb">
                                            <span className="cart-thumb-placeholder">
                                                이미지
                                            </span>
                                        </div>

                                        <div className="cart-info">
                                            <div className="cart-brand">{item.prd_brand}</div>
                                            <div className="cart-name">{item.prd_name}</div>
                                            <div className="cart-category">{item.category}</div>
                                            {item.is_sold_out && (
                                                <span className="cart-soldout-label">품절</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* 오른쪽: 삭제 + 가격(합계) + 수량 */}
                                    <div className="cart-item-right">
                                        <button
                                            type="button"
                                            className="cart-row-delete"
                                            onClick={() => handleDeleteOne(item.cart_items_id)}
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
                            ))}
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
                )}
            </section>
        </UserMyPageLayout>
    );
}