package com.review.shop.controller.product;

import com.review.shop.dto.product.ProductReviewDTO;
import com.review.shop.dto.review.CreateReviewRequest;
import com.review.shop.service.product.ProductReviewService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductReviewController {

    private final ProductReviewService productReviewService;
    private static final String UPLOAD_DIR = "/uploads/reviews/";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5MB

    /**
     * 특정 상품의 리뷰 목록 조회
     */
    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<ProductReviewDTO>> getProductReviews(
            @PathVariable int productId,
            @RequestParam(value = "sort", defaultValue = "like_count") String sort) {

        log.info("=== 상품 리뷰 목록 조회 API 요청 ===");
        log.info("productId: {}, sort: {}", productId, sort);

        try {
            long startTime = System.currentTimeMillis();

            List<ProductReviewDTO> reviews = productReviewService.getProductReviews(productId, sort);

            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;

            log.info("조회 성공 - 리뷰 개수: {}, 소요 시간: {}ms", reviews.size(), duration);

            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            log.error("❌ 에러 발생!!", e);
            e.printStackTrace();

            return ResponseEntity.status(500).build();
        }
    }

    /**
     * 리뷰 생성
     * 세션에서 user_id를 직접 가져옴 ✅
     */
    @PostMapping("/{productId}/reviews")
    public ResponseEntity<?> createReview(
            @PathVariable int productId,
            @RequestPart(name = "reviewData") CreateReviewRequest reviewRequest,
            @RequestPart(name = "images", required = false) MultipartFile[] images,
            HttpSession session) {  // ← 세션 주입

        log.info("=== 리뷰 생성 API 요청 ===");
        log.info("productId: {}, rating: {}", productId, reviewRequest.getRating());

        try {
            // 1. 세션에서 user_id 직접 가져오기 ✅
            Integer userIdObj = (Integer) session.getAttribute("userId");

            if (userIdObj == null) {
                log.warn("인증되지 않은 사용자");
                return ResponseEntity.status(401).body("로그인이 필요합니다");
            }

            int userId = userIdObj;
            log.debug("세션에서 user_id 조회 - user_id: {}", userId);

            // 2. 이미지 저장
            List<String> imageUrls = new ArrayList<>();
            if (images != null && images.length > 0) {
                if (images.length > 5) {
                    return ResponseEntity.badRequest().body("이미지는 최대 5개까지만 업로드 가능합니다");
                }

                for (MultipartFile image : images) {
                    if (image.getSize() > MAX_FILE_SIZE) {
                        return ResponseEntity.badRequest().body("이미지 크기는 5MB 이하여야 합니다");
                    }

                    // 파일 저장
                    String imageUrl = saveImage(image);
                    imageUrls.add(imageUrl);
                    log.debug("이미지 저장 - {}", imageUrl);
                }
            }

            // 3. 리뷰 생성 (userId 직접 전달) ✅
            ProductReviewDTO createdReview = productReviewService.createReview(
                    productId,
                    userId,  // ← 직접 사용 (DB 조회 없음!)
                    reviewRequest.getContent(),
                    reviewRequest.getRating(),
                    imageUrls
            );

            log.info("리뷰 생성 성공 - review_id: {}", createdReview.getReview_id());

            return ResponseEntity.status(201).body(createdReview);
        } catch (IllegalArgumentException e) {
            log.warn("유효성 검사 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("❌ 리뷰 생성 에러!!", e);
            e.printStackTrace();
            return ResponseEntity.status(500).body("리뷰 생성 실패");
        }
    }

    /**
     * 이미지 저장 (로컬 파일시스템)
     */
    private String saveImage(MultipartFile image) throws IOException {
        // 파일 디렉토리 생성
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // 파일 이름 생성 (UUID + 원본 확장자)
        String originalFileName = image.getOriginalFilename();
        String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
        String savedFileName = UUID.randomUUID().toString() + ext;

        // 파일 저장
        File savedFile = new File(UPLOAD_DIR + savedFileName);
        image.transferTo(savedFile);

        // 저장된 파일의 접근 경로 반환
        return "/uploads/reviews/" + savedFileName;
    }
}