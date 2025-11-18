package com.review.shop.controller.orders;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.orders.OrderCheckoutResponse;
import com.review.shop.dto.orders.OrderDTO;
import com.review.shop.service.order.OrderService;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final Security_Util security_util;

    @PostMapping("/api/orders/checkout")  // chekout → checkout 오타 수정
    public ResponseEntity<?> checkout(@RequestBody List<OrderDTO> orderList) {

        // 상품 정보와 총 가격 조회
        OrderCheckoutResponse checkoutResponse = orderService.getPrdInfoList(orderList);

        int userId = security_util.getCurrentUserId();

        // 회원의 포인트 조회
        Integer userPoint = orderService.getUserPoint(userId);

        // 최종 응답 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("products", checkoutResponse.getProducts());  // 상품 리스트
        response.put("totalPrice", checkoutResponse.getTotalPrice());  // 총 가격
        response.put("userPoint", userPoint);  // 사용자 포인트
        response.put("finalPrice", checkoutResponse.getTotalPrice());  // 최종 결제 금액 (나중에 배송비, 할인 등 추가 가능)

        return ResponseEntity.ok().body(response);
    }

    // exception handling
    @Hidden // Swagger 문서에서 예외 핸들러는 숨김
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<String> handleWrongRequest(ResourceAccessException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }
}