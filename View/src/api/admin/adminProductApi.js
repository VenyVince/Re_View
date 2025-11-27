import axiosClient from "../axiosClient";

/* 공통 에러 핸들러 */
async function safeRequest(promise) {
    try {
        const res = await promise;
        return res.data ?? null;
    } catch (err) {
        console.error("[API ERROR]", err);
        throw err;
    }
}

/* 전체 상품 조회 */
export const fetchAdminProducts = async () =>
    safeRequest(axiosClient.get("/api/admin/allproducts"));

/* 단일 상품 조회 */
export const fetchAdminProduct = async (productId) => {
    const data = await safeRequest(
        axiosClient.get(`/api/admin/products/${productId}`)
    );

    return {
        ...data,
        product_images: Array.isArray(data?.product_images)
            ? data.product_images
            : [],
    };
};

/* 상품 등록(JSON) */
export const createProduct = async (data) =>
    safeRequest(axiosClient.post("/api/admin/products", data));

/* 상품 수정(JSON) */
export const updateProduct = async (productId, body) =>
    safeRequest(axiosClient.patch(`/api/admin/products/${productId}`, body));

/* 상품 삭제 */
export const deleteProduct = async (productId) =>
    safeRequest(axiosClient.delete(`/api/admin/products/${productId}`));

/*  이미지 업로드 (multipart)
    ⚠ 백엔드 이미지 API 구조 확정되면 사용 예정
    - mainImage / detailImages 구분될 가능성 있음
    - 현재는 비활성 상태
*/
export const uploadProductImages = async (mainImage, detailImages) => {
    // TODO: 백엔드 이미지 업로드 구조 확정 후 구현
    // 예상 처리 흐름:
    // 1) FormData 생성
    // 2) formData.append("mainImage", mainImage)
    // 3) detailImages.forEach(f => formData.append("detailImages", f))
    // 4) axiosClient.post("/api/images/products", formData)

    console.warn("[uploadProductImages] 이미지 업로드 API는 백엔드 확정 후 구현됩니다.");
};
