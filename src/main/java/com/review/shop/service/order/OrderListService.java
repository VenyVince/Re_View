package com.review.shop.service.order;

import com.review.shop.dto.orders.OrderDetailResponseDto;
import com.review.shop.dto.orders.OrderItemDto;
import com.review.shop.dto.orders.OrderListResponseDto;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.repository.Orders.OrderListMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderListService {

    private final OrderListMapper orderListMapper;

    // 내 주문 내역 조회 (userId: int)
    @Transactional(readOnly = true)
    public List<OrderListResponseDto> getMyOrderList(int userId, int page, int size) {
        try {
            int offset = (page - 1) * size;
            return orderListMapper.findOrderListByUserId(userId, offset, size);
        } catch (DataAccessException e) {
            throw new DatabaseException("주문 목록 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 주문 상세 조회 (orderId: int, userId: int)
    @Transactional(readOnly = true)
    public OrderDetailResponseDto getOrderDetail(int orderId, int userId) {
        try {
            // 1. 기본 정보 조회 (SQL에서 AND user_id = #{userId} 로 본인 확인)
            OrderDetailResponseDto orderDetail = orderListMapper.findOrderDetailById(orderId, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("주문 정보를 찾을 수 없거나 접근 권한이 없습니다."));

            // 2. 상품 목록 조회
            List<OrderItemDto> items = orderListMapper.findOrderItemsByOrderId(orderId);

            // 3. DTO 결합
            orderDetail.setOrder_items(items);

            return orderDetail;
        } catch (DataAccessException e) {
            throw new DatabaseException("주문 상세 조회 중 DB 오류가 발생했습니다.", e);
        }
    }
}