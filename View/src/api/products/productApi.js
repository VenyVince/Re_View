// src/api/products/productApi.js
import axios from "axios";

// 백엔드 카테고리만 API에 전달
export const fetchProductsByCategory = async (category) => {
    return axios.get("/api/products", {
        params: {
            page: 1,
            size: 100,
            sort: "latest",
            category: category || null
        }
    });
};
