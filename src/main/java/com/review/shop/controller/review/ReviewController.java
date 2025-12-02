package com.review.shop.controller.review;

import com.review.shop.dto.common.PageResponse;
import com.review.shop.dto.review.ReviewDTO;
import com.review.shop.dto.review.ReviewDetailResponseDTO;
import com.review.shop.service.review.ReviewService;
import com.review.shop.util.Security_Util;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Review List", description = "전체 리뷰 조회 API")
public class ReviewController {

    private final ReviewService reviewService;
    private final Security_Util security_Util;

    @GetMapping
    @Operation(summary = "전체 리뷰 목록 조회", description = "전체 리뷰 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 목록 조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버 내부 오류")
    })
    public ResponseEntity<PageResponse<ReviewDTO>> getReviews(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "8") int size,
            @RequestParam(value = "sort", defaultValue = "like_count") String sort,
            @RequestParam(value = "category", required = false) String category) {

        PageResponse<ReviewDTO> reviews = reviewService.getReviewList(page, size, sort, category);

        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{review_id}")
    @Operation(summary = "리뷰 상세 조회", description = "리뷰 내용, 상품 정보, 댓글 목록을 한 번에 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 리뷰 없음")
    })
    public ResponseEntity<ReviewDetailResponseDTO> getReviewDetail(
            @PathVariable int review_id) {

        // 비로그인 사용자도 볼 수 있다면 userId를 0 또는 null로 처리 (로직에 따라 다름)
        // 여기서는 로그인 했다고 가정하고 유틸 사용 (비로그인이면 0 리턴하도록 유틸 수정 필요할 수 있음)
        int user_id = 0;
        try {
            user_id = security_Util.getCurrentUserId();
        } catch (Exception e) {
            // 비로그인 사용자 처리 (userLiked = false 로 나오게 됨)
            user_id = 0;
        }

        ReviewDetailResponseDTO response = reviewService.getReviewDetail(review_id, user_id);
        return ResponseEntity.ok(response);
    }
}