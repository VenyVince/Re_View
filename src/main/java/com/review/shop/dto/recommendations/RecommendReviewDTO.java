package com.review.shop.dto.recommendations;

import lombok.Data;

@Data
public class RecommendReviewDTO {
    // 리뷰 정보
    private int review_id;
    private String content;
    private float review_rating;
    private int like_count;
    private String review_image_url;

    // 상품 정보
    private int product_id;
    private String prd_name;
    private float product_rating;

    // 점수
    private int total_score;

}
