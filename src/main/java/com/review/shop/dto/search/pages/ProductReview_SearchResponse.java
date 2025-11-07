package com.review.shop.dto.search.pages;

import lombok.Data;

import java.util.List;

@Data
public class ProductReview_SearchResponse {
    private List<ProductReview_SearchDTO> reviews;
}
