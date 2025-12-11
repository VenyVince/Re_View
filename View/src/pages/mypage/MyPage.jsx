// src/pages/mypage/MyPage.jsx
import { useAuth } from "../../context/AuthContext";
import UserDeliveryPage from "./user/delivery/UserDeliveryPage";

export default function MyPage() {
    const { auth } = useAuth();

    if (auth.loading) return <div>로딩 중...</div>;

    return <UserDeliveryPage />;
}
