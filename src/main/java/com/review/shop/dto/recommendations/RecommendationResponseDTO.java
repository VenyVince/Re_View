package com.review.shop.dto.recommendations;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class RecommendationResponseDTO {
    @Schema(description = "추천 상품 리스트")
    private List<RecommendProductDTO> products;

    @Schema(description = "추천 리뷰 리스트")
    private List<RecommendReviewDTO> reviews;
}
