import axiosClient from "api/axiosClient";

export const fetchAllReviews = (category = "로션", page = 1, size = 100) =>
    axiosClient().get(`/api/reviews`, {
        params: {
            category,
            page,
            size
        }
    });
