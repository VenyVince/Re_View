package com.review.shop.repository.Orders;

import com.review.shop.dto.orders.OrderDetailResponseDto;
import com.review.shop.dto.orders.OrderItemDto;
import com.review.shop.dto.orders.OrderListResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface OrderListMapper {

    // 주문 목록 조회
    List<OrderListResponseDto> findOrderListByUserId(
            @Param("userId") int userId,
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    // 주문 상세 기본 정보 (본인 확인 포함)
    Optional<OrderDetailResponseDto> findOrderDetailById(
            @Param("orderId") int orderId,
            @Param("userId") int userId
    );

    // 주문 상세 상품 목록
    List<OrderItemDto> findOrderItemsByOrderId(int orderId);
}