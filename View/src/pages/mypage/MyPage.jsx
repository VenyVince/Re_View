import { useAuth } from "../../context/AuthContext";
import AdminProductPage from "./admin/AdminProductPage";
import { Navigate } from "react-router-dom";
import UserDeliveryPage from "./user/delivery/UserDeliveryPage";

export default function MyPage() {
    const { auth, authLoading } = useAuth();

    // 로그인 체크 중(로딩 페이지)
    if (authLoading) {
        return <div style={{ padding: 40 }}>로그인 상태 확인 중...</div>;
    }

    // 로그인이 안 되어있을 때
    if (!auth.loggedIn) return <div>로그인 해주세요</div>;

    // 관리자면 관리자 페이지로
    if (auth.role === "ROLE_ADMIN") {
        return <Navigate to="/admin/allproducts" replace />;
    }

    // 일반 유저 페이지
    return (
        <UserDeliveryPage/>
    );
}