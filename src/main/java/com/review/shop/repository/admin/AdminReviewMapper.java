package com.review.shop.repository.admin;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminReviewMapper {
    //리뷰 소프트 삭제
    int deleteReview(int review_id);

    //운영자 리뷰 선택 여부 설정, (DB에서 넘어오는)is_selected는 can null
    int setReviewSelection(int review_id, Integer is_selected);

    // 운영자 채택 리뷰 선택시 리뷰 작성자의 포인트 적립을 위해 user_id반환
    int findReviewer(int review_id);
}
