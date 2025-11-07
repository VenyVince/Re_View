package com.review.shop.dto.search.header;

import lombok.Data;

// 상품 명/브랜드/바우만타입/성분 검색 가능

@Data
public class HeaderSearchProductDTO {
    private String prd_Name;
    private String prd_brand;
    private String category;
    private int price;
    private float rating;
    private String baumann_type;
    private String description;
}
