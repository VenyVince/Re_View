package com.review.shop.controller.recommendations;

import com.review.shop.dto.recommendations.RecommendationResponseDTO;
import com.review.shop.dto.recommendations.RecommendationResponseWrapper;
import com.review.shop.dto.recommendations.RecommendationsUserDTO;
import com.review.shop.service.recommendations.RecommendationsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RecommendationsController {

    private final RecommendationsService recommendationsService;

    // 추천 상품 + 리뷰
    @Operation(
            summary = "추천 상품 및 리뷰 조회",
            description = "로그인한 사용자의 바우만 타입을 기반으로 상품과 리뷰를 추천합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "추천 조회 성공",
                    content = @Content(schema = @Schema(implementation = RecommendationResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "추천 결과 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping("/api/recommendations/all")
    public ResponseEntity<RecommendationResponseDTO> getRecommendations() {

        // 사용자 바우만 타입 조회
        Integer baumannId = recommendationsService.getBaumannTypeByUserId();
        RecommendationsUserDTO baumannDTO =
                recommendationsService.getBaumannDTOWithId(baumannId);

        // 추천 조회
        RecommendationResponseDTO response =
                recommendationsService.getRecommendations(baumannDTO);

        return ResponseEntity.ok(response);
    }


    //운영자 픽
    @Operation(
            summary = "운영자 픽 리뷰 조회",
            description = "운영자가 선정한 추천 리뷰를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "운영자 픽 조회 성공"),
            @ApiResponse(responseCode = "404", description = "운영자 픽 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/api/recommendations/admin-pick")
    public ResponseEntity<RecommendationResponseWrapper> getAdminPickRecommendations() {

        RecommendationResponseWrapper response = new RecommendationResponseWrapper();
        response.setMessage("운영자 픽 리뷰 조회에 성공했습니다.");
        response.setAdmin_pick(
                recommendationsService.getRandomRecommendationAdminPicks()
        );

        return ResponseEntity.ok(response);
    }
}
