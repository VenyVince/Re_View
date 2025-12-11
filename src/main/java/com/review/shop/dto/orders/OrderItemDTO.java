package com.review.shop.dto.orders;

import lombok.Data;

@Data
public class OrderItemDTO {
    private int order_item_id; // long -> int 변경
    private int order_id;      // long -> int 변경
    private int product_id;
    private String prd_name;
    private int product_price;
    private int quantity;
}