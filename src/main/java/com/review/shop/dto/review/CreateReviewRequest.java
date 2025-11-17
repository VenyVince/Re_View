package com.review.shop.dto.review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequest {
    private String content;      // 리뷰 내용 (필수)
    private double rating;       // 평점 1~5 (필수)
}