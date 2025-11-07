package com.review.shop.dto.search.header;

import lombok.Data;

// 상품 명/브랜드/바우만타입/성분 검색 가능

@Data
public class HeaderSearchProductDTO {
    private String prd_Name;
    private String prd_brand;
    private int price;
    private float rating;
    private int baumann_id;
    private String baumann_type;
}
