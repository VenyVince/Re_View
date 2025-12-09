package com.review.shop.controller.admin;

import com.review.shop.dto.orders.OrderAdminDTO;
import com.review.shop.service.admin.AdminOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@Tag(name = "Admin API", description = "관리자 주문 상태 관리 기능 API")
@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminOrderController {
    private final AdminOrderService adminOrderService;


    // =================================================================================
    // SECTION: 주문 관리 (Order)
    // =================================================================================

    @Operation(summary = "주문 상태 변경", description = "특정 주문의 상태를 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "주문 상태 변경 성공"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류")
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PatchMapping("/orders/{order_id}/status")
    public ResponseEntity<String> updateOrderStatus(
            @Parameter(description = "상태 변경할 주문의 ID") @PathVariable int order_id,
            @RequestBody @Schema(example = "{\"orderStatus\": \"SHIPPED\"}") Map<String, String> payload) {
        adminOrderService.updateOrderStatus(order_id, payload.get("orderStatus"));
        return ResponseEntity.ok("주문 상태가 변경되었습니다");
    }

    //주문 조회
    @Operation(summary = "주문 조회", description = "특정 주문의 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "주문 조회 성공",
                    content = @Content(schema = @Schema(implementation = OrderAdminDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "백엔드 오류"),
            @ApiResponse(responseCode = "404", description = "주문을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/getAllOrders")
    public ResponseEntity<List<OrderAdminDTO>> getAllOrders() {
        return ResponseEntity.ok(adminOrderService.getAllOrders());
    }
}
