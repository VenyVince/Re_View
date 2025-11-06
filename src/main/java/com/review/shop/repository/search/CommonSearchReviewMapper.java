package com.review.shop.repository.search;

import com.review.shop.dto.search.CommonSearchReviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommonSearchReviewMapper {
    List<CommonSearchReviewDTO> searchReviews(@Param("keyword") String keyword);
}