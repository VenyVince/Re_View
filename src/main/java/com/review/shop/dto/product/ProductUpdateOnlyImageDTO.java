package com.review.shop.dto.product;

//이미지를 등록하고 , 상품을 등록할때 사용할 DTO

import lombok.Data;

@Data
public class ProductUpdateOnlyImageDTO {
    private String detail_image;
    private String thumbnail_image;
}
