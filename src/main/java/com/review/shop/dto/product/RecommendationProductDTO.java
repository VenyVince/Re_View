package com.review.shop.dto.product;

import lombok.Data;

@Data
public class RecommendationProductDTO {

    //이미지, 이름, 브랜드, 가격, 평점
    private int product_id;
    private String image_url;
    private String prd_name;
    private String prd_brand;
    private Integer price;
    private float rating;
    private int match_score;
}
