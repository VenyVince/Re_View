package com.review.shop.service.review;

import com.review.shop.dto.review.community.ReviewCommentResponseDTO;
import com.review.shop.dto.review.community.ReportRequestDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException; // 필요시 사용
import com.review.shop.repository.review.ReviewActionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewActionService {

    private final ReviewActionMapper reviewActionMapper;

    // ==================== 댓글 로직 ====================
    @Transactional(readOnly = true)
    public List<ReviewCommentResponseDTO> getComments(int review_id) {
        try {
            return reviewActionMapper.selectCommentsByReviewId(review_id);
        } catch (DataAccessException e) {
            throw new DatabaseException("댓글 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    @Transactional
    public void addComment(int review_id, int user_id, String content) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("review_id", review_id);
            params.put("user_id", user_id);
            params.put("content", content);

            reviewActionMapper.insertComment(params);
        } catch (DataAccessException e) {
            throw new DatabaseException("댓글 등록 중 DB 오류가 발생했습니다.", e);
        }
    }

    @Transactional
    public void deleteComment(int comment_id, int user_id) {
        try {
            int result = reviewActionMapper.deleteComment(comment_id, user_id);
            if (result == 0) {
                throw new ResourceNotFoundException("삭제 권한이 없거나 이미 삭제된 댓글입니다.");
            }
        } catch (DataAccessException e) {
            throw new DatabaseException("댓글 삭제 중 DB 오류가 발생했습니다.", e);
        }
    }

    // ==================== 추천/비추천 로직 ====================
    @Transactional
    public String toggleReaction(int review_id, int user_id, boolean isLikeRequest) {
        try {
            // 이미 누른 반응이 있는지 확인
            String existingReaction = reviewActionMapper.checkUserReaction(review_id, user_id);

            // 요청: true -> '1', false -> '0'
            String requestType = isLikeRequest ? "1" : "0";
            // 카운트 올릴 컬럼: true -> LIKE, false -> DISLIKE
            String countColumnType = isLikeRequest ? "LIKE" : "DISLIKE";

            // A. 처음 누름 -> 추가
            if (existingReaction == null) {
                Map<String, Object> params = new HashMap<>();
                params.put("review_id", review_id);
                params.put("user_id", user_id);
                params.put("is_like", isLikeRequest); // boolean 그대로 넘김 (XML에서 변환)

                reviewActionMapper.insertReaction(params);
                reviewActionMapper.updateReviewReactionCount(review_id, countColumnType, 1); // +1

                return isLikeRequest ? "추천되었습니다." : "비추천되었습니다.";
            }

            // B. 같은 버튼 또 누름 -> 취소
            else if (existingReaction.equals(requestType)) {
                reviewActionMapper.deleteReaction(review_id, user_id);
                reviewActionMapper.updateReviewReactionCount(review_id, countColumnType, -1); // -1

                return "반응이 취소되었습니다.";
            }

            // C. 다른 버튼 누름 (예: 추천 상태에서 비추천 누름) -> 에러 처리 (간단하게)
            else {
                throw new WrongRequestException("이미 다른 반응을 선택하셨습니다. 취소 후 다시 시도해주세요.");
            }

        } catch (DataAccessException e) {
            throw new DatabaseException("추천/비추천 처리 중 DB 오류가 발생했습니다.", e);
        }
    }

    // ==================== 신고 로직 ====================
    @Transactional
    public void reportReview(int review_id, int user_id, ReportRequestDTO request) {
        try {
            reviewActionMapper.insertReport(review_id, user_id, request);
        } catch (DataAccessException e) {
            throw new DatabaseException("신고 접수 중 DB 오류가 발생했습니다.", e);
        }
    }
}