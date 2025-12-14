// src/api/admin/adminUserApi.js
import axiosClient from "api/axiosClient";

// 전체 회원 목록 조회
export const fetchMembers = () => {
    return axiosClient.get("/api/admin/users");
};

// 회원 포인트 조회
export const fetchMemberPoints = (userId) => {
    return axiosClient.get(`/api/admin/users/${userId}/points`);
};

// 회원 밴
export const banMember = (userId, reason) => {
    return axiosClient.post(`/api/admin/users/${userId}/ban`, { reason });
};
