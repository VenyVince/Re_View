import axiosClient from "../axiosClient";

export const fetchAllProducts = () =>
    axiosClient.get("/api/products/all"); // 전체 상품 조회
