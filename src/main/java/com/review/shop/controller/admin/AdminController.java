package com.review.shop.controller.admin;

import com.review.shop.dto.product.ProductDetailDTO;
import com.review.shop.dto.qna.QnAListDTO;
import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.service.admin.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
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
@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // =================================================================================
    // SECTION: 상품 관리 (Product)
    // =================================================================================

    @Operation(summary = "전체 상품 목록 조회 (어드민용)", description = "어드민 페이지에서 사용할 전체 상품 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ProductDetailDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/allproducts")
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(adminService.getAllProducts());
    }

    @Operation(summary = "상품 등록", description = "새로운 상품을 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "상품 등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류")
    })
    @PostMapping("/products")
    public ResponseEntity<String> insertProduct(@RequestBody ProductDetailDTO product) {
        adminService.insertProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body("상품이 등록되었습니다");
    }

    @Operation(summary = "상품 수정", description = "기존 상품의 정보를 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류")
    })
    @PatchMapping("/products/{productId}")
    public ResponseEntity<String> updateProduct(
            @Parameter(description = "수정할 상품의 ID") @PathVariable int productId,
            @RequestBody ProductDetailDTO product) {
        adminService.updateProduct(productId, product);
        return ResponseEntity.ok("상품이 수정되었습니다");
    }

    @Operation(summary = "상품 삭제 (논리적)", description = "상품을 논리적으로 삭제합니다. (DELETED_DATE 설정)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류")
    })
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<String> deleteProduct(
            @Parameter(description = "삭제할 상품의 ID") @PathVariable int productId) {
        adminService.deleteProduct(productId);
        return ResponseEntity.ok("상품이 삭제되었습니다");
    }

    // =================================================================================
    // SECTION: 주문 관리 (Order)
    // =================================================================================

    @Operation(summary = "주문 상태 변경", description = "특정 주문의 상태를 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "주문 상태 변경 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류")
    })
    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(
            @Parameter(description = "상태 변경할 주문의 ID") @PathVariable int orderId,
            @RequestBody @Schema(example = "{\"orderStatus\": \"SHIPPED\"}") Map<String, String> payload) {
        adminService.updateOrderStatus(orderId, payload.get("orderStatus"));
        return ResponseEntity.ok("주문 상태가 변경되었습니다");
    }

    // =================================================================================
    // SECTION: 리뷰 관리 (Review)
    // =================================================================================

    @Operation(summary = "리뷰 삭제", description = "특정 상품 리뷰를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류")
    })
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @Parameter(description = "삭제할 리뷰의 ID") @PathVariable int reviewId) {
        adminService.deleteReview(reviewId);
        return ResponseEntity.ok("리뷰가 삭제되었습니다");
    }

    @Operation(summary = "운영자 픽 업데이트", description = "특정 리뷰의 선택 상태(is_selected 0 or 1)를 업데이트합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/reviews/{reviewId}/select")
    public ResponseEntity<String> selectReview(
            @Parameter(description = "선택할 리뷰의 ID") @PathVariable int reviewId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = "{\"is_selected\": 1}")))
            @RequestBody Map<String, Integer> payload) {

        Integer isSelected = payload.get("is_selected");
        if (isSelected == null || (isSelected != 0 && isSelected != 1)) {
            return ResponseEntity.badRequest().body("is_selected 값은 0 또는 1이어야 합니다.");
        }

        adminService.setReviewSelection(reviewId, isSelected);
        return ResponseEntity.ok("리뷰 선택 상태가 업데이트되었습니다");
    }

    // =================================================================================
    // SECTION: 고객 지원 및 회원 관리 (CS & Member)
    // =================================================================================

    @Operation(summary = "전체 QnA 목록 조회 (어드민용)", description = "어드민 페이지에서 사용할 전체 QnA 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "QnA 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = QnAListDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/qna")
    public ResponseEntity<?> getAllQna() {
        return ResponseEntity.ok(adminService.getAllQna());

    }

    @Operation(summary = "QnA 상세 조회", description = "특정 QnA 게시글의 상세 내용을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "QnA 상세 조회 성공",
                    content = @Content(schema = @Schema(implementation = QnaDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/qna/{qnaId}")
    public ResponseEntity<?> getQnaDetail(
            @Parameter(description = "조회할 QnA의 ID") @PathVariable int qnaId) {
        return ResponseEntity.ok(adminService.getQnaDetail(qnaId));
    }



    @Operation(summary = "QnA 답변 등록/수정", description = "QnA 게시글에 관리자 답변을 등록하거나 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "답변 등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PatchMapping("/qna/{qnaId}/answer")
    public ResponseEntity<String> updateQnaAnswer(
            @Parameter(description = "답변할 QnA의 ID") @PathVariable int qnaId,
            @RequestBody @Schema(example = "{\"adminAnswer\": \"답변 내용\"}") Map<String, String> payload) {
        adminService.updateQnaAnswer(qnaId, payload.get("adminAnswer"));
        return ResponseEntity.ok("QnA 답변이 등록되었습니다");
    }

    @Operation(summary = "회원 포인트 조회", description = "특정 회원의 보유 포인트를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "포인트 조회 성공",
                    content = @Content(schema = @Schema(example = "{\"points\": 1500}"))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/users/{userId}/points")
    public ResponseEntity<Map<String, Integer>> getMemberPoints(
            @Parameter(description = "조회할 회원의 ID") @PathVariable int userId) {
        return ResponseEntity.ok(Map.of("points", adminService.getMemberPoints(userId)));
    }

    // =================================================================================
    // SECTION: 예외 처리 (Exception Handler)
    // =================================================================================

    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<String> handleWrongRequest(DatabaseException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}