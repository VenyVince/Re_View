package com.review.shop.dto.product;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDetailWithThumbnailDTO {
    private int product_id;
    private String prd_name;
    private String prd_brand;
    private String ingredient;
    private Integer price;
    private String category;
    private Integer stock;
    private Double rating;
    private Integer review_count;
    private Integer baumann_id;
    private Integer is_sold_out;
    private String thumbnail_url;
}