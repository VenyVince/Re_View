// src/api/products/productApi.js
import axiosClient from "api/axiosClient";

export const fetchProductsByCategory = async (category) => {
    return axiosClient.get("/api/products", {
        params: {
            page: 1,
            size: 100,
            sort: "latest",
            ...(category ? { category } : {})
        }
    });
};
