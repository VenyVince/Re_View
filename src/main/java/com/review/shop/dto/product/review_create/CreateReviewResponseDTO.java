package com.review.shop.dto.product.review_create;

import lombok.Data;

import java.util.List;

@Data
public class CreateReviewResponseDTO {
    private int review_id;
    private String content;
    private double rating;
    private List<String> imageUrls;
    private int pointsEarned;
}
