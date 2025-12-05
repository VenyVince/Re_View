package com.review.shop.repository;

import org.apache.ibatis.annotations.Param;

public interface ImageMapper {


    int insertProductObjectKey(
            @Param("product_id") int product_id,
            @Param("objectKey") String objectKey,
            @Param("is_thumbnail") String isThumbnail
    );

    int insertReviewObjectKey(
            @Param("review_id") int review_id,
            @Param("objectKey") String objectKey
    );






}
