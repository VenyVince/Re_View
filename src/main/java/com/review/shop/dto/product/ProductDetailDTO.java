package com.review.shop.dto.product;

import lombok.Data;

import java.util.List;

@Data
public class ProductDetailDTO {
    private int product_id;
    private String prd_name;
    private String prd_brand;
    private String ingredient;
    private int price;
    private String category;
    private int stock;
    private double rating;
    private String description;
    private int review_count;
    private int baumann_id;
    private String is_sold_out;
    private List<String> product_images;
}