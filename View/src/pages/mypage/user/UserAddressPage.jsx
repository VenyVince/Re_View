// src/pages/mypage/user/UserAddressPage.jsx
import React from "react";
import "./UserAddress.css";
import UserMyPageLayout from "./UserMyPageLayout";
import UserAddressManager from "./UserAddressManager";

export default function UserAddressPage() {
    return (
        <UserMyPageLayout activeMenu="order">
            <section className="mypage-section address-page">
                <h3 className="mypage-section-title">배송지 관리</h3>

                {/* 리스트 + 폼을 모두 이 컴포넌트에서 처리 */}
                <UserAddressManager />
            </section>
        </UserMyPageLayout>
    );
}