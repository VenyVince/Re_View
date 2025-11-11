import AdminProductPage from "./admin/AdminProductPage";
// 일반 사용자 마이페이지 컴포넌트도 나중에 연결
const UserMyPage = () => <div style={{padding:24}}>일반 사용자 마이페이지</div>;

export default function MyPage() {
    // 로그인 시 저장한 값 사용 { loggedIn:true, role:'ADMIN'|'USER' }
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");

    if (auth?.role === "ADMIN") return <AdminProductPage />;
    return <UserMyPage />;
}
