// src/pages/mypage/MyPage.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminProductPage from './admin/AdminProductPage';

function UserMyPage() {
    return (
        <div style={{ padding: 24 }}>
            <h2>마이페이지</h2>
            <p>여기는 일반 사용자용 마이페이지입니다.</p>
            {/* 추후: 내 정보, 주문 내역, 찜 목록 등 컴포넌트 추가 */}
        </div>
    );
}

export default function MyPage() {
    const { auth } = useAuth();

    // 아직 로그인 안 했으면 안내
    if (!auth.loggedIn) {
        return (
            <div style={{ padding: 24 }}>
                <h2>마이페이지</h2>
                <p>마이페이지를 이용하려면 로그인이 필요합니다.</p>
            </div>
        );
    }

    // 관리자 계정이면 관리자 페이지로
    if (auth.role === 'ROLE_ADMIN') {
        return <AdminProductPage />;
    }

    // 그 외는 일반 유저 마이페이지
    return <UserMyPage />;
}