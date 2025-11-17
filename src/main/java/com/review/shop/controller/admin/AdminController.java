package com.review.shop.controller.admin;

import com.review.shop.dto.ProductDetailDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.service.admin.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
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
@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    AdminService adminService;

    //상품 등록 (테스트 완료)
    @Operation(summary = "상품 등록", description = "새로운 상품을 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "상품 등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/products")
    public ResponseEntity<String> insertProduct(@RequestBody ProductDetailDTO product) {
        adminService.insertProduct(product);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("상품이 등록되었습니다");
    }

    // 상품 수정 (테스트 완료)
    @Operation(summary = "상품 수정", description = "기존 상품의 정보를 수정합니다. (현재 전체 데이터 필요)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류 (예: 존재하지 않는 상품 ID)",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PatchMapping("/products/{productId}")
    public ResponseEntity<String> updateProduct(
            @Parameter(description = "수정할 상품의 ID") @PathVariable int productId,
            @RequestBody ProductDetailDTO product) {
        adminService.updateProduct(productId, product);
        return ResponseEntity.ok("상품이 수정되었습니다");
    }

    // 상품 삭제 (테스트 완료)
    @Operation(summary = "상품 삭제 (논리적)", description = "상품을 논리적으로 삭제합니다. (DELETED_DATE 플래그 설정)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류 (예: 존재하지 않는 상품 ID)",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<String> deleteProduct(
            @Parameter(description = "삭제할 상품의 ID") @PathVariable int productId) {
        adminService.deleteProduct(productId);
        return ResponseEntity.ok("상품이 삭제되었습니다");
    }

    // 상품 주문 현황 변경 (테스트 완료)
    @Operation(summary = "주문 상태 변경", description = "특정 주문의 상태를 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "주문 상태 변경 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류 (예: 존재하지 않는 주문 ID)",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(
            @Parameter(description = "상태 변경할 주문의 ID") @PathVariable int orderId,
            @RequestBody @Schema(example = "{\"orderStatus\": \"SHIPPED\"}") Map<String, String> payload) {
        String orderStatus = payload.get("orderStatus");
        adminService.updateOrderStatus(orderId, orderStatus);
        return ResponseEntity.ok("주문 상태가 변경되었습니다");
    }

    // QnA 답변 등록/수정 (테스트 완료)
    @Operation(summary = "QnA 답변 등록/수정", description = "QnA 게시글에 관리자 답변을 등록하거나 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "QnA 답변 등록/수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류 (예: 존재하지 않는 QnA ID)",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PatchMapping("/qna/{qnaId}/answer")
    public ResponseEntity<String> updateQnaAnswer(
            @Parameter(description = "답변할 QnA의 ID") @PathVariable int qnaId,
            @RequestBody @Schema(example = "{\"adminAnswer\": \"문의주신 상품은 재입고 예정입니다.\"}") Map<String, String> payload) {
        String adminAnswer = payload.get("adminAnswer");

        adminService.updateQnaAnswer(qnaId, adminAnswer);
        return ResponseEntity.ok("QnA 답변이 등록되었습니다");
    }

    // 회원 포인트 조회 (테스트 완료)
    @Operation(summary = "회원 포인트 조회", description = "특정 회원의 보유 포인트를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "포인트 조회 성공",
                    content = @Content(schema = @Schema(example = "{\"points\": 1500}"))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류 (예: 존재하지 않는 회원 ID)",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/users/{userId}/points")
    public ResponseEntity<Map<String, Integer>> getMemberPoints(
            @Parameter(description = "조회할 회원의 ID") @PathVariable int userId) {
        int points = adminService.getMemberPoints(userId);
        return ResponseEntity.ok(Map.of("points", points));
    }

    //어드민 페이지에서 모든 상품 불러오기(테스트 완료)
    @Operation(summary = "전체 상품 목록 조회 (어드민용)", description = "어드민 페이지에서 사용할 전체 상품 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 목록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/allproducts")
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(adminService.getAllProducts());
    }

    //리뷰 삭제 기능 (테스트 완료)
    @Operation(summary = "리뷰 삭제", description = "특정 상품 리뷰를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류 (예: 존재하지 않는 리뷰 ID)",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @Parameter(description = "삭제할 리뷰의 ID") @PathVariable int reviewId) {
        adminService.deleteReview(reviewId);
        return ResponseEntity.ok("리뷰가 삭제되었습니다");
    }



    //어드민 관련 예외 처리 핸들러 400으로 통일
    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<String> handleWrongRequest(DatabaseException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }
}