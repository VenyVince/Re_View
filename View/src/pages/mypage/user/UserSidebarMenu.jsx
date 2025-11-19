// src/pages/mypage/user/UserSidebarMenu.jsx
import React from "react";
import "./UserDashboard.css"; // 같은 스타일 재사용

export default function UserSidebarMenu({ activeMenu, onChangeMenu }) {
    return (
        <aside className="mypage-sidebar">
            <h2 className="mypage-title">마이페이지</h2>

            <div className="mypage-menu">
                <button
                    className={`mypage-menu-item ${activeMenu === "order" ? "active" : ""}`}
                    onClick={() => onChangeMenu("order")}
                >
                    주문 배송 관리
                </button>
                <button
                    className={`mypage-menu-item ${activeMenu === "wish" ? "active" : ""}`}
                    onClick={() => onChangeMenu("wish")}
                >
                    찜 상품
                </button>
                <button
                    className={`mypage-menu-item ${activeMenu === "cart" ? "active" : ""}`}
                    onClick={() => onChangeMenu("cart")}
                >
                    장바구니
                </button>
                <button
                    className={`mypage-menu-item ${activeMenu === "review" ? "active" : ""}`}
                    onClick={() => onChangeMenu("review")}
                >
                    작성 후기
                </button>
                <button
                    className={`mypage-menu-item ${activeMenu === "skin" ? "active" : ""}`}
                    onClick={() => onChangeMenu("skin")}
                >
                    피부 테스트
                </button>
                <button
                    className={`mypage-menu-item ${activeMenu === "cs" ? "active" : ""}`}
                    onClick={() => onChangeMenu("cs")}
                >
                    고객센터
                </button>
            </div>
        </aside>
    );
}