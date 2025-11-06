package com.review.shop.repository.search;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommonSearchReviewMapper {
    List<ReviewDTO> searchReviews(@Param("keyword") String keyword);
}