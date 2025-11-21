package com.review.shop.controller.admin;

import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.service.admin.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Admin API", description = "관리자 기능 API")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") //
@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // =================================================================================
    // SECTION: 주문 관리 (Order)
    // =================================================================================

    @Operation(summary = "주문 상태 변경", description = "특정 주문의 상태를 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "주문 상태 변경 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류")
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PatchMapping("/orders/{order_id}/status")
    public ResponseEntity<String> updateOrderStatus(
            @Parameter(description = "상태 변경할 주문의 ID") @PathVariable int order_id,
            @RequestBody @Schema(example = "{\"orderStatus\": \"SHIPPED\"}") Map<String, String> payload) {
        adminService.updateOrderStatus(order_id, payload.get("orderStatus"));
        return ResponseEntity.ok("주문 상태가 변경되었습니다");
    }

    // =================================================================================
    // SECTION: 리뷰 관리 (Review)
    // =================================================================================

    @Operation(summary = "리뷰 삭제 (논리적)", description = "특정 상품 리뷰를 삭제합니다. (DELETED_DATE 설정)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류")
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @DeleteMapping("/reviews/{review_id}")
    public ResponseEntity<String> deleteReview(
            @Parameter(description = "삭제할 리뷰의 ID") @PathVariable int review_id) {
        adminService.deleteReview(review_id);
        return ResponseEntity.ok("리뷰가 삭제되었습니다");
    }

    @Operation(summary = "운영자 픽 업데이트", description = "특정 리뷰의 선택 상태(is_selected 0 or 1)를 업데이트합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/reviews/{review_id}/select")
    public ResponseEntity<String> selectReview(
            @Parameter(description = "선택할 리뷰의 ID") @PathVariable int review_id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = "{\"is_selected\": 1}")))
            @RequestBody Map<String, Integer> payload) {

        Integer isSelected = payload.get("is_selected");
        if (isSelected == null || (isSelected != 0 && isSelected != 1)) {
            throw new WrongRequestException("is_selected는 0, 1중 하나여야 합니다.");
        }

        adminService.setReviewSelection(review_id, isSelected);
        return ResponseEntity.ok("리뷰 선택 상태가 업데이트되었습니다");
    }


    // =================================================================================
    // SECTION: 예외 처리 (Exception Handler)
    // =================================================================================

    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<String> handleDatabase(DatabaseException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(WrongRequestException.class)
    public ResponseEntity<String> handleWrongRequest(WrongRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }


}