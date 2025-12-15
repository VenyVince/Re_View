// src/api/recommend/baumannApi.js
import axiosClient from "api/axiosClient";

// 로그인한 유저의 바우만 타입 조회
export const fetchMyBaumannType = () => {
    return axiosClient.get("/api/auth/my-baumann-type");
};

// 개별 그룹 추천 (first, second, third, fourth, all까지 포함)
export const fetchRecommendByGroup = () => {
    return axiosClient.post("/api/recommendations/all");
};
