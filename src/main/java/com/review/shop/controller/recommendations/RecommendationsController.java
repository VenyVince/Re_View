package com.review.shop.controller.recommendations;

import com.review.shop.dto.product.RecommendationDTO;
import com.review.shop.dto.recommendations.RecommendationResponseDTO;
import com.review.shop.dto.recommendations.RecommendationsUserDTO;
import com.review.shop.service.recommendations.RecommendationsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class RecommendationsController {

    private final RecommendationsService recommendationsService;

    @Operation(summary = "추천 상품과 리뷰 조회", description = "로그인한 사용자의 바우만 유형을 기반으로 추천 상품을 조회합니다.")
    @PostMapping("/api/recommendations/{type}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "추천 상품과 리뷰 조회 성공",
                    content = @Content(schema = @Schema(implementation = RecommendationResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "404", description = "자원 없음",
                    content = @Content(schema = @Schema(implementation = String.class))),
    })

    public ResponseEntity<Map<String, Object>> getRecommendations(
            @Parameter(
                    description = "바우만 타입 필터",
                    required = true,
                    schema = @Schema(
                            type = "string",
                            allowableValues = {"all", "first", "second", "third", "fourth"},
                            example = "all"
                    )
            )
            @PathVariable String type) {

        //로그인 세션을 참고하여 바우만 아이디 가져오기
        Integer user_Baumann = recommendationsService.getBaumannTypeByUserId();

        //바우만 아이디를 기반으로 바우만 DTO 가져오기
        RecommendationsUserDTO baumannDTO = recommendationsService.getBaumannDTOWithId(user_Baumann);
        System.out.println(baumannDTO);
        //바우만 DTO를 기반으로 type에 따른 추천 상품 리스트 가져오기
        List<RecommendationDTO> recommendationsPrdList = recommendationsService.getRecommendedProducts(baumannDTO,type);

        Map<String, Object> response = new HashMap<>();

        response.put("message", "추천 상품 조회에 성공했습니다.");
        response.put("recommended_products", recommendationsPrdList);

        return ResponseEntity.ok().body(response);
    }


}
