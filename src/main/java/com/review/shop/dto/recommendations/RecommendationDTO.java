package com.review.shop.dto.recommendations;

import lombok.Data;

@Data
public class RecommendationDTO {

    private int product_id;
    private String image_url;
    private String prd_name;
    private String prd_brand;
    private Integer price;
    private float rating;

    private int match_score;      // 상품 or 리뷰 기반 추천 점수

    private Integer top_review_id;
    private String top_review_content;
    private Integer top_review_likes;
    private Float top_review_rating;
    private String top_review_image_url;
}
