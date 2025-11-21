// src/api/review/reviewApi.js
import axiosClient from "../axiosClient";

// 리뷰 생성
export const createReview = (productId, payload) => {
    return axiosClient.post(`/api/reviews/${productId}`, payload);
};
