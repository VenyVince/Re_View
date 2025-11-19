package com.review.shop.service;

import com.review.shop.dto.product.ProductReviewDTO;
import com.review.shop.dto.review.review_create.CreateReviewRequestDTO;
import com.review.shop.dto.review.review_create.CreateReviewResponseDTO;
import com.review.shop.service.product.ProductReviewService;
import com.review.shop.service.userinfo.user_related.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Review_PointService {

    private final ProductReviewService productReviewService;
    private final PointService pointService;

    private static final int Review_Default_Point = 100; // 리뷰 작성 보상 포인트(추후에 프론트와 이야기해서 변경 예정)

    @Transactional
    public CreateReviewResponseDTO createReviewWithReward(
            int product_id,
            int user_id,
            CreateReviewRequestDTO request
    ) {

        // 리뷰 생성
        ProductReviewDTO review = productReviewService.createReview( // 아래 내용은 기존 서비스에 있는 것들 재활용함.
                product_id,
                user_id,
                request.getContent(),
                request.getRating(),
                request.getImageUrls()
        );

        // 포인트 적립
        pointService.addReviewPoint(user_id, review.getReview_id(), Review_Default_Point);

        // 3) 응답 DTO
        CreateReviewResponseDTO response = new CreateReviewResponseDTO();
        response.setReview_id(review.getReview_id());
        response.setContent(review.getContent());
        response.setRating(review.getRating());
        List<String> imageUrls = request.getImageUrls();
        response.setImageUrls(imageUrls);
        response.setPointsEarned(Review_Default_Point);

        return response;
    }
}
