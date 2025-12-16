package com.review.shop.repository.admin;

import com.review.shop.dto.review.ReviewAdminDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminReviewMapper {
    // 리뷰 소프트 삭제
    int deleteReview(@Param("review_id") int review_id);

    // 운영자 리뷰 선택 여부 설정
    int setReviewSelection(
            @Param("review_id") int review_id,
            @Param("is_selected") Integer is_selected
    );

    // 운영자 픽 시 리뷰 작성자 user_id 반환
    int findReviewer(@Param("review_id") int review_id);

    List<ReviewAdminDTO> getAllReviews();
}
