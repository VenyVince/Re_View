package com.review.shop.service.review;

import com.review.shop.dto.review.ProductReviewDTO;
import com.review.shop.dto.review.review_create.CreateReviewRequestDTO;
import com.review.shop.dto.review.review_create.CreateReviewResponseDTO;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.review.ProductReviewMapper;
import com.review.shop.service.userinfo.user_related.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class Review_PointService {

    private final ProductReviewService productReviewService;
    private final PointService pointService; //기존 서비스 재활용
    private final ProductReviewMapper productReviewMapper;


    @Transactional
    // 리뷰 작성
    public CreateReviewResponseDTO createReviewWithReward(
            int product_id,
            int user_id,
            CreateReviewRequestDTO request
    ) {
        if(!productReviewService.canCreate(request.getOrder_item_id(), user_id)) {
            // 보안상 생성시에도 확인
            throw new WrongRequestException("잘못된 접근입니다.");
        }

        // 리뷰 작성
        ProductReviewDTO review = productReviewService.createReview(
                product_id,
                user_id,
                request.getContent(),
                request.getRating(),
                request.getImageUrls(),
                request.getOrder_item_id()
        );
        // 응답 DTO 구성
        CreateReviewResponseDTO response = new CreateReviewResponseDTO();
        response.setReview_id(review.getReview_id());
        response.setContent(review.getContent());
        response.setRating(review.getRating());
        response.setImageUrls(request.getImageUrls());
        response.setPointsEarned(PointService.PointConstants.CreateREVIEW);
        Integer review_id = review.getReview_id();
        // 포인트 적립
        pointService.addReviewPoint(user_id, review_id);
        return response;
    }



    // 리뷰 삭제
    @Transactional
    public void deleteReviewWithPenalty(int product_id, int user_id, int review_id) {
        // 상품 존재 여부 확인
        int productExists = productReviewMapper.selectProductById(product_id);
        if (productExists == 0) {
            throw new WrongRequestException("더이상 존재하지 않는 상품입니다");
        }

        // 리뷰 존재 여부 확인
        ProductReviewDTO review = productReviewMapper.selectReviewById(review_id);
        if (review == null) {
            throw new WrongRequestException("존재하지 않거나 이미 삭제된 리뷰입니다");
        }

        // 작성자 확인
        if (review.getUser_id() != user_id) {
            throw new WrongRequestException("본인의 리뷰만 삭제할 수 있습니다");
        }

        // Soft Delete
        productReviewMapper.deleteReview(review_id);

        // 포인트 회수 (삭제된 리뷰에 대해 적립된 포인트 차감)
        pointService.removeReviewPoint(user_id, review_id);
    }
}
