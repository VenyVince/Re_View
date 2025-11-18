// src/pages/mypage/user/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import UserSidebarMenu from "./UserSidebarMenu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

export default function UserDashboard() {
    const [activeMenu, setActiveMenu] = useState("order");

    const navigate = useNavigate();
    const { auth } = useAuth();


    const [profile, setProfile] = useState(null);
    const [profileError, setProfileError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("/api/users/me", {
                    withCredentials: true,
                });

                // 백엔드 구조: { userInfos: [ { nickname: "...", ... } ] }
                const user = res.data?.userInfos?.[0] ?? null;
                setProfile(user);
            } catch (e) {
                console.error("내 정보 조회 실패:", e);
                console.log("status:", e.response?.status);
                console.log("data:", e.response?.data);

                setProfileError("내 정보를 불러오지 못했습니다.");
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="mypage-wrapper">
            <div className="mypage-shell">

                {/* --------------------------- */}
                {/* 왼쪽 사이드바 */}
                {/* --------------------------- */}
                <UserSidebarMenu
                    activeMenu={activeMenu}
                    onChangeMenu={setActiveMenu}
                />

                {/* --------------------------- */}
                {/* 메인 콘텐츠 영역 */}
                {/* --------------------------- */}
                <main className="mypage-main">

                    {/* 상단 프로필 블랙 박스 */}
                    <section className="mypage-profile">
                        <div className="mypage-profile-left">
                            <div className="mypage-avatar"></div>

                            <div className="mypage-profile-text">
                                {/* ★ 무조건 닉네임 출력 */}
                                <span className="mypage-profile-name">
                                    {profile?.nickname ||
                                        "닉네임 없음"}
                                </span>

                                <button className="mypage-profile-edit"
                                        onClick={() => navigate("/mypage/profile")}
                                >
                                    개인정보변경
                                </button>
                            </div>
                        </div>

                        <div className="mypage-point-box">
                            <span className="mypage-point-label">보유 포인트</span>
                            <span className="mypage-point-value">0 원</span>
                        </div>

                        {profileError && (
                            <p className="mypage-profile-error">
                                {profileError}
                            </p>
                        )}
                    </section>

                    {/* 주문 배송 요약 */}
                    <section className="mypage-summary">
                        <div className="mypage-summary-card">
                            <div className="mypage-summary-number">0</div>
                            <div className="mypage-summary-label">주문완료</div>
                        </div>
                        <div className="mypage-summary-card">
                            <div className="mypage-summary-number">0</div>
                            <div className="mypage-summary-label">배송중</div>
                        </div>
                        <div className="mypage-summary-card">
                            <div className="mypage-summary-number">0</div>
                            <div className="mypage-summary-label">배송완료</div>
                        </div>
                    </section>

                    {/* 주문 배송 내역 헤더 */}
                    <section className="mypage-orders-header">
                        <h3>주문 배송 내역</h3>
                    </section>

                    {/* 주문 내역 없음 */}
                    <div className="mypage-orders-empty">
                        <div className="mypage-orders-empty-title">
                            주문 내역이 없습니다.
                        </div>
                        <div className="mypage-orders-empty-desc">
                            홈 화면에서 상품을 둘러보세요.
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}