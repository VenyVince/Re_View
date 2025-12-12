package com.review.shop.dto.product;

import lombok.Data;

@Data
public class RecommendationDTO {

    //이미지, 이름, 브랜드, 가격, 평점
    //상품의 대표리뷰도 추가 (좋아요 순)

    //상품 추천 부분
    private int product_id;
    private String image_url;
    private String prd_name;
    private String prd_brand;
    private Integer price;
    private float rating;
    private int match_score;

    //리뷰 추천 부분
    private String top_review_image_url;
    private String top_review_id;
    private String top_review_content;
    private int top_review_likes;
    private float top_review_rating;

}
