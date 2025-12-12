package com.review.shop.repository;

import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ImageMapper {


    int insertProductObjectKey(
            @Param("product_id") int product_id,
            @Param("thumbnail_image") String thumbnail_image,
            @Param("detail_image") String detail_image
    );

    int insertReviewObjectKey(
            @Param("review_id") int review_id,
            @Param("objectKey") String objectKey
    );

    List<String> getBannerImageObjectKeys();
}
