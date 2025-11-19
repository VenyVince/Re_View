import axiosClient from "../axiosClient";

// 상품 불러오기
export const fetchAdminProducts = async () => {
    const res = await axiosClient.get("/api/admin/allproducts");
    return res.data;
};

// 상품 등록
export const createProduct = (data) =>
    axiosClient.post("/api/admin/products", data);

// 상품 수정
export const updateProduct = (productId, data) =>
    axiosClient.patch(`/api/admin/products/${productId}`, data);

// 상품 삭제
export const deleteProduct = (productId) =>
    axiosClient.delete(`/api/admin/products/${productId}`);

//수정을 위한 단일 상품 조회
export const fetchAdminProduct = (productId) =>
    axiosClient
        .get(`/api/admin/products/${productId}`)
        .then((res) => res.data);