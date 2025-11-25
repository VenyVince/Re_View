package com.review.shop.repository;

import org.apache.ibatis.annotations.Param;

public interface ImageMapper {

    int insertReviewImage(
            @Param("review_id") int review_id,
            @Param("imageUrl") String imageUrl
    );
}
