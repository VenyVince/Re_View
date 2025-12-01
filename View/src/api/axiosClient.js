import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
    withCredentials: true,
});

// 요청 인터셉터
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");   // 로그인 토큰
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // JSON body일 때만 자동으로 json 헤더 추가 (선택사항)
    if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
    }

    return config;
});

export default axiosClient;
