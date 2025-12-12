import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BottomBar.css";

import axiosClient from "../../../../api/axiosClient";

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 여부 확인
    useEffect(() => {
        const checkLogin = async () => {
            try {
                await axiosClient.get("/api/auth/me");
                setIsLoggedIn(true);
            } catch {
                setIsLoggedIn(false);
            }
        };
        checkLogin();
    }, []);

    // 찜 상태 조회 (로그인된 경우만)
    useEffect(() => {
        if (!isLoggedIn) return;

        const productId = product?.product_id;
        if (!productId) return;

        const fetchWishState = async () => {
            try {
                const res = await axiosClient.get("/api/wishlist");
                const list = res.data?.wishlist || [];
                setWish(list.some((item) => item.product_id === productId));
            } catch (err) {
                console.error("찜 상태 조회 실패:", err);
            }
        };

        fetchWishState();
    }, [product, isLoggedIn, setWish]);

    // 로그인 필요 알림
    const requireLogin = () => {
        alert("로그인이 필요합니다.");
        navigate("/login");
    };

    // 찜 클릭
    const handleWish = async () => {
        if (!isLoggedIn) {
            requireLogin();
            return;
        }

        const productId = product?.product_id;
        if (!productId) return;

        try {
            setWish(!wish);

            if (wish) {
                await axiosClient.delete("/api/wishlist", {
                    params: { product_id: productId },
                });
            } else {
                await axiosClient.post("/api/wishlist", null, {
                    params: { product_id: productId },
                });
            }
        } catch (err) {
            console.error("찜 처리 오류:", err);
            setWish(wish);
        }
    };

    // 장바구니 / 구매 클릭
    const handleActionClick = (type) => {
        if (!isLoggedIn) {
            requireLogin();
            return;
        }

        setMiniActionType(type);
        setShowMiniBuyBox(true);
        requestAnimationFrame(() => {
            adjustBottomBarPosition();
            adjustMiniBoxPosition();
        });
    };

    return (
        <div className="pd-bottom-bar">
            <div className="pd-bottom-inner">

                {/* 찜 */}
                <button
                    className={`pd-btm-btn wish ${wish ? "active" : ""}`}
                    onClick={handleWish}
                >
                    {wish ? "♥" : "♡"}
                </button>

                {/* 장바구니 */}
                <button
                    className="pd-btm-btn cart"
                    onClick={() => handleActionClick("cart")}
                >
                    장바구니
                </button>

                {/* 구매하기 */}
                <button
                    className="pd-btm-btn buy"
                    onClick={() => handleActionClick("buy")}
                >
                    구매하기
                </button>

            </div>
        </div>
    );
}
