package com.review.shop.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private String product_Id;
    private String prd_name;
    private String prd_brand;
    private String image_url;
    private Integer price;
    private String category;
    private float rating;
}
