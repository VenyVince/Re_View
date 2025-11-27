// src/pages/mypage/user/UserDeliveryPage.jsx
import React from "react";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserDeliveryPage.css";
import addressDummy from "../dummy/addressDummy";
import { useNavigate } from "react-router-dom";

export default function UserDeliveryPage() {
    const navigate = useNavigate();

    const defaultAddress =
        addressDummy.find(addr => addr.is_default) || addressDummy[0];


    return (
        <UserMyPageLayout>
            {/* ▶ 세션 카드 1 : 주문 배송 관리(기본 배송지 카드) */}
            <section className="mypage-section delivery-summary-section">


                <div className="delivery-default-card">
                    <div className="delivery-default-left">
                        <div className="delivery-default-label">기본 배송지</div>
                        <div className="delivery-default-main">
                            <span className="delivery-tag">{defaultAddress.address_name}</span>
                            <span className="delivery-recipient">{defaultAddress.recipient}</span>
                            <span className="delivery-phone">{defaultAddress.phone}</span>
                        </div>
                        <div className="delivery-default-sub">
                            ({defaultAddress.postal_code}) {defaultAddress.address},{" "}
                            {defaultAddress.detail_address}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="delivery-manage-btn"
                        onClick={() => navigate("address")}
                    >
                        배송지 관리
                    </button>
                </div>
            </section>

            {/* ▶ 세션 카드 2 : 주문 배송 현황(프로필 카드처럼 별도 카드) */}
            <section className="mypage-section delivery-status-section">
                <h3 className="mypage-section-title">주문 배송 현황</h3>

                <div className="delivery-status-card-wrapper">
                    <div className="delivery-status-card">
                        <div className="delivery-status-label">주문완료</div>
                        <div className="delivery-status-value">0</div>
                    </div>
                    <div className="delivery-status-card">
                        <div className="delivery-status-label">배송중</div>
                        <div className="delivery-status-value">0</div>
                    </div>
                    <div className="delivery-status-card">
                        <div className="delivery-status-label">배송완료</div>
                        <div className="delivery-status-value">0</div>
                    </div>
                </div>
            </section>
        </UserMyPageLayout>
    );
}