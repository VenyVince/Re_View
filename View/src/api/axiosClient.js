import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});


export default axiosClient;
