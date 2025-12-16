package com.review.shop.controller.admin;

import com.review.shop.dto.admin.AdminReviewSelectDTO;
import com.review.shop.service.admin.AdminReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Admin API", description = "관리자 리뷰 관리 기능 API")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") //
@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminReviewController {

    private final AdminReviewService adminReviewService;



    // =================================================================================
    // SECTION: 리뷰 관리 (Review)
    // =================================================================================

    @Operation(summary = "리뷰 삭제 (논리적)", description = "특정 상품 리뷰를 삭제합니다. (DELETED_DATE 설정)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류"),
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @DeleteMapping("/reviews/{review_id}")
    public ResponseEntity<String> deleteReview(
            @Parameter(description = "삭제할 리뷰의 ID")
            @PathVariable int review_id) {
        adminReviewService.deleteReview(review_id);
        return ResponseEntity.ok("리뷰가 삭제되었습니다");
    }

    @Operation(summary = "운영자 픽 업데이트", description = "특정 리뷰의 선택 상태(is_selected 0 or 1)를 업데이트합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류"),
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/reviews/{review_id}/select")
    public ResponseEntity<String> selectReview(
            @Parameter(description = "선택할 리뷰의 ID") @PathVariable int review_id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = "{\"is_selected\": 1}")))
            @RequestBody AdminReviewSelectDTO dto) {
        Integer is_selected = dto.getIs_selected();
        adminReviewService.setReviewSelection(review_id, is_selected);
        return ResponseEntity.ok(review_id + "가 운영자 채택 리뷰로 변경되었습니다.");
    }

    //모든 리뷰 조회
    @Operation(summary = "모든 리뷰 조회", description = "모든 리뷰를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 조회 성공"),
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/reviews")
    public ResponseEntity<?> getAllReviews() {
        return ResponseEntity.ok(adminReviewService.getAllReviews());
    }

}