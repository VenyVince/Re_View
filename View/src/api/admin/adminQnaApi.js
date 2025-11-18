import axiosClient from "../axiosClient";

export const fetchQnaList = () =>
    axiosClient.get("/api/admin/qna");

export const fetchQnaDetail = (qnaId) =>
    axiosClient.get(`/api/admin/qna/${qnaId}`);

export const updateQnaAnswer = (qnaId, adminAnswer) =>
    axiosClient.patch(`/api/admin/qna/${qnaId}/answer`, { adminAnswer });
