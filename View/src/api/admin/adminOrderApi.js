import axiosClient from "../axiosClient";

export const updateOrderStatus = (orderId, orderStatus) =>
    axiosClient.patch(`/api/admin/orders/${orderId}/status`, { orderStatus });
