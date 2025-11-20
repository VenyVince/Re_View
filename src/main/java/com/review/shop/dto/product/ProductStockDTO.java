package com.review.shop.dto.product;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductStockDTO {
    private int product_id;
    private int stock;
}