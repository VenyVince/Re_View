// src/api/admin/adminOrderApi.js
import axiosClient from "api/axiosClient";

// 주문 검색
export const searchOrders = (keyword, status, sort = "latest") => {
    return axiosClient.get("/api/admin/search/orders", {
        params: { keyword, status, sort }
    });
};

// 주문 상태 변경
export const updateOrderStatus = (orderId, newStatus) => {
    return axiosClient.patch(`/api/admin/orders/${orderId}/status`, {
        orderStatus: newStatus
    });
};
