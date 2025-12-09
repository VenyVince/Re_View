package com.review.shop.controller.orders;

import com.review.shop.dto.orders.OrderCheckoutProductInfoDTO;
import com.review.shop.dto.orders.OrderCheckoutResponse;
import com.review.shop.dto.orders.OrderCreateDTO;
import com.review.shop.dto.orders.OrderDTO;
import com.review.shop.service.order.OrderPreviewService;
import com.review.shop.service.order.OrderService;
import com.review.shop.util.Security_Util;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OrderController {
    private final OrderPreviewService orderPreviewService;
    private final OrderService orderService;
    private final Security_Util security_util;

    // 주문 미리보기 엔드포인트
    @Operation (summary = "주문 미리보기", description = "주문할 상품들의 정보와 총 가격, 사용자의 포인트를 조회합니다.")
    @PostMapping("/api/orders/checkout")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "주문 미리보기 성공",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderCheckoutProductInfoDTO.class)))
            ),
            @ApiResponse(responseCode = "400", description = "백엔드 오류"),
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
            @ApiResponse(responseCode = "400", description = "백엔드 오류"),
            @ApiResponse(responseCode = "404", description = "자원 없음 오류"),
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<String> orders(@RequestBody OrderCreateDTO orderCreateDTO) {
        //orderCreateDTO에 현재 로그인한 user_id 설정
        orderCreateDTO.setUser_id(security_util.getCurrentUserId());
        // 트랜잭션을 포함한 모든 서비스 호출하기
        orderService.processOrder(orderCreateDTO);

        return ResponseEntity.ok("주문 성공");
    }
}