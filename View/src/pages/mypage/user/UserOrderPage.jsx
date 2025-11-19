// src/pages/mypage/user/UserOrderPage.jsx
import React from "react";
import "./UserDashboard.css";
import UserMyPageLayout from "./UserMyPageLayout";

export default function UserOrderPage() {
    return (
        <UserMyPageLayout>
            <section className="mypage-section">
                <h3 className="mypage-section-title">주문 배송 관리</h3>

                <div className="order-summary-cards">
                    <div className="order-summary-card">
                        <div className="label">주문완료</div>
                        <div className="value">0</div>
                    </div>
                    <div className="order-summary-card">
                        <div className="label">배송중</div>
                        <div className="value">0</div>
                    </div>
                    <div className="order-summary-card">
                        <div className="label">배송완료</div>
                        <div className="value">0</div>
                    </div>
                </div>

                {/* 아래에 실제 주문 리스트 테이블 등 붙이면 됨 */}
            </section>
        </UserMyPageLayout>
    );
}