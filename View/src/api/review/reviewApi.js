// src/api/review/reviewApi.js
import axiosClient from "api/axiosClient";


// MinIO Presigned URL 발급
export const getPresignedUrls = async (params) => {
    const response = await axiosClient.post('/api/images/products/convert-datas', params);
    return response.data;
};

// 리뷰 생성
export const createReview = async (productId, body) => {
    const response = await axiosClient.post(`/api/reviews/${productId}`, body);
    return response.data;
};

// 주문 목록 조회
export const fetchOrders = () => {
    return axiosClient.get(`/api/orders`);
};

// 주문 상세 조회
export const fetchOrderDetail = (orderId) => {
    return axiosClient.get(`/api/orders/${orderId}`);
};

// 리뷰 작성 가능 여부 확인
export const checkReviewExists = (orderItemId) => {
    return axiosClient.get(`/api/reviews/exists/create`, {
        params: { order_item_id: orderItemId }
    });
};
