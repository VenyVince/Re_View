import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken"); // 프로젝트 키에 맞게 조정 가능
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default axiosClient;
