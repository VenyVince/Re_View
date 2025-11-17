// src/context/AuthContext.js
import React, { createContext, useContext, useState } from "react";

// 전역 로그인 컨텍스트
const AuthContext = createContext(null);

// 실제 Provider 컴포넌트
export function AuthProvider({ children }) {
    // 전역 로그인 상태
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        userId: null,
        nickname: null,
        role: null,
    });

    // 로그인 시 호출할 함수
    const login = ({ userId, nickname, role }) => {
        setAuth({
            isLoggedIn: true,
            userId,
            nickname,
            role: role || "USER", // 명세엔 없으니 기본 USER
        });
    };

    // 로그아웃 시 호출할 함수 (나중에 헤더에서 사용할 예정)
    const logout = () => {
        setAuth({
            isLoggedIn: false,
            userId: null,
            nickname: null,
            role: null,
        });
    };

    const value = { auth, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 어디서든 useAuth()로 전역 로그인 상태 접근
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth는 AuthProvider 안에서만 사용해야 합니다.");
    }
    return ctx;
}