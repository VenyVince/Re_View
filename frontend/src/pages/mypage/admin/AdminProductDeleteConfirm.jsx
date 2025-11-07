import { useParams, useNavigate } from "react-router-dom";
export default function AdminProductDeleteConfirm() {
    const { id } = useParams();
    const nav = useNavigate();
    return (
        <div>
            <h2>삭제 확인 (id: {id})</h2>
            <button onClick={() => nav("/admin/products")}>취소</button>
            <button onClick={() => nav("/admin/products")}>예</button>
        </div>
    );
}
