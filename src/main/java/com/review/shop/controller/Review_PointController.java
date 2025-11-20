package com.review.shop.controller;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.product.review_create.CreateReviewRequestDTO;
import com.review.shop.dto.product.review_create.CreateReviewResponseDTO;
import com.review.shop.service.Review_PointService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
@Tag(name = "Review Point API", description = "리뷰 관련 API")
public class Review_PointController {

    private final Review_PointService review_pointService;
    private final Security_Util security_Util;



    @PostMapping("/{product_id}")
    @Operation(summary = "리뷰 작성", description = "리뷰 생성 및 포인트 적립")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    public ResponseEntity<CreateReviewResponseDTO> createReview(
            @PathVariable int product_id,
            @RequestBody CreateReviewRequestDTO request
    ) {
        int user_id = security_Util.getCurrentUserId();

        CreateReviewResponseDTO result = review_pointService.createReviewWithReward(
                product_id,
                user_id,
                request
        );

        return ResponseEntity.ok(result);
    }
}