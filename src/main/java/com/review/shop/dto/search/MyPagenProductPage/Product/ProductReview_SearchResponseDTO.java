package com.review.shop.dto.search.MyPagenProductPage.Product;

import lombok.Data;

import java.util.List;

@Data
public class ProductReview_SearchResponseDTO {

    private List<ProductReview_SearchDTO> reviews;
}
