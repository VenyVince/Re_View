import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ requireAdmin = false }) {
    const raw = localStorage.getItem("auth");
    const auth = raw ? JSON.parse(raw) : null;

    // 개발 중 테스트용 우회가 필요하면 아래 주석 해제
    // return <Outlet />;

    if (!auth?.loggedIn) return <Navigate to="/login" replace />;
    if (requireAdmin && auth?.role !== "ADMIN") return <Navigate to="/" replace />;
    return <Outlet />;
}
