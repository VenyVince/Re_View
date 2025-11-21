package com.review.shop.service.review;

import com.review.shop.dto.review.ProductReviewDTO;
import com.review.shop.dto.review.review_create.CreateReviewRequestDTO;
import com.review.shop.dto.review.review_create.CreateReviewResponseDTO;
import com.review.shop.service.userinfo.user_related.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class Review_PointService {

    private final ProductReviewService productReviewService;
    private final PointService pointService; //기존 서비스 재활용

    private static final int REVIEW_DEFAULT_POINT = 100;

    @Transactional
    public CreateReviewResponseDTO createReviewWithReward(
            int product_id,
            int user_id,
            CreateReviewRequestDTO request
    ) {

        // 리뷰 작성
        ProductReviewDTO review = productReviewService.createReview(
                product_id,
                user_id,
                request.getContent(),
                request.getRating(),
                request.getImageUrls()
        );

        // 포인트 적립
        pointService.addReviewPoint(user_id, review.getReview_id(), REVIEW_DEFAULT_POINT);

        // 응답 DTO 구성
        CreateReviewResponseDTO response = new CreateReviewResponseDTO();
        response.setReview_id(review.getReview_id());
        response.setContent(review.getContent());
        response.setRating(review.getRating());
        response.setImageUrls(request.getImageUrls());
        response.setPointsEarned(REVIEW_DEFAULT_POINT);

        return response;
    }
}
