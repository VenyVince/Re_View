package com.review.shop.repository.Orders;

import com.review.shop.dto.orders.OrderDetailResponseDTO;
import com.review.shop.dto.orders.OrderItemDTO;
import com.review.shop.dto.orders.OrderListResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface OrderListMapper {

    // 주문 목록 조회
    List<OrderListResponseDTO> findOrderListByUserId(
            @Param("userId") int userId,
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    // 주문 상세 기본 정보 (본인 확인 포함)
    Optional<OrderDetailResponseDTO> findOrderDetailById(
            @Param("orderId") int orderId,
            @Param("userId") int userId
    );

    // 주문 상세 상품 목록
    List<OrderItemDTO> findOrderItemsByOrderId(int orderId);
}