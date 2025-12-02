// src/api/review/reviewApi.js
import axiosClient from "../axiosClient";

// 리뷰 생성(JSON body)
export const createReview = (productId, body) => {
    return axiosClient.post(`/api/reviews/${productId}`, body);
};

// 리뷰 이미지 업로드(FormData)
export const uploadReviewImages = (formData) => {
    return axiosClient.post(`/api/images/reviews`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// 주문 목록 조회
export const fetchOrders = () => {
    return axiosClient.get(`/api/orders`);
};

// 주문 상세 조회
export const fetchOrderDetail = (orderId) => {
    return axiosClient.get(`api/orders/${orderId}`);
};