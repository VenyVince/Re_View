package com.review.shop.dto.product;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Integer product_id;
    private String prd_name;
    private String prd_brand;
    private String image_url;
    private Integer price;
    private String category;
    private float rating;
}
