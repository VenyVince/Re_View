import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
// React에서 전역 로그인 상태를 저장하는 "저장소" 같은 역할
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        loggedIn: false,
        userId: null,
        role: null,
    });

    // 앱 시작 시 세션 확인 + 사용자 정보 가져오기
    // (세션이 유효하면 즉시 로그인 상태 복구)
    useEffect(() => {
        checkSession();
    }, []);

    // 백엔드 세션 확인 요청
    async function checkSession() {
        try {
            const res = await axios.get("/api/auth/me", {
                withCredentials: true,  // 쿠키(세션) 포함 필수
            });
            // 세션 확인 == 로그인 상태
            setAuth({
                loggedIn: true,
                userId: res.data.id,
                role: res.data.role, // ROLE_ADMIN / ROLE_USER
            });
        } catch (err) {
            // 세션 없음 == 비로그인 상태
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
        //    로그인 했다고 우선 상태만 변경
        //    여기서는 role을 모르기 때문에 null 그대로 둠
        setAuth({
            loggedIn: true,
            userId,
            role: null, // 임시 상태 → role은 아래 checkSession()에서 다시 채워짐
        });
        checkSession(); // 로그인 직후 role까지 다시 불러오기
    };

    //    로그인 후 즉시 /api/auth/me 호출해서
    //    진짜 role(관리자인지, 일반 유저인지) 다시 받아오기
    const logout = () => {
        setAuth({
            loggedIn: false,
            userId: null,
            role: null,
        });
    };

    //  자식 컴포넌트들에게 auth 값과 login/logout 기능을 제공
    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

//   AuthContext를 바로 사용하기 위한 훅
export const useAuth = () => useContext(AuthContext);