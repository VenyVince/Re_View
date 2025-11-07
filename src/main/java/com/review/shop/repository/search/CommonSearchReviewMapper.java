package com.review.shop.repository.search;

import com.review.shop.dto.search.header.HeaderSearchReviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommonSearchReviewMapper {
    List<HeaderSearchReviewDTO> searchReviews(@Param("keyword") String keyword);
}