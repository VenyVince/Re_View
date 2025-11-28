// src/components/user/UserProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserProtectedRoute() {
    const { auth } = useAuth();           // ✅ authLoading 말고 auth만
    const location = useLocation();

    // 세션 확인 중일 때는 리다이렉트 금지 -> 새로고침 시 페이지 유지
    if (auth.loading) {
        return;
    }

    // 세션 확인 끝났는데 로그인 안 되어 있음 → 로그인 페이지로
    if (!auth.loggedIn) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}   // 어디서 왔는지 정보
            />
        );
    }

    // 관리자면 유저 마이페이지 접근 막고 관리자 메인으로
    if (auth.role === "ROLE_ADMIN") {
        return <Navigate to="/admin/allproducts" replace />;
    }

    // 4) 일반 유저만 통과
    return <Outlet />;
}