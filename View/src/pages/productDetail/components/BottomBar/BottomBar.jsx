// src/pages/productDetail/components/BottomBar.jsx

import React from "react";
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
    const productName = product?.prd_name;

    const handleWish = async () => {
        if (!productName) {
            alert("상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        try {
            // UI 반영
            setWish(!wish);

            const res = await fetch(
                `/api/wishlist?product_name=${encodeURIComponent(productName)}`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!res.ok) {
                if (res.status === 400) {
                    alert("이미 찜한 상품입니다.");
                    return;
                }
                alert("찜 추가 중 오류가 발생했습니다.");
                return;
            }

            alert("찜 목록에 추가되었습니다!");

            // ⭐ 찜 성공 → 마이페이지 찜 목록으로 이동
            navigate("/mypage/wish");

        } catch (err) {
            console.error("찜 등록 오류:", err);
            alert("서버와 통신 중 문제가 발생했습니다.");
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
