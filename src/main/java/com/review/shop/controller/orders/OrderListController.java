package com.review.shop.controller.orders;

import com.review.shop.util.Security_Util;
import com.review.shop.dto.orders.OrderDetailResponseDTO;
import com.review.shop.dto.orders.OrderListResponseDTO;
import com.review.shop.service.order.OrderListService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderListController {

    private final Security_Util securityUtil;
    private final OrderListService orderListService;

    @Operation(summary = "내 주문 내역 조회", description = "로그인한 사용자의 전체 주문 내역을 최신순으로 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @GetMapping
    public ResponseEntity<List<OrderListResponseDTO>> getMyOrders() {
        int user_id = securityUtil.getCurrentUserId();

        return ResponseEntity.ok(orderListService.getMyOrderList(user_id));
    }

    @Operation(summary = "주문 상세 조회", description = "주문 ID로 상세 정보를 조회합니다. (본인 주문만 가능)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "주문 없음"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @GetMapping("/{order_id}")
    public ResponseEntity<OrderDetailResponseDTO> getOrderDetail(@PathVariable int order_id) {
        int user_id = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(orderListService.getOrderDetail(order_id, user_id));
    }
}