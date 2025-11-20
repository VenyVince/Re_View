package com.review.shop.controller.product;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.product.ProductReviewDTO;
import com.review.shop.dto.product.UpdateReviewRequestDTO;
import com.review.shop.dto.product.review_create.CreateReviewRequestDTO;
import com.review.shop.service.product.ProductReviewService;
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

    // 특정 삼품에 대한 리뷰 작성 히스토리 확인용
    @GetMapping("/{product_id}/reviews/{user_id}/exists")
    @Operation(
            summary = "리뷰 재작성 여부 확인",
            description = "사용자가 구매 후 처음으로 작성하는 리뷰인지 확인. true이면 이미 리뷰 작성했으니 " +
                          "ProductReviewController에서 처리, false면 Review_PointController에서 처리"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    public ResponseEntity<Map<String, Boolean>> hasUserReviewed(
            @PathVariable int product_id,
            @PathVariable int user_id) {

        boolean hasReviewed = productReviewService.hasUserReviewed(product_id, user_id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("hasReview", hasReviewed);
        return ResponseEntity.ok(response);
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
        productReviewService.deleteReview(product_id, user_id, review_id);
    }
}