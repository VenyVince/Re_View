package com.review.shop.repository.search.pages;

import com.review.shop.dto.search.pages.ProductReview_SearchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductReview_SearchMapper {
    List<ProductReview_SearchDTO> searchReviews(
            @Param("product_id") int product_id,
            @Param("keyword") String keyword,
            @Param("sort") String sort,
            @Param("filter_rating") float filter_rating
    );
}