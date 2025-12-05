// src/components/user/UserProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserProtectedRoute() {
    const { auth } = useAuth();
    const location = useLocation();

    if (auth.loading) return null;

    if (!auth.loggedIn) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // 관리자는 절대 /mypage 진입 금지
    if (auth.role === "ROLE_ADMIN") {
        return <Navigate to="/admin/allproducts" replace />;
    }

    return <Outlet />;
}
