package com.review.shop.dto.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewAdminDTO {
    private int review_id;
    private int price;               // 가격
    private String content;          // 리뷰 내용
    private String is_selected;     // 베스트 리뷰 선정 여부 ('0' or '1')
    private String writer;
}