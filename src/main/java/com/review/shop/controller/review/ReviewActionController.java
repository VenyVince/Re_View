package com.review.shop.controller.review;

import com.review.shop.dto.review.community.CommentRequestDTO;
import com.review.shop.dto.review.community.LikeRequestDTO;
import com.review.shop.dto.review.community.ReportRequestDTO;
import com.review.shop.service.review.ReviewActionService;
import com.review.shop.util.Security_Util;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Review Community", description = "리뷰 커뮤니티 기능 (댓글, 추천, 신고) API")
public class ReviewActionController {

    private final ReviewActionService reviewActionService;
    private final Security_Util securityUtil;

    // ==================== 댓글 (Comment) ====================

    @Operation(summary = "댓글 작성", description = "리뷰에 새로운 댓글을 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글 등록 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (로그인 필요)"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @PostMapping("/{review_id}/comments")
    public ResponseEntity<String> addComment(
            @Parameter(description = "대상 리뷰 ID") @PathVariable int review_id,
            @RequestBody CommentRequestDTO request
    ) {
        int user_id = securityUtil.getCurrentUserId();
        reviewActionService.addComment(review_id, user_id, request.getContent());
        return ResponseEntity.ok("댓글이 등록되었습니다.");
    }

    @Operation(summary = "댓글 삭제", description = "본인이 작성한 댓글을 삭제합니다. (Soft Delete)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (로그인 필요)"),
            @ApiResponse(responseCode = "404", description = "해당 댓글이 없거나 삭제 권한 없음"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @DeleteMapping("/comments/{comment_id}")
    public ResponseEntity<String> deleteComment(
            @Parameter(description = "삭제할 댓글 ID") @PathVariable int comment_id
    ) {
        int user_id = securityUtil.getCurrentUserId();
        reviewActionService.deleteComment(comment_id, user_id);
        return ResponseEntity.ok("댓글이 삭제되었습니다.");
    }

    // ==================== 추천/비추천 (Like) ====================

    @Operation(summary = "추천/비추천 토글", description = "리뷰에 추천(좋아요) 또는 비추천(싫어요)을 누릅니다.\n" +
            "- 처음 누르면: 카운트 증가\n" +
            "- 다시 누르면: 취소 (카운트 감소)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "반영 성공 (메시지로 결과 반환)"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (이미 다른 반응을 한 경우 등)"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (로그인 필요)"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @PostMapping("/{review_id}/reaction")
    public ResponseEntity<String> toggleReaction(
            @Parameter(description = "대상 리뷰 ID") @PathVariable int review_id,
            @RequestBody LikeRequestDTO request
    ) {
        int user_id = securityUtil.getCurrentUserId();
        // 결과 메시지 예시: "추천되었습니다." or "반응이 취소되었습니다."
        String resultMessage = reviewActionService.toggleReaction(review_id, user_id, request.getIs_like());
        return ResponseEntity.ok(resultMessage);
    }

    // ==================== 신고 (Report) ====================

    @Operation(summary = "리뷰 신고", description = "부적절한 리뷰를 관리자에게 신고합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "신고 접수 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (로그인 필요)"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @PostMapping("/{review_id}/report")
    public ResponseEntity<String> reportReview(
            @Parameter(description = "신고할 리뷰 ID") @PathVariable int review_id,
            @RequestBody ReportRequestDTO request
    ) {
        int user_id = securityUtil.getCurrentUserId();
        reviewActionService.reportReview(review_id, user_id, request);
        return ResponseEntity.ok("신고가 접수되었습니다. 관리자 검토 후 처리됩니다.");
    }
}