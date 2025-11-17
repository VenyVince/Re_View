import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

//  AuthContext 생성
//   → React에서 전역 로그인 상태를 저장하는 "저장소" 같은 역할
const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    // 전역으로 관리할 auth 상태 값
    // loggedIn  : 로그인 여부
    // userId    : 현재 로그인한 사용자의 아이디
    // role      : 관리자/사용자 구분 (ROLE_ADMIN / ROLE_USER)
    const [auth, setAuth] = useState({
        loggedIn: false,
        userId: null,
        role: null,
    });

    // 앱이 처음 실행되거나 새로고침될 때 자동으로 세션 검사
    // (세션이 유효하면 즉시 로그인 상태 복구)
    useEffect(() => {
        checkSession();   // 로그인 여부 자동 체크
    }, []);

    // 백엔드 세션 확인 요청
    // /api/auth/me → 로그인된 사용자 정보를 반환 (id, role)
    async function checkSession() {
        try {
            const res = await axios.get("/api/auth/me", {
                withCredentials: true, // 쿠키(세션) 포함 필수
            });

            // 세션이 유효한 경우
            // 백엔드가 사용자 정보 반환 → 로그인 상태로 설정
            setAuth({
                loggedIn: true,
                userId: res.data.id,     // 로그인한 유저의 id
                role: res.data.role,     // ROLE_ADMIN 또는 ROLE_USER
            });

        } catch (err) {
            // ❌ 세션이 없거나 만료되면 → 비로그인 상태로 설정
            setAuth({
                loggedIn: false,
                userId: null,
                role: null,
            });
        }
    }

    // 로그인 성공했을 때 프론트에서 호출하는 함수
    // LoginPage에서 로그인 요청 성공 → login(id) 호출
    const login = (userId) => {

        // 1) 로그인 했다고 우선 상태만 변경
        //    여기서는 role을 모르기 때문에 null 그대로 둠
        setAuth({
            loggedIn: true,
            userId,
            role: null, // 🔸 임시 상태 → role은 아래 checkSession()에서 다시 채워짐
        });

        // 로그인 후 즉시 /api/auth/me 호출해서
        // 진짜 role(관리자인지, 일반 유저인지) 다시 받아오기
        checkSession();
    };


    // 백엔드에서 세션 삭제 후 프론트 상태도 초기화
    const logout = () => {
        setAuth({
            loggedIn: false,
            userId: null,
            role: null,
        });
    };

    // 자식 컴포넌트들에게 auth 값과 login/logout 기능을 제공
    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 훅
export const useAuth = () => useContext(AuthContext);