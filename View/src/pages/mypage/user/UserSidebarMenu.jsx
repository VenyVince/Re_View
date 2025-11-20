// src/pages/mypage/user/UserSidebarMenu.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserDashboard.css";

export default function UserSidebarMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <aside className="mypage-sidebar">
            <h2 className="mypage-title">마이페이지</h2>

            <div className="mypage-menu">
                <button className={`mypage-menu-item ${currentPath === "/mypage" ? "active" : ""}`} onClick={() => navigate("/mypage")}>
                    주문 배송 관리
                </button>

                <button className={`mypage-menu-item ${currentPath === "/mypage/wish" ? "active" : ""}`} onClick={() => navigate("/mypage/wish")}>
                    찜 상품
                </button>

                <button className={`mypage-menu-item ${currentPath === "/mypage/cart" ? "active" : ""}`} onClick={() => navigate("/mypage/cart")}>
                    장바구니
                </button>

                <button className={`mypage-menu-item ${currentPath === "/mypage/review" ? "active" : ""}`} onClick={() => navigate("/mypage/review")}>
                    작성 후기
                </button>

                <button
                    className={`mypage-menu-item ${currentPath === "/mypage/skin" ? "active" : ""}`} onClick={() => navigate("/mypage/skin")}>
                    피부 테스트
                </button>

                <button className={`mypage-menu-item ${currentPath === "/mypage/cs" ? "active" : ""}`} onClick={() => navigate("/mypage/cs")}>
                    고객센터
                </button>
            </div>
        </aside>
    );
}