package com.review.shop.dto.cart;

import lombok.Data;

// 장바구니 조회
@Data
public class CartitemResponseDTO {
    private int cart_items_id;
    private int product_id;
    private String prd_name;
    private String prd_brand;
    private int price;
    private String category;
    private int quantity;
    private Boolean is_sold_out;
}
