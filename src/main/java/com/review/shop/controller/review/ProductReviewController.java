package com.review.shop.controller.review;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.review.ProductReviewDTO;
import com.review.shop.dto.review.UpdateReviewRequestDTO;
import com.review.shop.dto.review.review_create.CreateReviewRequestDTO;
import com.review.shop.dto.review.review_create.CreateReviewResponseDTO;
import com.review.shop.service.review.ProductReviewService;
import com.review.shop.service.review.Review_PointService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Product Review", description = "상품 리뷰 관련 API")
public class ProductReviewController {

    private final ProductReviewService productReviewService;
    private final Security_Util security_Util;
    private final Review_PointService review_pointService;



    /**
     * 특정 상품의 리뷰 목록 조회
     */
    @GetMapping("/{product_id}/reviews")
    @Operation(summary = "상품 리뷰 조회", description = "상품 ID로 리뷰 조회, 정렬 옵션: like_count, latest, rating")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 조회 성공"),
            @ApiResponse(responseCode = "404", description = "리뷰 없음 (ResourceNotFoundException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    public ResponseEntity<List<ProductReviewDTO>> getProductReviews(
            @PathVariable int product_id,
            @RequestParam(value = "sort", defaultValue = "like_count") String sort) {

            List<ProductReviewDTO> reviews = productReviewService.getProductReviews(product_id, sort);
            return ResponseEntity.ok(reviews);
    }

    // 특정 삼품에 대한 리뷰 작성 히스토리 확인용
    @GetMapping("/exists/create")
    @Operation(
            summary = "리뷰 작성 가능 여부 확인",
            description = "사용자의 리뷰 작성 여부, 리뷰 작성 가능시 주문내역에서 리뷰 작성하라고 띄우면 될 거 같음."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    public ResponseEntity<Map<String, Boolean>> canCreate(
            @RequestBody int order_item_id) {
        int user_id = security_Util.getCurrentUserId();
        boolean canCreate = productReviewService.canCreate(order_item_id, user_id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("canCreate", canCreate);
        return ResponseEntity.ok(response);
    }

    // 특정 삼품에 대한 리뷰 작성 히스토리 확인용
    @GetMapping("/exists/update")
    @Operation(
            summary = "리뷰 수정 및 삭제 가능 여부 확인",
            description = "사용자의 리뷰 작성 여부, 리뷰 작성 가능시 주문내역에서 리뷰 작성하라고 띄우면 될 거 같음."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    public ResponseEntity<Map<String, Boolean>> canUpdate(
            @RequestBody int review_id) {
        int user_id = security_Util.getCurrentUserId();
        boolean canUpdate = productReviewService.canUpdate(review_id, user_id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("canUpdate", canUpdate);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{product_id}")
    @Operation(summary = "리뷰 작성", description = "리뷰 생성 및 포인트 적립")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    public ResponseEntity<CreateReviewResponseDTO> createReview(
            @PathVariable int product_id,
            @RequestBody CreateReviewRequestDTO request
    ) {
        int user_id = security_Util.getCurrentUserId();

        CreateReviewResponseDTO result = review_pointService.createReviewWithReward(
                product_id,
                user_id,
                request
        );

        return ResponseEntity.ok(result);
    }


    // 리뷰 수정
    @Operation(summary = "리뷰 수정", description = "리뷰 내용, 평점, 이미지 수정")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PatchMapping("/{review_id}")
    public ResponseEntity<ProductReviewDTO> updateReview(
            @PathVariable("review_id") int review_id,
            @RequestBody UpdateReviewRequestDTO request
    ) {
        int user_id = security_Util.getCurrentUserId();

        ProductReviewDTO updatedReview = productReviewService.updateReview(
                review_id,
                user_id,
                request.getContent(),
                request.getRating(),
                request.getImageUrls()
        );

        return ResponseEntity.ok(updatedReview);
    }

    /**
     * 리뷰 삭제 (Soft Delete)
     */
    @DeleteMapping("/{product_id}/{review_id}")
    @Operation(summary = "리뷰 삭제", description = "본인 리뷰만 삭제 가능 (Soft Delete)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    public void deleteReview(
            @PathVariable int product_id,
            @PathVariable int review_id) {

        int user_id = security_Util.getCurrentUserId();
        review_pointService.deleteReviewWithPenalty(product_id, user_id, review_id);
    }
}