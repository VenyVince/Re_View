import axiosClient from "api/axiosClient";

// 전체 qna 목록 조회
export const fetchQnaList = () =>
    axiosClient.get("/api/admin/qna");

// 특정 qna 상세 조회
export const fetchQnaDetail = (qnaId) =>
    axiosClient.get(`/api/qna/${qnaId}`);

// qna 답변 등록/수정
export const updateQnaAnswer = (qnaId, adminAnswer) =>
    axiosClient.patch(`/api/admin/qna/${qnaId}/answer`, {
        adminAnswer: adminAnswer
    });
