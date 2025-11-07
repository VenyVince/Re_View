// src/pages/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div style={{ padding: "20px" }}>
            {/* TODO: 여기 나중에 관리자 전용 사이드바/헤더 추가 */}
            <Outlet />
        </div>
    );
}
