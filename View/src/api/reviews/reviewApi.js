import axios from "axios";

export const fetchAllReviews = (category = "로션", page = 1, size = 100) =>
    axios.get(`/api/reviews`, {
        params: {
            category,
            page,
            size
        }
    });
