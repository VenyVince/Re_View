package com.review.shop.repository.admin;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AdminReviewMapper {
    // 리뷰 소프트 삭제
    int deleteReview(@Param("review_id") int reviewId);

    // 운영자 리뷰 선택 여부 설정
    int setReviewSelection(
            @Param("review_id") int reviewId,
            @Param("is_selected") Integer isSelected
    );

    // 운영자 픽 시 리뷰 작성자 user_id 반환
    int findReviewer(@Param("review_id") int reviewId);
}
