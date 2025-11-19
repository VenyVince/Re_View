package com.review.shop.controller.product;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.product.ProductReviewDTO;
import com.review.shop.dto.review.review_create.CreateReviewRequestDTO;
import com.review.shop.service.product.ProductReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product Review", description = "상품 리뷰 관련 API")
public class ProductReviewController {

    private final ProductReviewService productReviewService;
    private final Security_Util security_Util;



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

    /**
     * 리뷰 생성
     */
    @PostMapping("/{product_id}")
    @Operation(summary = "리뷰 생성", description = "상품에 대한 리뷰 생성. 포인트적립 안됨. 포인트 적립은 Review_Point쪽 봐야함")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    public ProductReviewDTO createReview(
            @PathVariable int product_id,
            @RequestBody CreateReviewRequestDTO reviewRequest) {
        int user_id = security_Util.getCurrentUserId();

        // 2. 리뷰 생성
        return productReviewService.createReview(
                product_id,
                user_id,
                reviewRequest.getContent(),
                reviewRequest.getRating(),
                reviewRequest.getImageUrls() // URL 배열은 ImageUploadController에서 처리
        );
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
        productReviewService.deleteReview(product_id, user_id, review_id);
    }
}