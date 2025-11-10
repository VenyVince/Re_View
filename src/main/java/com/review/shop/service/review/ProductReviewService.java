package com.review.shop.service.review;

import com.review.shop.dto.review.ProductReviewDTO;
import com.review.shop.repository.review.ProductReviewMapper;
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

        // DB에서 조회 (JOIN으로 인해 리뷰가 중복될 수 있음)
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
}