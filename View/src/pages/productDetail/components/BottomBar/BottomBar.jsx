// src/pages/productDetail/components/BottomBar.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BottomBar.css";

export default function BottomBar({
                                      wish,
                                      setWish,
                                      setMiniActionType,
                                      setShowMiniBuyBox,
                                      adjustBottomBarPosition,
                                      adjustMiniBoxPosition,
                                      product,
                                  }) {
    const navigate = useNavigate();

    // -------------------------------
    // 1) 찜 상태 조회(GET)
    // -------------------------------
    useEffect(() => {
        const productId = product?.product_id;
        if (!productId) return;

        const fetchWishState = async () => {
            try {
                const res = await fetch(`/api/wishlist?product_id=${productId}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) return;

                const data = await res.json();
                const list = data.wishlist || [];

                // wishlist 배열 안에 현재 product_id가 존재하면 찜 상태 true
                const isWished = list.some(item => item.product_id === productId);

                setWish(isWished);

            } catch (err) {
                console.error("찜 상태 조회 실패:", err);
            }
        };

        fetchWishState();
    }, [product, setWish]);

    // -------------------------------
    // 2) 찜 추가 / 삭제 (POST / DELETE)
    // -------------------------------
    const handleWish = async () => {
        const productId = product?.product_id;

        if (!productId) {
            alert("상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        try {
            // UI 먼저 반영
            setWish(!wish);

            const url = `/api/wishlist?product_id=${productId}`;
            const method = wish ? "DELETE" : "POST";

            const res = await fetch(url, {
                method,
                credentials: "include",
            });

            if (!res.ok) {
                alert("찜 처리 중 오류가 발생했습니다.");
                setWish(wish); // 실패 시 원복
                return;
            }

            if (!wish) {
                alert("찜 목록에 추가되었습니다!");
            } else {
                alert("찜 목록에서 제거되었습니다.");
            }

        } catch (err) {
            console.error("찜 처리 오류:", err);
            alert("서버와 통신 중 문제가 발생했습니다.");
            setWish(wish); // 실패 시 원복
        }
    };

    return (
        <div className="pd-bottom-bar">
            <div className="pd-bottom-inner">

                {/* 찜 버튼 */}
                <button
                    className={`pd-btm-btn wish ${wish ? "active" : ""}`}
                    onClick={handleWish}
                >
                    {wish ? "♥" : "♡"}
                </button>

                {/* 장바구니 버튼 */}
                <button
                    className="pd-btm-btn cart"
                    onClick={() => {
                        setMiniActionType("cart");
                        setShowMiniBuyBox(true);
                        requestAnimationFrame(() => {
                            adjustBottomBarPosition();
                            adjustMiniBoxPosition();
                        });
                    }}
                >
                    장바구니
                </button>

                {/* 구매 버튼 */}
                <button
                    className="pd-btm-btn buy"
                    onClick={() => {
                        setMiniActionType("buy");
                        setShowMiniBuyBox(true);
                        requestAnimationFrame(() => {
                            adjustBottomBarPosition();
                            adjustMiniBoxPosition();
                        });
                    }}
                >
                    구매하기
                </button>

            </div>
        </div>
    );
}
