package com.review.shop.dto.cart;

import lombok.Data;

//장바구니 추가, 수정 및 삭제
@Data
public class CartitemRequestDTO {
    private int product_id;
    private int quantity;
}