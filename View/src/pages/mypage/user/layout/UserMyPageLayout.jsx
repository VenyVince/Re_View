// src/pages/mypage/user/UserMyPageLayout.jsx
import React from "react";
import "../dashboard/UserDashboard.css";
import UserSidebarMenu from "./UserSidebarMenu";
import UserProfileBar from "./UserProfileBar";

// 유저 마이페이지 기본 layout

export default function UserMyPageLayout({ children }) {
    return (
        <div className="mypage-container">
            {/* 왼쪽 사이드 메뉴 */}
            <UserSidebarMenu />

            {/* 오른쪽 메인 영역 */}
            <main className="mypage-main">
                {/* 상단 프로필 블랙박스 */}
                <UserProfileBar />

                {/* 각 페이지별 내용 들어가는 영역 */}
                <div className="mypage-main-body">{children}</div>
            </main>
        </div>
    );
}