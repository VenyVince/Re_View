import { useAuth } from "../../context/AuthContext";
// import { Navigate } from "react-router-dom";
import AdminProductPage from "./admin/AdminProductPage";
import UserDashboard from "./user/UserDashboard";

export default function MyPage() {
    const {auth} = useAuth();

    if (!auth.loggedIn) return <div>로그인 해주세요</div>;

    // 관리자면 관리자 페이지로
    if (auth.role === "ROLE_ADMIN") {
        return <AdminProductPage/>;
    }

    // 일반 유저 페이지
    return (
        <UserDashboard/>
    );
}