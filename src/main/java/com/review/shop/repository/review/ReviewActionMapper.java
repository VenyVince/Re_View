package com.review.shop.repository.review;

import com.review.shop.dto.review.community.ReviewCommentResponseDTO;
import com.review.shop.dto.review.community.ReportRequestDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReviewActionMapper {

    // 댓글 (Comment)
    int insertComment(Map<String, Object> params);

    List<ReviewCommentResponseDTO> selectCommentsByReviewId(int review_id);

    int deleteComment(@Param("comment_id") int comment_id, @Param("user_id") int user_id);


    // 추천/비추천 (Like)
    // 이미 반응했는지 확인 ('1', '0', null)
    String checkUserReaction(@Param("review_id") int review_id, @Param("user_id") int user_id);

    // 반응 저장
    int insertReaction(Map<String, Object> params);

    // 반응 취소 토글(삭제)
    int deleteReaction(@Param("review_id") int review_id, @Param("user_id") int user_id);

    // 리뷰 테이블 숫자 업데이트
    int updateReviewReactionCount(
            @Param("review_id") int review_id,
            @Param("type") String type, // 'LIKE' or 'DISLIKE'
            @Param("amount") int amount // 1 or -1
    );


    // 신고 (Report)
    int insertReport(@Param("review_id") int review_id, @Param("user_id") int user_id, @Param("request") ReportRequestDTO request);
}