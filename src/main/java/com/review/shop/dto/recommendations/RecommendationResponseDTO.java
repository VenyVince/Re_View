package com.review.shop.dto.recommendations;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class RecommendationResponseDTO {

    @Schema(description = "응답 메시지", example = "추천 상품 및 리뷰 조회에 성공했습니다.")
    private String message;

    @Schema(description = "추천 상품 리스트")
    private List<RecommendProductDTO> recommended_products;

    @Schema(description = "추천 리뷰 리스트")
    private List<RecommendReviewDTO> recommended_reviews;
}
