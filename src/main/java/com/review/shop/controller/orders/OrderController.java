package com.review.shop.controller.orders;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.orders.OrderCheckoutResponse;
import com.review.shop.dto.orders.OrderCreateDTO;
import com.review.shop.dto.orders.OrderDTO;
import com.review.shop.service.order.OrderPreviewService;
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
    private final OrderPreviewService orderPreviewService;
    private final OrderService orderService;
    private final Security_Util security_util
            ;
    //배송지 관리는 추후에 추가 예정
    // 주문 미리보기 엔드포인트
    @PostMapping("/api/orders/checkout")
    public ResponseEntity<?> checkout(@RequestBody List<OrderDTO> orderList) {

        // 상품 정보와 총 가격 조회
        OrderCheckoutResponse checkoutResponse = orderPreviewService.getPrdInfoList(orderList);

        int userId = security_util.getCurrentUserId();

        Integer userPoint = orderPreviewService.getUserPoint(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("products", checkoutResponse.getProducts());  // 상품 리스트
        response.put("total_price", checkoutResponse.getTotalPrice());  // 총 가격
        response.put("point", userPoint);  // 사용자 포인트

        return ResponseEntity.ok().body(response);
    }

    //실제 주문 처리 엔드포인트
    @PostMapping("/api/orders")
    public ResponseEntity<String> orders(@RequestBody OrderCreateDTO orderCreateDTO) {
        //주문번호 생성
        String orderNo = orderService.createOrderNum();

        // 포인트 검사 및 차감, 기록
        orderService.checkAndDeductPoints(orderCreateDTO.getUser_id(), orderCreateDTO.getUsing_point(),orderNo);

        //재고 차감, 관리
        orderService.checkAndDeductStock(orderCreateDTO.getOrder_list());

        //orderCreatedDTO를 OrderItem 테이블과 Order 테이블에 반영


        return ResponseEntity.ok("포인트 차감 성공: " );
    }


    // ResourceAccessException 처리
    @Hidden // Swagger 문서에서 예외 핸들러는 숨김
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<String> handleWrongRequest(ResourceAccessException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    // WrongRequestException 처리
    @Hidden // Swagger 문서에서 예외 핸들러는 숨김
    @ExceptionHandler(com.review.shop.exception.WrongRequestException.class)
    public ResponseEntity<String> handleWrongRequest(com.review.shop.exception.WrongRequestException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }
}