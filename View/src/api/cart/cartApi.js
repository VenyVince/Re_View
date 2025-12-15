// src/api/cartApi.js
import axiosClient from "api/axiosClient";

// 장바구니 조회
export const fetchCartItems = () => {
    return axiosClient.get("/api/cart").then(res => res.data);
};

// 장바구니 추가
export const addCartItem = (product_id, quantity) => {
    return axiosClient.post("/api/cart", { product_id, quantity });
};

// 장바구니 수량 변경
export const updateCartQuantity = (product_id, quantity) => {
    return axiosClient.patch("/api/cart", { product_id, quantity });
};

// 장바구니 삭제
export const deleteCartItem = (product_id) => {
    return axiosClient.delete("/api/cart", {
        data: { product_id }
    });
};
