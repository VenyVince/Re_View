import { useParams, useNavigate } from "react-router-dom";
import { deleteProduct } from "../../../api/admin/adminProductApi";

export default function AdminProductDeleteConfirm() {
    const { id } = useParams();
    const nav = useNavigate();

    const handleCancel = () => {
        nav("/mypage/admin/allproducts");
    };

    const handleConfirm = async () => {
        try {
            await deleteProduct(id);
            alert("상품이 삭제되었습니다.");
            nav("/mypage/admin/allproducts");
        } catch (e) {
            console.error(e);
            alert("상품 삭제 실패…!");
        }
    };

    return (
        <div>
            <h2>삭제 확인 (id: {id})</h2>
            <button onClick={handleCancel}>취소</button>
            <button onClick={handleConfirm}>예</button>
        </div>
    );
}