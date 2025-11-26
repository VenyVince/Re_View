// src/api/products/productApi.js
import axios from "axios";

// 단일 category 값으로 요청하는 함수
export const fetchProductsByCategory = (category) =>
    axios.get(
        `/api/products?category=${encodeURIComponent(category)}&page=1&size=100`
    );
