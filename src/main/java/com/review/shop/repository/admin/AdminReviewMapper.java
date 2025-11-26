package com.review.shop.repository.admin;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminReviewMapper {
    //리뷰 소프트 삭제
    int deleteReview(int review_id);

    //운영자 리뷰 선택 여부 설정, is_selected는 can null
    int setReviewSelection(int review_id, Integer is_selected);
}
