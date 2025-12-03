// src/pages/productDetail/components/BottomBar.jsx
import React from "react";
import "./BottomBar.css";

export default function BottomBar({
                                      wish,
                                      setWish,
                                      setMiniActionType,
                                      setShowMiniBuyBox,
                                      adjustBottomBarPosition,
                                      adjustMiniBoxPosition
                                  }) {
    return (
        <div className="pd-bottom-bar">
            <div className="pd-bottom-inner">

                {/* 찜 버튼 */}
                <button
                    className={`pd-btm-btn wish ${wish ? "active" : ""}`}
                    onClick={() => setWish(!wish)}
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
