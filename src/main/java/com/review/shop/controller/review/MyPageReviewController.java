package com.review.shop.controller.review;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.review.MyPageReviewResponseDTO;
import com.review.shop.service.review.MyPageReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/reviews/search")
@RequiredArgsConstructor
@Tag(name = "MyPage Review Search", description = "사용자 리뷰 검색 API")
public class MyPageReviewController {
    private final Security_Util security_util;
    private final MyPageReviewService mypagereviewService;

    @Operation(summary = "사용자 리뷰 검색", description = "사용자가 작성한 리뷰를 키워드, 정렬, 평점 필터로 검색합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음 (ResourceNotFoundException)"),
            @ApiResponse(responseCode = "500", description = "데이터베이스 오류 (DatabaseException)")
    })
    @GetMapping
    public ResponseEntity<MyPageReviewResponseDTO> search(
            @Parameter(description = "검색 키워드", example = "스킨")
            @RequestParam(required = false, defaultValue = "") String keyword,

            @Parameter(description = "정렬 기준(latest, rating 등)", example = "latest")
            @RequestParam(required = false, defaultValue = "latest") String sort,

            @Parameter(description = "평점 필터 (0~5)", example = "4.5")
            @RequestParam(required = false, defaultValue = "0") float filter_rating
    ){
        int user_id = security_util.getCurrentUserId();
        return ResponseEntity.ok(mypagereviewService.search(user_id, keyword, sort, filter_rating));
    }
}
