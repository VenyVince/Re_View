package com.review.shop.repository.Orders;

import com.review.shop.dto.orders.OrderDetailResponseDTO;
import com.review.shop.dto.orders.OrderItemDetailDTO;
import com.review.shop.dto.orders.OrderListResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface OrderListMapper {

    // 주문 목록 조회
    List<OrderListResponseDTO> findOrderListByUserId(
            @Param("user_id") int user_id,
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    // 주문 상세 기본 정보 (본인 확인 포함)
    Optional<OrderDetailResponseDTO> findOrderDetailById(
            @Param("order_id") int order_id,
            @Param("user_id") int user_id
    );

    // 주문 상세 상품 목록
    List<OrderItemDetailDTO> findOrderItemsByOrderId(int order_id);
}