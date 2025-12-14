import axiosClient from "api/axiosClient";

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
        axiosClient.get(`/api/admin/products/find/${productId}`)
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

/* ===============================
 * 이미지 업로드 (multipart/form-data)
 * Swagger 스펙 기준:
 * POST /api/images/products
 * - 필드명: images
 * - 배열 지원
 =============================== */
// 등록용
export const uploadProductImages = async (mainImage, detailImages = []) => {
    const fd = new FormData();

    // 대표 이미지
    if (mainImage) {
        fd.append("images", mainImage);
    }

    // 상세 이미지
    detailImages.forEach((file) => {
        fd.append("images", file);
    });

    const res = await axiosClient.post("/api/images/products", fd, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data; // ["url1", "url2", ...]
};

// 수정용
export const updateProductImages = async (productId, mainImage, detailImage) => {
  const fd = new FormData();

  if(mainImage){
      fd.append("images", mainImage);
  }

  if(detailImage){
      fd.append("images",detailImage);
  }

  return axiosClient.put(`/api/admin/products/${productId}/images`,fd,{
      headers: { "Content-Type" : "multipart/form-data"}
  });
};
