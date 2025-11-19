package com.review.shop.controller.product;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.product.ProductReviewDTO;
import com.review.shop.dto.review.CreateReviewRequest;
import com.review.shop.service.product.ProductReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductReviewController {

    private final ProductReviewService productReviewService;
    private final Security_Util security_Util;



    /**
     * 특정 상품의 리뷰 목록 조회
     */
    @GetMapping("/{product_id}/reviews")
    public ResponseEntity<List<ProductReviewDTO>> getProductReviews(
            @PathVariable int product_id,
            @RequestParam(value = "sort", defaultValue = "like_count") String sort) {

            List<ProductReviewDTO> reviews = productReviewService.getProductReviews(product_id, sort);
            return ResponseEntity.ok(reviews);
    }

    /**
     * 리뷰 생성
     * 세션에서 user_id를 직접 가져옴
     */
    @PostMapping("/{product_id}/reviews")
    public ProductReviewDTO createReview(
            @PathVariable int product_id,
            @RequestBody CreateReviewRequest reviewRequest) {
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
    @DeleteMapping("/{product_id}/reviews/{review_id}")
    public void deleteReview(
            @PathVariable int product_id,
            @PathVariable int review_id) {

        int user_id = security_Util.getCurrentUserId();
        productReviewService.deleteReview(product_id, review_id, user_id);
    }
}