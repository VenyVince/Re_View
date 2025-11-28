// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        loggedIn: false,
        userId: null,
        role: null,
        loading: true,

        nickname: null,
        point: 0,
    });

    useEffect(() => {
        checkSession();
    }, []);

    // 세션 확인: 새로고침 시에도 로그인 유지 여부 확인
    async function checkSession() {
        try {
            // 로그인 여부 / 권한 확인
            const res = await axios.get("/api/auth/me", {
                withCredentials: true,
            });

            const base = res.data; // { id, role, ... }

            // 로그인 기본 정보 세팅
            setAuth({
                loggedIn: true,
                userId: res.data.id,
                role: res.data.role,
                loading: false,
            });
        } catch (err) {
            setAuth({
                loggedIn: false,
                userId: null,
                role: null,
                loading: false,
            });
        }
    }

    // 로그인 성공 시 호출 (LoginPage에서 사용)
    const login = (userId) => {
        // 일단 프론트 상태만 로그인으로 바꾸고
        setAuth({
            loggedIn: true,
            userId,
            role: null,
            loading: false,
        });
        // 바로 서버에 /api/auth/me 한 번 더 물어봐서 role까지 채움
        checkSession();
    };

    // 로그아웃: 서버 세션 정리 + 전역 상태 초기화
    const logout = async () => {
        try {
            // 서버 세션 / JSESSIONID 제거 시도
            await axios.post(
                "/api/auth/logout",
                {},
                { withCredentials: true }
            );
        } catch (err) {
            console.error("로그아웃 요청 실패(무시 가능):", err);
        } finally {
            // 프론트 쪽 로그인 상태는 비운다
            setAuth({
                loggedIn: false,
                userId: null,
                role: null,
                loading: false,
            });
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);