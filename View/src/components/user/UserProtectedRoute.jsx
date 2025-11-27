// src/components/user/UserProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserProtectedRoute() {
    const { auth, loading } = useAuth();

    // 로딩중일 때 화면 깜빡임 방지
    if (loading) return null;

    // 로그인 안 되어 있으면 → 로그인 페이지로
    if (!auth.loggedIn) {
        return <Navigate to="/login" replace />;
    }

    // 관리자는 접근 금지 → 관리자 메인으로 보내기
    if (auth.role === "ROLE_ADMIN") {
        return <Navigate to="/admin/allproducts" replace />;
    }

    // 일반 유저만 통과
    return <Outlet />;
}