package com.review.shop.dto.recommendations;

import lombok.Data;

@Data
public class RecommendProductDTO {
        private int product_id;

        // 상품 정보
        private String prd_name;
        private String prd_brand;
        private Integer price;
        private float rating;

        // 이미지
        private String product_image_url;

        // 리뷰 관련
        private int review_count;

        // 점수
        private int total_score;
}


