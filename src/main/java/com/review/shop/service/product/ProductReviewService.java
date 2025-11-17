package com.review.shop.service.product;

import com.review.shop.dto.product.ProductReviewDTO;
import com.review.shop.repository.product.ProductReviewMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductReviewService {

    private final ProductReviewMapper productReviewMapper;

    /**
     * 특정 상품의 리뷰 목록 조회
     */
    public List<ProductReviewDTO> getProductReviews(int productId, String sort) {
        log.debug("ProductReviewService 호출 - productId: {}, sort: {}", productId, sort);

        // 정렬 옵션 검증
        if (sort == null || sort.isEmpty()) {
            sort = "like_count";
        }

        if (!sort.equals("like_count") && !sort.equals("latest") && !sort.equals("rating")) {
            sort = "like_count";
        }

        log.debug("정렬 옵션 검증 완료 - sort: {}", sort);

        // DB에서 조회
        List<ProductReviewDTO> reviewsWithImages = productReviewMapper.selectReviewsByProduct(productId, sort);

        log.debug("DB 조회 결과: {} 행 반환", reviewsWithImages.size());

        // 리뷰를 review_id로 그룹핑해서 이미지 배열 생성
        Map<Integer, ProductReviewDTO> groupedReviews = new LinkedHashMap<>();

        for (ProductReviewDTO review : reviewsWithImages) {
            Integer reviewId = review.getReview_id();

            // 같은 리뷰가 처음 나온 경우
            if (!groupedReviews.containsKey(reviewId)) {
                // 이미지 배열 초기화
                review.setImages(new ArrayList<>());
                groupedReviews.put(reviewId, review);

                log.debug("새 리뷰 추가 - review_id: {}, nickname: {}", reviewId, review.getNickname());
            }

            // 이미지가 있으면 배열에 추가
            if (review.getImage_url() != null && !review.getImage_url().isEmpty()) {
                groupedReviews.get(reviewId).getImages().add(review.getImage_url());
                log.debug("이미지 추가 - review_id: {}", reviewId);
            }
        }

        List<ProductReviewDTO> result = new ArrayList<>(groupedReviews.values());
        log.debug("최종 리뷰 개수: {} (그룹핑 후)", result.size());

        return result;
    }

    /**
     * 리뷰 생성
     * userId를 직접 받음 (세션에서 가져온 값)
     */
    public ProductReviewDTO createReview(
            int productId,
            int userId,  // ← String 아님, int 직접!
            String content,
            double rating,
            List<String> imageUrls
    ) {
        log.debug("리뷰 생성 시작 - productId: {}, userId: {}, rating: {}", productId, userId, rating);

        // 1. 유효성 검사
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("리뷰 내용이 필수입니다");
        }
        if (content.length() > 1000) {
            throw new IllegalArgumentException("리뷰 내용은 1000자 이하여야 합니다");
        }
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("평점은 1~5 사이여야 합니다");
        }

        log.debug("유효성 검사 완료 - content: {} 글자", content.length());

        // 2. 리뷰 생성 (DB 조회 없음!)
        int insertedRows = productReviewMapper.insertReview(productId, userId, content, rating);

        if (insertedRows != 1) {
            throw new RuntimeException("리뷰 생성 실패");
        }

        log.debug("리뷰 INSERT 완료");

        // 3. 생성된 리뷰 조회
        ProductReviewDTO createdReview = productReviewMapper.selectLastReview(productId, userId);

        if (createdReview == null) {
            throw new RuntimeException("생성된 리뷰 조회 실패");
        }

        log.debug("생성된 리뷰 조회 완료 - review_id: {}", createdReview.getReview_id());

        // 4. 이미지 저장
        if (imageUrls != null && !imageUrls.isEmpty()) {
            for (String imageUrl : imageUrls) {
                int imageInserted = productReviewMapper.insertReviewImage(createdReview.getReview_id(), imageUrl);

                if (imageInserted != 1) {
                    log.warn("이미지 저장 실패 - review_id: {}, imageUrl: {}", createdReview.getReview_id(), imageUrl);
                } else {
                    log.debug("이미지 저장 완료 - imageUrl: {}", imageUrl);
                }
            }
        }

        // 5. 이미지 배열 설정
        createdReview.setImages(imageUrls != null ? imageUrls : new ArrayList<>());

        log.info("리뷰 생성 성공 - review_id: {}, userId: {}", createdReview.getReview_id(), userId);

        return createdReview;
    }

    /**
     * 리뷰 삭제 (Soft Delete)
     */
    public void deleteReview(int reviewId, int userId) {
        // 1. 리뷰 존재 여부 확인
        ProductReviewDTO review = productReviewMapper.selectReviewById(reviewId);

        if (review == null) {
            throw new IllegalArgumentException("존재하지 않는 리뷰입니다");
        }

        // 2. 삭제 권한 확인 (본인만 삭제 가능)
        if (review.getUser_id() != userId) {
            throw new IllegalArgumentException("본인의 리뷰만 삭제할 수 있습니다");
        }

        // 3. 삭제 (Soft Delete - deleted_at 업데이트)
        productReviewMapper.deleteReview(reviewId);

        log.info("리뷰 삭제 완료 - review_id: {}, user_id: {}", reviewId, userId);
    }
}