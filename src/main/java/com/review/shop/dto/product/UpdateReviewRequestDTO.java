package com.review.shop.dto.product;

import lombok.Data;

import java.util.List;

@Data
public class UpdateReviewRequestDTO {
    private String content;
    private double rating;
    private List<String> imageUrls;
}
