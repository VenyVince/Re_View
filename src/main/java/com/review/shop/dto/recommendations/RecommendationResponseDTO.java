package com.review.shop.dto.recommendations;

import com.review.shop.dto.product.RecommendationProductDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class RecommendationResponseDTO {

    @Schema(description = "응답 메시지", example = "추천 상품 조회에 성공했습니다.")
    private String message;

    @Schema(description = "추천 상품 리스트")
    private List<RecommendationProductDTO> recommended_products;
}