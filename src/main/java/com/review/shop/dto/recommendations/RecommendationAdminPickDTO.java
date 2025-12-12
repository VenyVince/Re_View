package com.review.shop.dto.recommendations;

import lombok.Data;

@Data
public class RecommendationAdminPickDTO {

    //상품정보
    int product_id;
    String product_name;
    String product_brand;
    String thumbnail_url;
    int price;

    //리뷰 내용
    String content;


}
