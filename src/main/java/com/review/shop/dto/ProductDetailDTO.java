package com.review.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailDTO {

    private String prdName;
    private String prdBrand;
    private String ingredient;
    private int price;
    private String category;
    private int stock;
    private double rating;
    private String description;
    private int reviewCount;
    private int baumannId;
    private String isSoldOut;
}