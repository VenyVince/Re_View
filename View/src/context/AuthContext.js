// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        loggedIn: false,
        userId: null,
        role: null,
        nickname: null,
        point: 0,
        loading: true,
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

            // 로그인 기본 정보 세팅
            setAuth({
                loggedIn: true,
                userId: res.data.id,
                nickname: res.data.nickname ?? res.data.id,
                role: res.data.role,
                point: res.data.point ?? 0, // 초기값만 있고 인증 성공 시 point 사라짐 -> 그 부분 방지위한 코드
                loading: false,
            });
        } catch (err) {
            setAuth({
                loggedIn: false,
                userId: null,
                role: null,
                nickname: null,
                point: 0,
                loading: false,
            });
        }
    }

    // 로그인 성공 시 호출 (LoginPage에서 사용)
    const login = ({id, nickname}) => {
        // 서버에 세션이 실제로 생기기 때문에 프론트에서 값 임의로 박을 필요 없음
        setAuth((prev) =>({
            ...prev,
            loading: true,
        }));
        checkSession(); // 로그인 성공 후 실제 role, userId 자동 반영
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
                nickname: null,
                point: 0,
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