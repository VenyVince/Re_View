// src/components/admin/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ requireAdmin = false }) {
    const { auth } = useAuth();

    if (auth.loading) return null;

    if (!auth.loggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && auth.role !== "ROLE_ADMIN") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
