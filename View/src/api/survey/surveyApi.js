import axiosClient from "api/axiosClient";

// POST /api/survey/baumann
export const submitBaumannSurvey = ({ userId, answers }) =>
    axiosClient.post("/api/survey/baumann", {
        user_id: userId,
        answers, // number[]
    });

// GET /api/users/me/baumann
export const fetchMyBaumann = () =>
    axiosClient.get("/api/users/me/baumann");

// GET /api/products/recommendations/baumann
export const fetchBaumannRecommendations = () =>
    axiosClient.get("/api/products/recommendations/baumann");
