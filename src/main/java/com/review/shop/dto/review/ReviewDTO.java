package com.review.shop.dto.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private int review_id;
    private String writer;           // user.name 또는 nickname
    private String created_at;       // 작성일
    private String image_url;        // 리뷰 이미지
    private String brand_name;       // 상품 브랜드 이름
    private String product_name;     // 상품 이름
    private int like_count;          // 추천 수
    private int price;               // 가격
    private String content;          // 리뷰 내용
    private float rating;           // 평점
    private String is_selected;     // 베스트 리뷰 선정 여부 ('0' or '1')
    private String is_checked;      // 관리자 확인 여부 ('0' or '1')
    private String product_image;   //상품 썸네일 이미지 (리뷰 사진 없을 때 보여줄 용도)
}