package com.review.shop.controller.product;

import com.review.shop.dto.product.ProductReviewDTO;
import com.review.shop.service.product.ProductReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductReviewController {

    private final ProductReviewService productReviewService;

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<ProductReviewDTO>> getProductReviews(
            @PathVariable int productId,
            @RequestParam(value = "sort", defaultValue = "like_count") String sort) {

        log.debug("=== 상품 리뷰 API 요청 ===");
        log.debug("productId: {}, sort: {}", productId, sort);

        try {

            List<ProductReviewDTO> reviews = productReviewService.getProductReviews(productId, sort);
            log.debug("조회 성공 - 리뷰 개수: {}", reviews.size());

            // data만 응답
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            log.error("에러 발생", e);
            e.printStackTrace();

            return ResponseEntity.status(500).build();
        }
    }
}