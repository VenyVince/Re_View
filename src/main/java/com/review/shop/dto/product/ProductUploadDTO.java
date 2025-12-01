package com.review.shop.dto.product;

//이미지를 등록하고 , 상품을 등록할때 사용할 DTO

import lombok.Data;

import java.util.List;

@Data
public class ProductUploadDTO {
    private List<String> product_images_list;
    private ProductDetailDTO product;
    private String thumbnailUrl;
}
