import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");   // 로그인 시 저장된 토큰
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



export default axiosClient;
