package com.review.shop.controller.orders;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.orders.OrderCheckoutResponse;
import com.review.shop.dto.orders.OrderCreateDTO;
import com.review.shop.dto.orders.OrderDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.service.order.OrderPreviewService;
import com.review.shop.service.order.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
public class OrderController {
    private final OrderPreviewService orderPreviewService;
    private final OrderService orderService;
    private final Security_Util security_util;
    //배송지 관리는 추후에 추가 예정
    // 주문 미리보기 엔드포인트
    @Operation (summary = "주문 미리보기", description = "주문할 상품들의 정보와 총 가격, 사용자의 포인트를 조회합니다.")
    @PostMapping("/api/orders/checkout")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "주문 미리보기 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (ResourceNotFoundException 등)"),
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> checkout(@RequestBody List<OrderDTO> orderList) {

        // 상품 정보와 총 가격 조회
        OrderCheckoutResponse checkoutResponse = orderPreviewService.getPrdInfoList(orderList);

        int user_id = security_util.getCurrentUserId();

        Integer userPoint = orderPreviewService.getUserPoint(user_id);

        Map<String, Object> response = new HashMap<>();
        response.put("products", checkoutResponse.getProducts());  // 상품 리스트
        response.put("total_price", checkoutResponse.getTotalPrice());  // 총 가격
        response.put("point", userPoint);  // 사용자 포인트

        return ResponseEntity.ok().body(response);
    }

    //실제 주문 처리 엔드포인트
    @Operation (summary = "주문 처리", description = "주문을 처리하고 포인트 차감 및 재고 관리를 수행합니다.")
    @PostMapping("/api/orders")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "주문 처리 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (포인트 부족, 재고 부족 등)"),
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<String> orders(@RequestBody OrderCreateDTO orderCreateDTO) {

        // 트랜잭션을 포함한 모든 서비스 호출하기
        orderService.processOrder(orderCreateDTO);

        return ResponseEntity.ok("주문 성공");
    }


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    // WrongRequestException 처리
    @ExceptionHandler(com.review.shop.exception.WrongRequestException.class)
    public ResponseEntity<String> handleWrongRequest(WrongRequestException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    @ExceptionHandler(com.review.shop.exception.DatabaseException.class)
    public ResponseEntity<String> handleDatabaseException(DatabaseException ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ex.getMessage());
    }
}