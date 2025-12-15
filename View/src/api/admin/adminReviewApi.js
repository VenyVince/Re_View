import axiosClient from "api/axiosClient";

// 관리자용 전체 리뷰 목록 조회
export const fetchAdminReviews = async (page = 1, size = 10, sort = "like_count") => {
    const res = await axiosClient.get("/api/reviews", {
        params: { page, size, sort },
    });
    return res.data;
}

// 운영자 pick 설정 / 해제
export const selectReview = (reviewId, isSelected) =>
    axiosClient.post(`/api/admin/reviews/${reviewId}/select`, {
        is_selected: isSelected,
    });

// 리뷰 삭제
export const deleteReview = (reviewId) =>
    axiosClient.delete(`/api/admin/reviews/${reviewId}`);
