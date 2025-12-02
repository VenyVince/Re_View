package com.review.shop.dto.search.header;

import lombok.Data;

@Data
public class HeaderSearchProductDTO {
    private String product_id;
    private String prd_name;
    private String prd_brand;
    private String category;
    private int price;
    private float rating;
    private String baumann_type;
    private String description;
}