import axiosClient from "../axiosClient";

export const fetchMemberPoints = (userId) =>
    axiosClient.get(`/api/admin/users/${userId}/points`);
