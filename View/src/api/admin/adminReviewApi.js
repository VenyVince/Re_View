import axiosClient from "../axiosClient";

export const selectReview = (reviewId, isSelected) =>
    axiosClient.post(`/api/admin/reviews/${reviewId}/select`, {
        is_selected: isSelected,
    });

export const deleteReview = (reviewId) =>
    axiosClient.delete(`/api/admin/reviews/${reviewId}`);
